"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

/**
 * DepthParallaxWords — per-word depth motion with scale, vertical drift and blur for layered readability.
 * From the animate-text catalog (`depth-parallax-words`).
 */
export interface DepthParallaxWordsProps {
  children: string;
  className?: string;
  /** Delay before the animation starts, in milliseconds. */
  delay?: number;
  /** Per-word stagger, in milliseconds. */
  stagger?: number;
  /** Animate only once the text scrolls into view. */
  triggerOnView?: boolean;
}

const DURATION_S = 0.7;
const MS = 1000;
const EASE = [0.22, 1, 0.36, 1] as const;

export default function DepthParallaxWords({
  children,
  className = "",
  delay = 0,
  stagger = 70,
  triggerOnView = false,
}: DepthParallaxWordsProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const shouldReduceMotion = useReducedMotion();
  const play = (!triggerOnView || inView) && !shouldReduceMotion;
  const words = children.split(" ");

  return (
    <span aria-label={children} className={className} ref={ref}>
      {words.map((word, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: words have no stable id
        <span key={index}>
          <motion.span
            animate={
              play
                ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
                : undefined
            }
            aria-hidden="true"
            initial={
              shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 0, y: 18, scale: 0.92, filter: "blur(3px)" }
            }
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
            {word}
          </motion.span>
          {index < words.length - 1 && (
            <span
              aria-hidden="true"
              style={{ display: "inline-block", whiteSpace: "pre" }}
            >
              {" "}
            </span>
          )}
        </span>
      ))}
    </span>
  );
}
