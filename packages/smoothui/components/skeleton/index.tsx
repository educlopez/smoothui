"use client";

import { cn } from "@repo/smoothui-utils";
import { motion, useReducedMotion } from "motion/react";
import type { ComponentProps } from "react";

export type SkeletonProps = ComponentProps<"div"> & {
  /** Animate a subtle shimmer across the block */
  shimmer?: boolean;
};

/**
 * SmoothUI Skeleton — loading placeholder. SmoothUI-owned.
 */
export default function Skeleton({
  className,
  shimmer = true,
  ...props
}: SkeletonProps) {
  const shouldReduceMotion = useReducedMotion();
  const animate = shimmer && !shouldReduceMotion;

  return (
    <div
      aria-hidden
      className={cn(
        "relative overflow-hidden rounded-md bg-foreground/10",
        className
      )}
      data-slot="skeleton"
      {...props}
    >
      {animate ? (
        <motion.span
          animate={{ x: ["-100%", "100%"] }}
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-foreground/10 to-transparent"
          transition={{
            duration: 1.2,
            ease: [0.645, 0.045, 0.355, 1],
            repeat: Number.POSITIVE_INFINITY,
          }}
        />
      ) : null}
    </div>
  );
}
