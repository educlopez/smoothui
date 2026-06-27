"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

export interface FocusBlurResolveProps {
  children: string;
  className?: string;
  /** Delay before the animation starts, in milliseconds. */
  delay?: number;
  /** Animate only once the text scrolls into view. */
  triggerOnView?: boolean;
}

const DURATION_S = 0.76;
const MS = 1000;
// Smooth deceleration — premium focus-pull ease-out.
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * FocusBlurResolve — whole-text entrance that pulls from heavy blur to crisp,
 * with a subtle upward drift and scale settle. Ideal for hero headlines and
 * section titles where the moment of resolution feels intentional.
 * From the animate-text catalog (`focus-blur-resolve`).
 */
export default function FocusBlurResolve({
  children,
  className = "",
  delay = 0,
  triggerOnView = false,
}: FocusBlurResolveProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const shouldReduceMotion = useReducedMotion();
  const play = (!triggerOnView || inView) && !shouldReduceMotion;

  return (
    <span aria-label={children} className={className} ref={ref}>
      <motion.span
        animate={
          play ? { opacity: 1, y: 0, filter: "blur(0px)", scale: 1 } : undefined
        }
        aria-hidden="true"
        initial={
          shouldReduceMotion
            ? { opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }
            : { opacity: 0, y: 14, filter: "blur(14px)", scale: 1.01 }
        }
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
    </span>
  );
}
