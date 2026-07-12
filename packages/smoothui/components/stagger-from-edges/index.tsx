"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

export interface StaggerFromEdgesProps {
  children: string;
  className?: string;
  /** Delay before the animation starts, in milliseconds. */
  delay?: number;
  /** Per-step stagger between characters, in milliseconds. */
  stagger?: number;
  /** Animate only once the text scrolls into view. */
  triggerOnView?: boolean;
}

const DURATION_S = 0.62;
const MS = 1000;
// Apple-ish ease-out for edges-in reveal.
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * StaggerFromEdges — characters start from both edges and converge toward
 * the center. Delay is computed by distance from the nearest edge, not
 * linear index. From the animate-text catalog (`stagger-from-edges`).
 */
export default function StaggerFromEdges({
  children,
  className = "",
  delay = 0,
  stagger = 22,
  triggerOnView = false,
}: StaggerFromEdgesProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const shouldReduceMotion = useReducedMotion();
  const play = (!triggerOnView || inView) && !shouldReduceMotion;
  const characters = Array.from(children);
  const lastIndex = characters.length - 1;

  return (
    <span aria-label={children} className={className} ref={ref}>
      {characters.map((char, index) => {
        // Distance from the nearest edge (0 = edge character, increases toward center)
        const distanceFromEdge = Math.min(index, lastIndex - index);
        return (
          <motion.span
            animate={
              play ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined
            }
            aria-hidden="true"
            initial={
              shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 0, y: 12, filter: "blur(3px)" }
            }
            // biome-ignore lint/suspicious/noArrayIndexKey: characters have no stable id
            key={index}
            style={{ display: "inline-block", whiteSpace: "pre" }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : {
                    duration: DURATION_S,
                    delay: delay / MS + (distanceFromEdge * stagger) / MS,
                    ease: EASE,
                  }
            }
          >
            {char === " " ? " " : char}
          </motion.span>
        );
      })}
    </span>
  );
}
