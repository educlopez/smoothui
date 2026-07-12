"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

export interface SharedAxisXProps {
  className?: string;
  /** Interval between phrase swaps in milliseconds. */
  interval?: number;
  phrases: string[];
}

const ENTER_EASE = [0.2, 0, 0, 1] as const;
const EXIT_EASE = [0.4, 0, 1, 1] as const;

/**
 * SharedAxisX — horizontal shared-axis phrase transition inspired by Google Material.
 * Outgoing phrase slides left as the next slides in from the right.
 * From the animate-text catalog (`shared-axis-x`).
 */
export default function SharedAxisX({
  phrases,
  className = "",
  interval = 2500,
}: SharedAxisXProps) {
  const [index, setIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length);
    }, interval);
    return () => clearInterval(id);
  }, [interval, phrases.length]);

  return (
    <span
      aria-live="polite"
      className={`relative inline-block overflow-hidden ${className}`}
    >
      <AnimatePresence mode="wait">
        <motion.span
          animate={
            shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0, scale: 1 }
          }
          exit={
            shouldReduceMotion
              ? { opacity: 0, transition: { duration: 0 } }
              : {
                  opacity: 0,
                  x: -20,
                  scale: 0.98,
                  transition: { duration: 0.36, ease: EXIT_EASE },
                }
          }
          initial={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 0, x: 24, scale: 0.98 }
          }
          key={index}
          style={{ display: "inline-block" }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 0.5, ease: ENTER_EASE }
          }
        >
          {phrases[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
