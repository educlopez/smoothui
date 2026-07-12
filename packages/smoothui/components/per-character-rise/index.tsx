"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

export interface PerCharacterRiseProps {
  children: string;
  className?: string;
  /** Delay before the animation starts, in milliseconds. */
  delay?: number;
  /** Per-character stagger, in milliseconds. */
  stagger?: number;
  /** Animate only once the text scrolls into view. */
  triggerOnView?: boolean;
}

const DURATION_S = 0.7;
const MS = 1000;
// Apple's clean tvOS-style ease-out.
const EASE = [0.2, 0.8, 0.2, 1] as const;

/**
 * PerCharacterRise — letters slide up from below with no blur, crisp and
 * deliberate. Apple's clean tvOS-style reveal. From the animate-text catalog
 * (`per-character-rise`). Best on 40px+ headlines.
 */
export default function PerCharacterRise({
  children,
  className = "",
  delay = 0,
  stagger = 24,
  triggerOnView = false,
}: PerCharacterRiseProps) {
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
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 32 }}
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
