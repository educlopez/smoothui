"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

export interface BottomUpLettersProps {
  children: string;
  className?: string;
  /** Delay before the animation starts, in milliseconds. */
  delay?: number;
  /** Per-character stagger, in milliseconds. */
  stagger?: number;
  /** Animate only once the text scrolls into view. */
  triggerOnView?: boolean;
}

const DURATION_S = 0.4;
const MS = 1000;
// Pronounced ease-out for a tall, staged lift from below.
const EASE = [0.18, 1, 0.32, 1] as const;

/**
 * BottomUpLetters — letters rise from below in a pronounced staircase,
 * one symbol at a time, with zero blur. Best for short single words or
 * compact headlines at 40px+. From the animate-text catalog (`bottom-up-letters`).
 */
export default function BottomUpLetters({
  children,
  className = "",
  delay = 0,
  stagger = 88,
  triggerOnView = false,
}: BottomUpLettersProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const shouldReduceMotion = useReducedMotion();
  const play = (!triggerOnView || inView) && !shouldReduceMotion;
  const characters = Array.from(children);

  return (
    <span aria-label={children} className={className} ref={ref}>
      {characters.map((char, index) => (
        <motion.span
          animate={play ? { opacity: 1, y: 0 } : undefined}
          aria-hidden="true"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 46 }}
          // biome-ignore lint/suspicious/noArrayIndexKey: characters have no stable id
          key={index}
          style={{ display: "inline-block", whiteSpace: "pre" }}
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
          {char === " " ? " " : char}
        </motion.span>
      ))}
    </span>
  );
}
