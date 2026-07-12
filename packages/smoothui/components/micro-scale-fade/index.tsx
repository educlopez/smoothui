"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

export interface MicroScaleFadeProps {
  children: string;
  className?: string;
  /** Delay before the animation starts, in milliseconds. */
  delay?: number;
  /** Animate only once the text scrolls into view. */
  triggerOnView?: boolean;
}

const DURATION_S = 0.6;
const MS = 1000;
const EASE = [0.32, 0.72, 0, 1] as const;

/**
 * MicroScaleFade — calm, tiny scale pop used as subtle premium polish for
 * labels and headings. The whole text animates as a single element from
 * scale 0.96 to 1. From the animate-text catalog (`micro-scale-fade`).
 * Best for single words or short titles.
 */
export default function MicroScaleFade({
  children,
  className = "",
  delay = 0,
  triggerOnView = false,
}: MicroScaleFadeProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const shouldReduceMotion = useReducedMotion();
  const play = (!triggerOnView || inView) && !shouldReduceMotion;

  return (
    <motion.span
      animate={play ? { opacity: 1, scale: 1 } : undefined}
      aria-label={children}
      className={className}
      initial={
        shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.96 }
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
