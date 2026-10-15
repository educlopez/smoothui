"use client";

import { cn } from "@repo/smoothui-utils";
import { motion, useReducedMotion } from "motion/react";
import { type ComponentProps, useCallback, useRef } from "react";
import {
  EASE_IN_OUT,
  LOOP_CLASS,
  LOOP_REPEAT_DELAY,
  loopTransition,
  useLoopInView,
} from "../../lib/animation";

export type SkeletonProps = ComponentProps<"div"> & {
  /** Animate a subtle shimmer across the block */
  shimmer?: boolean;
};

/**
 * SmoothUI Skeleton — loading placeholder. SmoothUI-owned.
 */
export default function Skeleton({
  className,
  ref,
  shimmer = true,
  ...props
}: SkeletonProps) {
  const shouldReduceMotion = useReducedMotion();
  const hostRef = useRef<HTMLDivElement>(null);
  const inView = useLoopInView(hostRef);
  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      hostRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref]
  );
  const animate = shimmer && !shouldReduceMotion && inView;

  return (
    <div
      aria-hidden
      className={cn(
        "relative overflow-hidden rounded-md bg-foreground/10",
        className
      )}
      data-slot="skeleton"
      ref={setRef}
      {...props}
    >
      {animate ? (
        <motion.span
          animate={{ transform: ["translateX(-100%)", "translateX(100%)"] }}
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-foreground/10 to-transparent",
            LOOP_CLASS
          )}
          data-slot="skeleton-shimmer"
          initial={{ transform: "translateX(-100%)" }}
          transition={loopTransition(
            { duration: 1.2, ease: EASE_IN_OUT },
            LOOP_REPEAT_DELAY.shimmer
          )}
        />
      ) : null}
    </div>
  );
}
