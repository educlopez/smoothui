"use client";

import {
  motion,
  useAnimationControls,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

export function Icon({ className }: { className?: string }) {
  // Eye logic
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [defeated, setDefeated] = useState(false);
  const [petted, setPetted] = useState(false);
  const [petDirections, setPetDirections] = useState<number[]>([]);
  const [lastPetX, setLastPetX] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Animation controls for blinking
  const leftEyeControls = useAnimationControls();
  const rightEyeControls = useAnimationControls();

  // Springs for eye movement
  const leftEyeX = useSpring(0, { stiffness: 250, damping: 40 });
  const leftEyeY = useSpring(0, { stiffness: 250, damping: 40 });
  const rightEyeX = useSpring(0, { stiffness: 250, damping: 40 });
  const rightEyeY = useSpring(0, { stiffness: 250, damping: 40 });

  // Derived mouth movement (average of eyes, scaled)
  const mouthX = useTransform(
    [leftEyeX, rightEyeX],
    ([lx, rx]: number[]) => ((lx + rx) / 2) * 0.3
  );
  const mouthY = useTransform(
    [leftEyeY, rightEyeY],
    ([ly, ry]: number[]) => ((ly + ry) / 2) * 0.3
  );

  // Eye centers (from SVG, adjust as needed)
  const leftEyeCenter = { x: 143, y: 301 }; // 118 + 50/2, 222 + 157/2
  const rightEyeCenter = { x: 277, y: 301 }; // 252 + 50/2, 222 + 157/2
  const eyeRadius = 18; // How far the pupil can move

  // Mouse tracking
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY });
      setHasMoved(true);
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  // Eye movement logic
  useEffect(() => {
    if (!(svgRef.current && hasMoved)) return;
    const svgRect = svgRef.current.getBoundingClientRect();

    function calc(x: number, y: number) {
      const centerX = svgRect.left + x * (svgRect.width / 443);
      const centerY = svgRect.top + y * (svgRect.height / 597);
      const dx = mouse.x - centerX;
      const dy = mouse.y - centerY;
      const angle = Math.atan2(dy, dx);
      const dist = Math.min(Math.sqrt(dx * dx + dy * dy) / 10, eyeRadius);
      return {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
      };
    }

    const left = calc(leftEyeCenter.x, leftEyeCenter.y);
    const right = calc(rightEyeCenter.x, rightEyeCenter.y);

    leftEyeX.set(left.x);
    leftEyeY.set(left.y);
    rightEyeX.set(right.x);
    rightEyeY.set(right.y);
  }, [mouse, hasMoved, leftEyeX, leftEyeY, rightEyeX, rightEyeY]);

  // Blinking logic
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let mounted = true;
    const blink = async () => {
      if (!mounted) return;
      await Promise.all([
        leftEyeControls.start({ scaleY: 0.1 }),
        rightEyeControls.start({ scaleY: 0.1 }),
      ]);
      if (!mounted) return;
      await Promise.all([
        leftEyeControls.start({ scaleY: 1 }),
        rightEyeControls.start({ scaleY: 1 }),
      ]);
    };
    const schedule = () => {
      timeout = setTimeout(
        () => {
          blink();
          schedule();
        },
        4000 + Math.random() * 2000
      );
    };
    schedule();
    return () => {
      mounted = false;
      clearTimeout(timeout);
    };
  }, [leftEyeControls, rightEyeControls]);

  // Remove click-to-blink that causes eye movement
  useEffect(() => {
    const blink = async () => {
      await Promise.all([
        leftEyeControls.start({ scaleY: 0.1 }),
        rightEyeControls.start({ scaleY: 0.1 }),
      ]);
      await Promise.all([
        leftEyeControls.start({ scaleY: 1 }),
        rightEyeControls.start({ scaleY: 1 }),
      ]);
    };
    // Only trigger blink on click, not eye movement
    const handleClick = () => {
      // Defeat logic
      const now = Date.now();
      if (now - lastClickTime < 2000) {
        setClickCount((prev) => prev + 1);
      } else {
        setClickCount(1);
      }
      setLastClickTime(now);
      if (!defeated && clickCount + 1 >= 5) {
        setDefeated(true);
      } else if (!defeated) {
        blink();
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [leftEyeControls, rightEyeControls, clickCount, lastClickTime, defeated]);

  // Defeat state reset
  useEffect(() => {
    if (defeated) {
      const timeout = setTimeout(() => {
        setDefeated(false);
        setClickCount(0);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [defeated]);

  // Petting logic: detect 5 rapid left-right changes over SVG
  useEffect(() => {
    if (!svgRef.current) return;
    const handleMove = (e: MouseEvent) => {
      if (!svgRef.current || defeated) return;
      const svgRect = svgRef.current.getBoundingClientRect();
      if (
        e.clientX < svgRect.left ||
        e.clientX > svgRect.right ||
        e.clientY < svgRect.top ||
        e.clientY > svgRect.bottom
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
    return () => {
      window.removeEventListener("mousemove", handleMove);
    };
  }, [petted, defeated, lastPetX]);

  // Cuando petted se activa, lo desactivamos tras la duración real de la animación (1.4s)
  useEffect(() => {
    if (petted) {
      const timeout = setTimeout(() => {
        setPetted(false);
      }, 1400); // 0.7s * 2 repeticiones = 1.4s
      return () => clearTimeout(timeout);
    }
  }, [petted]);

  // Render mouth based on state
  const renderMouth = () => {
    if (defeated) {
      return (
        <circle
          className="fill-background"
          cx={221.5}
          cy={435}
          fill="black"
          r={20}
        />
      );
    }
    if (petted) {
      return (
        <motion.path
          animate={{ pathLength: 1 }}
          className="stroke-background"
          d="M150 435 Q221.5 485 293 435"
          fill="none"
          initial={{ pathLength: 0 }}
          stroke="black"
          strokeWidth={20}
          transition={{ duration: 0.5 }}
        />
      );
    }
    return (
      <motion.path
        className="fill-background"
        d="M267.87 407C271.243 407.191 274.227 407.739 276.959 409.87C280.247 412.433 282.139 416.941 282.582 421.005C283.16 426.325 280.833 430.766 277.515 434.744C263.501 451.546 243.234 461.076 221.624 462.945C197.225 465.055 169.441 458.247 150.573 442.257C145.626 437.542 139.761 432.101 138.333 425.133C137.544 421.285 138.13 417.11 140.381 413.842C142.787 410.346 146.747 408.061 150.91 407.413C161.065 405.834 166.456 416.009 173.71 421.169C192.365 434.442 223.95 436.953 243.492 424.269C251.723 418.926 257.881 408.707 267.87 407Z"
        fill="black"
        style={{
          x: mouthX,
          y: mouthY,
        }}
      />
    );
  };

  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: "title icon logo"
    <motion.svg
      animate={petted && !defeated ? { y: [0, -18, 0, -8, 0] } : { y: 0 }}
      className={className}
      fill="none"
      height="597"
      ref={svgRef}
      style={{ display: "block" }}
      transition={
        petted && !defeated
          ? { duration: 0.7, times: [0, 0.2, 0.5, 0.7, 1], repeat: 2 }
          : {}
      }
      viewBox="0 0 443 597"
      width="443"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Top pink shape */}
      <path
        className="fill-foreground"
        d="M209.511 81.9998C100.987 81.9998 13.0107 169.976 13.0107 278.5H406.011C406.011 169.976 318.035 81.9998 209.511 81.9998Z"
        fill="#FF64B1"
      />
      {/* Bottom pink shape */}
      <path
        className="fill-foreground"
        d="M31.0107 279.07C37.7797 279.924 88.001 279.07 88.001 279.07L211.001 279.07C211.001 279.07 281.395 279.102 326.501 279.07C351.033 279.052 340.501 279 389.319 279C388.843 284.983 387.765 291.019 386.954 296.974L382.314 331.242L369.406 431.749C366.068 458.502 363.366 485.334 359.909 512.07C358.404 523.711 357.483 536.169 354.621 547.539C353.444 550.459 352.034 553.106 350.13 555.612C331.041 580.737 284.184 588.95 254.396 593.075C239.067 595.309 223.592 596.385 208.102 596.296C173.519 595.829 109.775 586.855 81.9698 565.58C75.7968 560.856 70.0768 555.028 67.6848 547.463C65.4648 540.44 65.0338 532.242 64.0218 524.955L57.9317 481.252L31.0107 279.07Z"
        fill="#FF64B1"
      />
      {/* Mouth */}
      {renderMouth()}
      {/* Pink band/rect */}
      <rect
        className="fill-foreground"
        fill="#FF64B1"
        height="76"
        rx="10"
        width="420"
        y="251"
      />
      {/* Pink horn/decorative element */}
      <path
        className="fill-foreground"
        d="M335.493 11.8972C335.898 12.0719 336.283 12.2729 336.652 12.4924L433.04 54.1314C438.11 56.3216 440.444 62.2072 438.254 67.2772L430.322 85.6372C428.132 90.707 422.247 93.0417 417.177 90.8515L328.776 52.6628L290.686 140.835C288.496 145.905 282.61 148.24 277.54 146.049L259.18 138.118C254.11 135.928 251.776 130.042 253.966 124.972L303.987 9.18003C306.178 4.11004 312.063 1.77552 317.133 3.96573L335.493 11.8972Z"
        fill="#FF64B1"
      />
      {/* Left Eye */}
      {!(defeated || petted) && (
        <motion.rect
          animate={leftEyeControls}
          className="fill-background"
          fill="black"
          height="157"
          rx="18"
          style={{
            x: leftEyeX,
            y: leftEyeY,
          }}
          transformOrigin={`${leftEyeCenter.x}px ${leftEyeCenter.y}px`}
          transition={{ duration: 0.08 }}
          width="50"
          x="118"
          y="222"
        />
      )}
      {/* Left Eye Happy Arc */}
      {petted && !defeated && (
        <motion.path
          animate={{ pathLength: 1 }}
          className="stroke-background"
          d={`M${leftEyeCenter.x - 25} ${leftEyeCenter.y} Q${
            leftEyeCenter.x
          } ${leftEyeCenter.y + 25} ${leftEyeCenter.x + 25} ${leftEyeCenter.y}`}
          fill="none"
          initial={{ pathLength: 0 }}
          stroke="black"
          strokeWidth={20}
          transition={{ duration: 0.4 }}
        />
      )}
      {/* Right Eye */}
      {!(defeated || petted) && (
        <motion.rect
          animate={rightEyeControls}
          className="fill-background"
          fill="black"
          height="157"
          rx="18"
          style={{
            x: rightEyeX,
            y: rightEyeY,
          }}
          transformOrigin={`${rightEyeCenter.x}px ${rightEyeCenter.y}px`}
          transition={{ duration: 0.08 }}
          width="50"
          x="252"
          y="222"
        />
      )}
      {/* Right Eye Happy Arc */}
      {petted && !defeated && (
        <motion.path
          animate={{ pathLength: 1 }}
          className="stroke-background"
          d={`M${rightEyeCenter.x - 25} ${rightEyeCenter.y} Q${
            rightEyeCenter.x
          } ${rightEyeCenter.y + 25} ${rightEyeCenter.x + 25} ${
            rightEyeCenter.y
          }`}
          fill="none"
          initial={{ pathLength: 0 }}
          stroke="black"
          strokeWidth={20}
          transition={{ duration: 0.4, delay: 0.1 }}
        />
      )}
      {/* Defeated Eyes (X) */}
      {defeated && (
        <g>
          {/* Left Eye X */}
          <motion.line
            animate={{ pathLength: 1 }}
            className="stroke-background"
            initial={{ pathLength: 0 }}
            stroke="black"
            strokeWidth={14}
            transition={{ duration: 0.2 }}
            x1={leftEyeCenter.x - 25}
            x2={leftEyeCenter.x + 25}
            y1={leftEyeCenter.y - 78}
            y2={leftEyeCenter.y + 78}
          />
          <motion.line
            animate={{ pathLength: 1 }}
            className="stroke-background"
            initial={{ pathLength: 0 }}
            stroke="black"
            strokeWidth={14}
            transition={{ duration: 0.2, delay: 0.1 }}
            x1={leftEyeCenter.x + 25}
            x2={leftEyeCenter.x - 25}
            y1={leftEyeCenter.y - 78}
            y2={leftEyeCenter.y + 78}
          />
          {/* Right Eye X */}
          <motion.line
            animate={{ pathLength: 1 }}
            className="stroke-background"
            initial={{ pathLength: 0 }}
            stroke="black"
            strokeWidth={14}
            transition={{ duration: 0.2 }}
            x1={rightEyeCenter.x - 25}
            x2={rightEyeCenter.x + 25}
            y1={rightEyeCenter.y - 78}
            y2={rightEyeCenter.y + 78}
          />
          <motion.line
            animate={{ pathLength: 1 }}
            className="stroke-background"
            initial={{ pathLength: 0 }}
            stroke="black"
            strokeWidth={14}
            transition={{ duration: 0.2, delay: 0.1 }}
            x1={rightEyeCenter.x + 25}
            x2={rightEyeCenter.x - 25}
            y1={rightEyeCenter.y - 78}
            y2={rightEyeCenter.y + 78}
          />
        </g>
      )}
    </motion.svg>
  );
}
