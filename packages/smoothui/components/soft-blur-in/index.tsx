"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

export interface SoftBlurInProps {
  children: string;
  className?: string;
  /** Delay before the animation starts, in milliseconds. */
  delay?: number;
  /** Per-character stagger, in milliseconds. */
  stagger?: number;
  /** Animate only once the text scrolls into view. */
  triggerOnView?: boolean;
}

const DURATION_S = 0.9;
const MS = 1000;
// Apple's signature ease-out.
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * SoftBlurIn — per-character fade-in with a gentle blur and upward motion,
 * Apple's signature hero-title reveal. From the animate-text catalog
 * (`soft-blur-in`). Best on hero titles 48px+ over solid backgrounds.
 */
export default function SoftBlurIn({
  children,
  className = "",
  delay = 0,
  stagger = 25,
  triggerOnView = false,
}: SoftBlurInProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const shouldReduceMotion = useReducedMotion();
  const play = (!triggerOnView || inView) && !shouldReduceMotion;
  const characters = Array.from(children);

  return (
    <span aria-label={children} className={className} ref={ref}>
      {characters.map((char, index) => (
        <motion.span
          animate={play ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
          aria-hidden="true"
          initial={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 0, y: 16, filter: "blur(12px)" }
          }
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
