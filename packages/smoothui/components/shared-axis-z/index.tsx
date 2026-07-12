"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

export interface SharedAxisZProps {
  className?: string;
  /** Interval between phrase swaps in milliseconds. */
  interval?: number;
  phrases: string[];
}

const ENTER_EASE = [0.2, 0, 0, 1] as const;
const EXIT_EASE = [0.4, 0, 1, 1] as const;

/**
 * SharedAxisZ — scale/depth phrase transition inspired by Google Material shared axis (Z).
 * Incoming phrase scales up from 0.9 with a soft blur; outgoing scales to 1.06 and fades.
 * From the animate-text catalog (`shared-axis-z`).
 */
export default function SharedAxisZ({
  phrases,
  className = "",
  interval = 2500,
}: SharedAxisZProps) {
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
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 1, scale: 1, filter: "blur(0px)" }
          }
          exit={
            shouldReduceMotion
              ? { opacity: 0, transition: { duration: 0 } }
              : {
                  opacity: 0,
                  scale: 1.06,
                  filter: "blur(1px)",
                  transition: { duration: 0.36, ease: EXIT_EASE },
                }
          }
          initial={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 0, scale: 0.9, filter: "blur(2px)" }
          }
          key={index}
          style={{ display: "inline-block" }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 0.52, ease: ENTER_EASE }
          }
        >
          {phrases[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
