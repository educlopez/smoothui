"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

export interface LineByLineSlideProps {
  /** Text content. Use "\n" to separate lines, or pass `lines` instead. */
  children?: string;
  className?: string;
  /** Delay before the animation starts, in milliseconds. */
  delay?: number;
  /** Explicit line array. Takes precedence over children. */
  lines?: string[];
  /** Per-line stagger, in milliseconds. */
  stagger?: number;
  /** Animate only once the text scrolls into view. */
  triggerOnView?: boolean;
}

const DURATION_S = 0.9;
const MS = 1000;
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * LineByLineSlide — per-line slide-in from the left with a staggered entrance,
 * inspired by Apple landing page subheads. Each line enters from the left for a
 * flowing paragraph reveal. From the animate-text catalog (`line-by-line-slide`).
 * Best for 2-line or 3-line headings.
 */
export default function LineByLineSlide({
  children,
  lines: linesProp,
  className = "",
  delay = 0,
  stagger = 120,
  triggerOnView = false,
}: LineByLineSlideProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const shouldReduceMotion = useReducedMotion();
  const play = (!triggerOnView || inView) && !shouldReduceMotion;

  const lines = linesProp ?? (children ? children.split("\n") : []);
  const label = lines.join(" ");

  return (
    <span
      aria-label={label}
      className={className}
      ref={ref}
      style={{ display: "block" }}
    >
      {lines.map((line, index) => (
        <motion.span
          animate={play ? { opacity: 1, x: 0 } : undefined}
          aria-hidden="true"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -48 }}
          // biome-ignore lint/suspicious/noArrayIndexKey: lines have no stable id
          key={index}
          style={{ display: "block" }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : {
                  duration: DURATION_S,
                  delay: delay / MS + (index * stagger) / MS,
                  ease: EASE,
                }
          }
        >
          {line}
        </motion.span>
      ))}
    </span>
  );
}
