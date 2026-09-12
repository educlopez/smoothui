"use client";

import {
  motion,
  useAnimationControls,
  useInView,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

export type MascotExpression =
  | "neutral"
  | "curious"
  | "happy"
  | "wink"
  | "dizzy";
interface IconProps {
  className?: string;
  expression?: MascotExpression;
  /** Increment to replay the same expression after another explicit action. */
  reactionKey?: number;
}
const REST = { rotate: 0, scaleX: 1, scaleY: 1, y: 0 };
const SPIRAL = "M0 0C-1 -7 9 -9 11 -1C13 8 2 14 -7 11C-16 8 -17 -4 -11 -11";
const REACTIONS = {
  curious: {
    rotate: [0, -7, 3, 0],
    scaleX: [1, 0.97, 1],
    scaleY: [1, 1.04, 1],
    y: [0, -8, 0],
  },
  dizzy: {
    rotate: [0, -12, 10, -6, 0],
    scaleX: [1, 0.96, 1],
    scaleY: [1, 1.04, 1],
    y: [0, -5, 0],
  },
  happy: {
    rotate: [0, -4, 4, 0],
    scaleX: [1, 1.12, 0.94, 1],
    scaleY: [1, 0.88, 1.08, 1],
    y: [0, 8, -32, 0],
  },
  neutral: REST,
  wink: {
    rotate: [0, -8, 0],
    scaleX: [1, 1.04, 1],
    scaleY: [1, 0.96, 1],
    y: [0, -10, 0],
  },
};

/** The brand silhouette stays fixed; expressions belong to this instance only. */
export function Icon({ className, expression, reactionKey = 0 }: IconProps) {
  const ref = useRef<SVGSVGElement>(null);
  const visible = useInView(ref);
  const reduced = useReducedMotion();
  const controls = useAnimationControls();
  const [localExpression, setLocalExpression] =
    useState<MascotExpression>("neutral");
  const face = expression ?? localExpression;
  const eyeX = useSpring(0, { damping: 30, stiffness: 300 });
  const eyeY = useSpring(0, { damping: 30, stiffness: 300 });
  const mouthX = useTransform(eyeX, (value) => value * 0.3);
  const mouthY = useTransform(eyeY, (value) => value * 0.3);

  useEffect(() => {
    const svg = ref.current;
    if (!(svg && visible)) {
      return;
    }
    // Listen to the existing home link/companion button, never the document.
    const target = svg.closest("a, button") ?? svg;
    let greetingTimer: ReturnType<typeof setTimeout> | undefined;
    const greet = () => {
      clearTimeout(greetingTimer);
      setLocalExpression("wink");
      greetingTimer = setTimeout(() => setLocalExpression("curious"), 700);
    };
    const reset = () => {
      clearTimeout(greetingTimer);
      setLocalExpression("neutral");
      eyeX.set(0);
      eyeY.set(0);
    };
    const follow = (event: Event) => {
      if (
        reduced ||
        !(event instanceof PointerEvent) ||
        event.pointerType !== "mouse"
      ) {
        return;
      }
      const rect = target.getBoundingClientRect();
      eyeX.set(
        Math.max(
          -18,
          Math.min(18, ((event.clientX - rect.left) / rect.width - 0.5) * 36)
        )
      );
      eyeY.set(
        Math.max(
          -14,
          Math.min(14, ((event.clientY - rect.top) / rect.height - 0.5) * 28)
        )
      );
    };
    target.addEventListener("pointerenter", greet);
    target.addEventListener("focus", greet);
    target.addEventListener("pointermove", follow, { passive: true });
    target.addEventListener("pointerleave", reset);
    target.addEventListener("blur", reset);
    return () => {
      clearTimeout(greetingTimer);
      target.removeEventListener("pointerenter", greet);
      target.removeEventListener("focus", greet);
      target.removeEventListener("pointermove", follow);
      target.removeEventListener("pointerleave", reset);
      target.removeEventListener("blur", reset);
    };
  }, [visible, reduced, eyeX, eyeY]);

  useEffect(() => {
    controls.stop();
    if (reduced || !visible) {
      controls.set(REST);
      eyeX.jump(0);
      eyeY.jump(0);
      return;
    }
    // A replay key represents an explicit new user action, not a render.
    if (reactionKey >= 0) {
      controls.start({
        ...REACTIONS[face],
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
      });
    }
    return () => controls.stop();
  }, [face, reactionKey, reduced, visible, controls, eyeX, eyeY]);

  const mouth =
    face === "dizzy"
      ? "M150 435 q18 -24 36 0 t36 0 t36 0"
      : "M150 432 Q221.5 494 293 432";
  return (
    <motion.svg
      aria-hidden="true"
      animate={controls}
      className={className}
      data-expression={face}
      fill="none"
      height="597"
      ref={ref}
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
      <motion.path
        className="stroke-background"
        d={mouth}
        fill="none"
        strokeLinecap="round"
        strokeWidth={30}
        style={{ x: mouthX, y: mouthY }}
      />
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

      <motion.g style={{ x: eyeX, y: eyeY }}>
        {[143, 277].map((x) => {
          if (face === "dizzy") {
            return (
              <path
                key={x}
                className="stroke-background"
                d={SPIRAL}
                fill="none"
                strokeLinecap="round"
                strokeWidth={11}
                transform={`translate(${x} 301) scale(2)`}
              />
            );
          }
          if (face === "happy" || (face === "wink" && x === 277)) {
            return (
              <path
                key={x}
                className="stroke-background"
                d={`M${x - 30} 311 Q${x} 257 ${x + 30} 311`}
                fill="none"
                strokeLinecap="round"
                strokeWidth={40}
              />
            );
          }
          return (
            <rect
              key={x}
              className="fill-background"
              height={face === "curious" && x === 277 ? 120 : 157}
              rx="18"
              width="50"
              x={x - 25}
              y="222"
            />
          );
        })}
      </motion.g>
    </motion.svg>
  );
}
