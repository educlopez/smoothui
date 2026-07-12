"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

export interface SharedAxisYProps {
  className?: string;
  /** Interval between phrase swaps in milliseconds. */
  interval?: number;
  phrases: string[];
}

const STAGGER_S = 0.078;

/**
 * SharedAxisY — per-word hard-cut staircase transition.
 * Each word flips in/out with stepped timing, creating a sharp editorial cascade.
 * From the animate-text catalog (`shared-axis-y`, display: "Word Cut Staircase").
 */
export default function SharedAxisY({
  phrases,
  className = "",
  interval = 2500,
}: SharedAxisYProps) {
  const [index, setIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length);
    }, interval);
    return () => clearInterval(id);
  }, [interval, phrases.length]);

  const words = (phrases[index] ?? "").split(" ");

  return (
    <span
      aria-live="polite"
      className={`inline-flex flex-wrap gap-x-[0.25em] ${className}`}
    >
      <AnimatePresence mode="wait">
        <motion.span
          className="inline-flex flex-wrap gap-x-[0.25em]"
          key={index}
        >
          {words.map((word, i) => (
            <motion.span
              animate={{ opacity: 1 }}
              exit={
                shouldReduceMotion
                  ? { opacity: 0, transition: { duration: 0 } }
                  : {
                      opacity: 0,
                      transition: { duration: 0, delay: i * STAGGER_S },
                    }
              }
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
              // biome-ignore lint/suspicious/noArrayIndexKey: words have no stable id
              key={i}
              style={{ display: "inline-block" }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 0, delay: i * STAGGER_S }
              }
            >
              {word}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
