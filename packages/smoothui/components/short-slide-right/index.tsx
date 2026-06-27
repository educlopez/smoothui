"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

export interface ShortSlideRightProps {
  className?: string;
  /** Interval between phrase swaps in milliseconds. */
  interval?: number;
  phrases: string[];
}

const ENTER_EASE = [0.2, 0.8, 0.2, 1] as const;
const EXIT_EASE = [0.4, 0, 0.2, 1] as const;

/**
 * ShortSlideRight — the whole phrase glides in from the left as one compact unit
 * while words reveal in sequence through opacity stagger.
 * Keynote-style editorial restraint. From the animate-text catalog (`short-slide-right`).
 */
export default function ShortSlideRight({
  phrases,
  className = "",
  interval = 2500,
}: ShortSlideRightProps) {
  const [index, setIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length);
    }, interval);
    return () => clearInterval(id);
  }, [interval, phrases.length]);

  const words = phrases[index]?.split(" ") ?? [];

  return (
    <span
      aria-live="polite"
      className={`relative inline-block overflow-hidden ${className}`}
    >
      <AnimatePresence mode="wait">
        <motion.span
          animate={
            shouldReduceMotion ? { opacity: 1 } : { x: 0, filter: "blur(0px)" }
          }
          exit={
            shouldReduceMotion
              ? { opacity: 0, transition: { duration: 0 } }
              : {
                  opacity: 0,
                  x: 12,
                  filter: "blur(1px)",
                  transition: { duration: 0.32, ease: EXIT_EASE },
                }
          }
          initial={
            shouldReduceMotion
              ? { opacity: 1 }
              : { x: -24, filter: "blur(1.2px)" }
          }
          key={index}
          style={{ display: "inline-flex", gap: "0.25em", flexWrap: "nowrap" }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 0.52, ease: ENTER_EASE }
          }
        >
          {words.map((word, i) => (
            <motion.span
              animate={{ opacity: 1 }}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
              // biome-ignore lint/suspicious/noArrayIndexKey: words have no stable id
              key={i}
              style={{ display: "inline-block" }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 0.21, delay: i * 0.092, ease: ENTER_EASE }
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
