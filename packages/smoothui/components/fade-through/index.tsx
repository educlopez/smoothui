"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

export interface FadeThroughProps {
  className?: string;
  /** Interval between phrase transitions, in milliseconds. */
  interval?: number;
  phrases: string[];
}

const ENTER_DURATION_S = 0.42;
const EXIT_DURATION_S = 0.26;
const ENTER_EASE = [0.2, 0, 0, 1] as const;
const EXIT_EASE = [0.4, 0, 1, 1] as const;

/**
 * FadeThrough — Material-style phrase cycling: old text fades out,
 * new text fades in with a soft delay. From the animate-text catalog
 * (`fade-through`). Best for hero copy swaps and rotating taglines.
 */
export default function FadeThrough({
  phrases,
  className = "",
  interval = 2500,
}: FadeThroughProps) {
  const shouldReduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion || phrases.length <= 1) {
      return;
    }
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length);
    }, interval);
    return () => clearInterval(id);
  }, [shouldReduceMotion, phrases.length, interval]);

  const current = phrases[index] ?? "";

  return (
    <span
      aria-live="polite"
      className={className}
      style={{ display: "inline-block", position: "relative" }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          exit={{
            opacity: 0,
            y: -4,
            scale: 1,
            filter: "blur(0px)",
            transition: { duration: EXIT_DURATION_S, ease: EXIT_EASE },
          }}
          initial={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 0, y: 6, scale: 0.99, filter: "blur(2px)" }
          }
          key={index}
          style={{ display: "inline-block" }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: ENTER_DURATION_S, ease: ENTER_EASE }
          }
        >
          {current}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
