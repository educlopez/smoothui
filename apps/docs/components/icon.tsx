"use client";

import {
  motion,
  useAnimationControls,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const EASE_IN = [0.4, 0, 1, 1] as const;

// A bold ~1.25-turn swirl centered at the origin; spun in place it reads as
// "dizzy" while keeping the chunky weight of the base face.
const SPIRAL = "M0 0C-1 -7 9 -9 11 -1C13 8 2 14 -7 11C-16 8 -17 -4 -11 -11";

export function Icon({ className }: { className?: string }) {
  const shouldReduceMotion = useReducedMotion();

  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [dizzy, setDizzy] = useState(false);
  const [petted, setPetted] = useState(false);
  const [_petDirections, setPetDirections] = useState<number[]>([]);
  const [lastPetX, setLastPetX] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const leftEyeControls = useAnimationControls();
  const rightEyeControls = useAnimationControls();
  // The whole-cup motion (hop, wobble, wake-bob) is imperative: driving it via
  // an `animate` prop re-fires the keyframes on every mousemove re-render.
  const svgControls = useAnimationControls();

  const leftEyeX = useSpring(0, { stiffness: 250, damping: 40 });
  const leftEyeY = useSpring(0, { stiffness: 250, damping: 40 });
  const rightEyeX = useSpring(0, { stiffness: 250, damping: 40 });
  const rightEyeY = useSpring(0, { stiffness: 250, damping: 40 });

  const mouthX = useTransform(
    [leftEyeX, rightEyeX],
    ([lx, rx]: number[]) => ((lx + rx) / 2) * 0.3
  );
  const mouthY = useTransform(
    [leftEyeY, rightEyeY],
    ([ly, ry]: number[]) => ((ly + ry) / 2) * 0.3
  );

  const leftEyeCenter = { x: 143, y: 301 };
  const rightEyeCenter = { x: 277, y: 301 };
  const eyeRadius = 18;

  // A natural blink: snap shut, ease back open. Sometimes a quick double.
  const blink = useCallback(
    async (double = false) => {
      const close = { scaleY: 0.06 };
      const open = { scaleY: 1 };
      const closeT = { duration: 0.07, ease: EASE_IN };
      const openT = { duration: 0.16, ease: EASE_OUT };
      await Promise.all([
        leftEyeControls.start(close, closeT),
        rightEyeControls.start(close, closeT),
      ]);
      await Promise.all([
        leftEyeControls.start(open, double ? closeT : openT),
        rightEyeControls.start(open, double ? closeT : openT),
      ]);
      if (double) {
        await blink(false);
      }
    },
    [leftEyeControls, rightEyeControls]
  );

  // Mouse tracking
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY });
      setHasMoved(true);
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  // Eye movement follows the cursor
  useEffect(() => {
    if (!(svgRef.current && hasMoved)) {
      return;
    }
    const svgRect = svgRef.current.getBoundingClientRect();
    const calc = (x: number, y: number) => {
      const centerX = svgRect.left + x * (svgRect.width / 443);
      const centerY = svgRect.top + y * (svgRect.height / 597);
      const dx = mouse.x - centerX;
      const dy = mouse.y - centerY;
      const angle = Math.atan2(dy, dx);
      const dist = Math.min(Math.sqrt(dx * dx + dy * dy) / 10, eyeRadius);
      return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist };
    };
    const left = calc(leftEyeCenter.x, leftEyeCenter.y);
    const right = calc(rightEyeCenter.x, rightEyeCenter.y);
    leftEyeX.set(left.x);
    leftEyeY.set(left.y);
    rightEyeX.set(right.x);
    rightEyeY.set(right.y);
  }, [mouse, hasMoved, leftEyeX, leftEyeY, rightEyeX, rightEyeY]);

  // Idle blinking (occasionally a double blink)
  useEffect(() => {
    if (shouldReduceMotion) {
      return;
    }
    let timeout: NodeJS.Timeout;
    let mounted = true;
    const schedule = () => {
      timeout = setTimeout(
        () => {
          if (mounted && !(dizzy || petted)) {
            blink(Math.random() < 0.25);
          }
          schedule();
        },
        3500 + Math.random() * 2500
      );
    };
    schedule();
    return () => {
      mounted = false;
      clearTimeout(timeout);
    };
  }, [blink, shouldReduceMotion, dizzy, petted]);

  // Click → blink; spam (5 within 2s) → dizzy
  useEffect(() => {
    const handleClick = () => {
      const now = Date.now();
      const next = now - lastClickTime < 2000 ? clickCount + 1 : 1;
      setClickCount(next);
      setLastClickTime(now);
      if (!dizzy && next >= 5) {
        setDizzy(true);
      } else if (!(dizzy || petted)) {
        blink();
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [blink, clickCount, lastClickTime, dizzy, petted]);

  // Dizzy resets after the spin settles
  useEffect(() => {
    if (!dizzy) {
      return;
    }
    const timeout = setTimeout(() => {
      setDizzy(false);
      setClickCount(0);
    }, 2200);
    return () => clearTimeout(timeout);
  }, [dizzy]);

  // Petting: rapid left-right strokes over the icon
  useEffect(() => {
    if (!svgRef.current) {
      return;
    }
    const handleMove = (e: MouseEvent) => {
      if (!svgRef.current || dizzy) {
        return;
      }
      const r = svgRef.current.getBoundingClientRect();
      if (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      ) {
        setLastPetX(null);
        setPetDirections([]);
        return;
      }
      if (lastPetX !== null) {
        const dir = e.clientX > lastPetX ? 1 : -1;
        setPetDirections((prev) => {
          if (prev.length === 0 || prev.at(-1) !== dir) {
            const now = Date.now();
            const filtered = prev.filter((_, i) => now - prev[i] < 3000);
            if (filtered.length >= 2 && !petted) {
              setPetted(true);
              return [];
            }
            return [...filtered, now, dir];
          }
          return prev;
        });
      }
      setLastPetX(e.clientX);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [petted, dizzy, lastPetX]);

  // Petted resets after the happy hop
  useEffect(() => {
    if (!petted) {
      return;
    }
    const timeout = setTimeout(() => setPetted(false), 1300);
    return () => clearTimeout(timeout);
  }, [petted]);

  // Petted hop (imperative)
  useEffect(() => {
    if (shouldReduceMotion || !petted) {
      return;
    }
    svgControls.start(
      {
        y: [0, 8, -36, 0, -11, 0],
        scaleY: [1, 0.84, 1.14, 0.9, 1.04, 1],
        scaleX: [1, 1.14, 0.9, 1.08, 0.98, 1],
        rotate: [0, 0, -3, 3, -1, 0],
      },
      {
        duration: 0.95,
        times: [0, 0.12, 0.4, 0.62, 0.82, 1],
        ease: EASE_OUT,
      }
    );
  }, [petted, svgControls, shouldReduceMotion]);

  // Dizzy wobble (imperative)
  useEffect(() => {
    if (shouldReduceMotion || !dizzy) {
      return;
    }
    svgControls.start(
      {
        rotate: [0, -13, 11, -10, 8, -5, 4, 0],
        x: [0, -8, 7, -6, 4, -2, 2, 0],
      },
      { duration: 1.05, repeat: 1, ease: [0.45, 0, 0.55, 1] }
    );
    return () => {
      svgControls.start({ rotate: 0, x: 0 }, { duration: 0.2 });
    };
  }, [dizzy, svgControls, shouldReduceMotion]);

  const renderMouth = () => {
    if (dizzy) {
      // woozy wavy mouth
      return (
        <motion.path
          animate={{ pathLength: 1 }}
          className="stroke-background"
          d="M150 435 q18 -24 36 0 t36 0 t36 0"
          fill="none"
          initial={{ pathLength: 0 }}
          stroke="black"
          strokeLinecap="round"
          strokeWidth={30}
          transition={{ duration: 0.4 }}
        />
      );
    }
    if (petted) {
      return (
        <motion.path
          animate={{ pathLength: 1 }}
          className="stroke-background"
          d="M150 432 Q221.5 504 293 432"
          fill="none"
          initial={{ pathLength: 0 }}
          stroke="black"
          strokeLinecap="round"
          strokeWidth={32}
          transition={{ duration: 0.45, ease: EASE_OUT }}
        />
      );
    }
    return (
      <motion.path
        className="fill-background"
        d="M267.87 407C271.243 407.191 274.227 407.739 276.959 409.87C280.247 412.433 282.139 416.941 282.582 421.005C283.16 426.325 280.833 430.766 277.515 434.744C263.501 451.546 243.234 461.076 221.624 462.945C197.225 465.055 169.441 458.247 150.573 442.257C145.626 437.542 139.761 432.101 138.333 425.133C137.544 421.285 138.13 417.11 140.381 413.842C142.787 410.346 146.747 408.061 150.91 407.413C161.065 405.834 166.456 416.009 173.71 421.169C192.365 434.442 223.95 436.953 243.492 424.269C251.723 418.926 257.881 408.707 267.87 407Z"
        fill="black"
        style={{ x: mouthX, y: mouthY }}
      />
    );
  };

  const eyesVisible = !(dizzy || petted);

  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: brand logomark
    <motion.svg
      animate={svgControls}
      className={className}
      fill="none"
      height="597"
      ref={svgRef}
      style={{ display: "block", transformOrigin: "50% 88%" }}
      viewBox="0 0 443 597"
      width="443"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className="fill-foreground"
        d="M209.511 81.9998C100.987 81.9998 13.0107 169.976 13.0107 278.5H406.011C406.011 169.976 318.035 81.9998 209.511 81.9998Z"
        fill="#FF64B1"
      />
      <path
        className="fill-foreground"
        d="M31.0107 279.07C37.7797 279.924 88.001 279.07 88.001 279.07L211.001 279.07C211.001 279.07 281.395 279.102 326.501 279.07C351.033 279.052 340.501 279 389.319 279C388.843 284.983 387.765 291.019 386.954 296.974L382.314 331.242L369.406 431.749C366.068 458.502 363.366 485.334 359.909 512.07C358.404 523.711 357.483 536.169 354.621 547.539C353.444 550.459 352.034 553.106 350.13 555.612C331.041 580.737 284.184 588.95 254.396 593.075C239.067 595.309 223.592 596.385 208.102 596.296C173.519 595.829 109.775 586.855 81.9698 565.58C75.7968 560.856 70.0768 555.028 67.6848 547.463C65.4648 540.44 65.0338 532.242 64.0218 524.955L57.9317 481.252L31.0107 279.07Z"
        fill="#FF64B1"
      />
      {renderMouth()}
      <rect
        className="fill-foreground"
        fill="#FF64B1"
        height="76"
        rx="10"
        width="420"
        y="251"
      />
      <path
        className="fill-foreground"
        d="M335.493 11.8972C335.898 12.0719 336.283 12.2729 336.652 12.4924L433.04 54.1314C438.11 56.3216 440.444 62.2072 438.254 67.2772L430.322 85.6372C428.132 90.707 422.247 93.0417 417.177 90.8515L328.776 52.6628L290.686 140.835C288.496 145.905 282.61 148.24 277.54 146.049L259.18 138.118C254.11 135.928 251.776 130.042 253.966 124.972L303.987 9.18003C306.178 4.11004 312.063 1.77552 317.133 3.96573L335.493 11.8972Z"
        fill="#FF64B1"
      />

      {/* Normal eyes */}
      {eyesVisible && (
        <>
          <motion.rect
            animate={leftEyeControls}
            className="fill-background"
            fill="black"
            height="157"
            rx="18"
            style={{
              x: leftEyeX,
              y: leftEyeY,
              transformOrigin: `${leftEyeCenter.x}px ${leftEyeCenter.y}px`,
            }}
            transition={{ duration: 0.08 }}
            width="50"
            x="118"
            y="222"
          />
          <motion.rect
            animate={rightEyeControls}
            className="fill-background"
            fill="black"
            height="157"
            rx="18"
            style={{
              x: rightEyeX,
              y: rightEyeY,
              transformOrigin: `${rightEyeCenter.x}px ${rightEyeCenter.y}px`,
            }}
            transition={{ duration: 0.08 }}
            width="50"
            x="252"
            y="222"
          />
        </>
      )}

      {/* Happy arc eyes (petted) */}
      {petted && (
        <>
          <motion.path
            animate={{ pathLength: 1 }}
            className="stroke-background"
            d={`M${leftEyeCenter.x - 30} ${leftEyeCenter.y + 10} Q${leftEyeCenter.x} ${leftEyeCenter.y - 44} ${leftEyeCenter.x + 30} ${leftEyeCenter.y + 10}`}
            fill="none"
            initial={{ pathLength: 0 }}
            stroke="black"
            strokeLinecap="round"
            strokeWidth={40}
            transition={{ duration: 0.4, ease: EASE_OUT }}
          />
          <motion.path
            animate={{ pathLength: 1 }}
            className="stroke-background"
            d={`M${rightEyeCenter.x - 30} ${rightEyeCenter.y + 10} Q${rightEyeCenter.x} ${rightEyeCenter.y - 44} ${rightEyeCenter.x + 30} ${rightEyeCenter.y + 10}`}
            fill="none"
            initial={{ pathLength: 0 }}
            stroke="black"
            strokeLinecap="round"
            strokeWidth={40}
            transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.08 }}
          />
        </>
      )}

      {/* Dizzy spiral eyes */}
      {dizzy && (
        <>
          <motion.path
            animate={{ rotate: 360 }}
            className="stroke-background"
            d={SPIRAL}
            fill="none"
            stroke="black"
            strokeLinecap="round"
            strokeWidth={11}
            style={{
              x: leftEyeCenter.x,
              y: leftEyeCenter.y,
              scale: 2,
            }}
            transition={{ duration: 1.1, repeat: 1, ease: "linear" }}
          />
          <motion.path
            animate={{ rotate: -360 }}
            className="stroke-background"
            d={SPIRAL}
            fill="none"
            stroke="black"
            strokeLinecap="round"
            strokeWidth={11}
            style={{
              x: rightEyeCenter.x,
              y: rightEyeCenter.y,
              scale: 2,
            }}
            transition={{ duration: 1.1, repeat: 1, ease: "linear" }}
          />
        </>
      )}
    </motion.svg>
  );
}
