"use client";

import { cn } from "@repo/smoothui-utils";
import { motion, useReducedMotion } from "motion/react";
import { type ComponentProps, useRef } from "react";
import {
  EASE_LINEAR,
  LOOP_CLASS,
  LOOP_REPEAT_DELAY,
  loopTransition,
  useLoopInView,
} from "../../lib/animation";

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
  ref,
  size = "md",
  ...props
}: SpinnerProps) {
  const shouldReduceMotion = useReducedMotion();
  const hostRef = useRef<HTMLSpanElement>(null);
  const inView = useLoopInView(hostRef);
  const setRef = (node: HTMLSpanElement | null) => {
    hostRef.current = node;
    if (typeof ref === "function") {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };
  const spinning = !shouldReduceMotion && inView;

  return (
    <span
      aria-label={ariaLabel}
      className={cn("inline-flex shrink-0 text-foreground", className)}
      data-slot="spinner"
      ref={setRef}
      role="status"
      {...props}
    >
      <motion.span
        animate={spinning ? { rotate: 360 } : undefined}
        aria-hidden
        className={cn(
          "inline-block rounded-full border-current border-r-transparent",
          spinning && LOOP_CLASS,
          SIZE_CLASS[size]
        )}
        transition={
          spinning
            ? loopTransition(
                { duration: 0.7, ease: EASE_LINEAR },
                LOOP_REPEAT_DELAY.spin
              )
            : { duration: 0 }
        }
      />
    </span>
  );
}
