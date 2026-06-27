"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

export interface ShimmerSweepProps {
  children: string;
  className?: string;
  /** Delay before the animation starts, in milliseconds. */
  delay?: number;
  /** Animate only once the text scrolls into view. */
  triggerOnView?: boolean;
}

const DURATION_S = 0.85;
const MS = 1000;
// Apple's signature ease-out.
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * ShimmerSweep — whole-text fade-in with a left-to-center slide and blur
 * dissolve. A subtle sweep across a clean headline, blending in while gliding
 * from left to center. From the animate-text catalog (`shimmer-sweep`).
 * Best on hero titles and section headings.
 */
const ShimmerSweep = ({
  children,
  className = "",
  delay = 0,
  triggerOnView = false,
}: ShimmerSweepProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const shouldReduceMotion = useReducedMotion();
  const play = (!triggerOnView || inView) && !shouldReduceMotion;

  return (
    <span aria-label={children} className={className} ref={ref}>
      <motion.span
        animate={play ? { opacity: 1, x: 0, filter: "blur(0px)" } : undefined}
        aria-hidden="true"
        initial={
          shouldReduceMotion
            ? { opacity: 1, x: 0, filter: "blur(0px)" }
            : { opacity: 0, x: -22, filter: "blur(8px)" }
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
};

export default ShimmerSweep;
