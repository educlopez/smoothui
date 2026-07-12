"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

export interface ScaleDownFadeProps {
  children: string;
  className?: string;
  /** Delay before the animation starts, in milliseconds. */
  delay?: number;
  /** Animate only once the text scrolls into view. */
  triggerOnView?: boolean;
}

const DURATION_S = 0.52;
const MS = 1000;
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * ScaleDownFade — subtle premium settle-in where the text enters slightly
 * scaled up and drifts down to its natural size. The whole text animates as
 * a single element. From the animate-text catalog (`scale-down-fade`).
 * Safe default for product UIs where copy should feel polished but not animated.
 */
export default function ScaleDownFade({
  children,
  className = "",
  delay = 0,
  triggerOnView = false,
}: ScaleDownFadeProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const shouldReduceMotion = useReducedMotion();
  const play = (!triggerOnView || inView) && !shouldReduceMotion;

  return (
    <motion.span
      animate={play ? { opacity: 1, y: 0, scale: 1 } : undefined}
      aria-label={children}
      className={className}
      initial={
        shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8, scale: 1.04 }
      }
      ref={ref}
      style={{ display: "inline-block" }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : {
              duration: DURATION_S,
              delay: delay / MS,
              ease: EASE,
            }
      }
    >
      {children}
    </motion.span>
  );
}
