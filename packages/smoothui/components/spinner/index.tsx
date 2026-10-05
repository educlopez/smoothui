"use client";

import { cn } from "@repo/smoothui-utils";
import { motion, useReducedMotion } from "motion/react";
import type { ComponentProps } from "react";

export type SpinnerSize = "sm" | "md" | "lg";

export interface SpinnerProps extends Omit<ComponentProps<"span">, "children"> {
  /** Accessible name when no visible label is shown */
  "aria-label"?: string;
  /** Visual size */
  size?: SpinnerSize;
}

const SIZE_CLASS: Record<SpinnerSize, string> = {
  lg: "size-6 border-2",
  md: "size-4 border-2",
  sm: "size-3 border-[1.5px]",
};

/**
 * SmoothUI Spinner — indeterminate loading indicator. SmoothUI-owned.
 */
export default function Spinner({
  "aria-label": ariaLabel = "Loading",
  className,
  size = "md",
  ...props
}: SpinnerProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <span
      aria-label={ariaLabel}
      className={cn("inline-flex shrink-0 text-foreground", className)}
      data-slot="spinner"
      role="status"
      {...props}
    >
      <motion.span
        animate={shouldReduceMotion ? undefined : { rotate: 360 }}
        aria-hidden
        className={cn(
          "inline-block rounded-full border-current border-r-transparent",
          SIZE_CLASS[size]
        )}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : {
                duration: 0.7,
                ease: "linear",
                repeat: Number.POSITIVE_INFINITY,
              }
        }
      />
    </span>
  );
}
