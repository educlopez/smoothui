"use client";

import { cn } from "@repo/smoothui-utils";
import { motion, useReducedMotion } from "motion/react";
import { Toggle as TogglePrimitive } from "radix-ui";
import {
  PRESS_SCALE,
  PRESS_TRANSITION,
  SPRING_SNAPPY,
} from "../../lib/animation";
import type { ToggleProps } from "./toggle.base";

export type { ToggleProps } from "./toggle.base";

const MotionButton = motion.button;

/**
 * SmoothUI Toggle — Radix twin.
 * Same public props as the Base UI twin.
 */
export default function Toggle({
  "aria-label": ariaLabel,
  className,
  children,
  defaultPressed = false,
  disabled = false,
  onPressedChange,
  pressed,
  value,
}: ToggleProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <TogglePrimitive.Root
      aria-label={ariaLabel}
      asChild
      className={cn(
        "pointer-coarse:after:-translate-1/2 relative inline-flex h-9 shrink-0 select-none items-center justify-center gap-2 rounded-md border border-transparent px-3 font-medium text-sm outline-none pointer-coarse:after:absolute pointer-coarse:after:top-1/2 pointer-coarse:after:left-1/2 pointer-coarse:after:size-full pointer-coarse:after:min-h-10 pointer-coarse:after:min-w-10 pointer-coarse:after:content-['']",
        "bg-secondary text-muted-foreground",
        "state-transition focus-ring hover:bg-muted",
        "data-[state=on]:border-border data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm dark:data-[state=on]:bg-foreground/15",
        "disabled:pointer-events-none disabled:border-foreground/25 disabled:bg-foreground/10 disabled:text-muted-foreground",
        className
      )}
      data-slot="toggle"
      defaultPressed={defaultPressed}
      disabled={disabled}
      onPressedChange={(next) => {
        onPressedChange?.(next);
      }}
      pressed={pressed}
      value={value}
    >
      <MotionButton
        transition={shouldReduceMotion ? { duration: 0 } : SPRING_SNAPPY}
        type="button"
        whileTap={
          shouldReduceMotion
            ? undefined
            : { scale: PRESS_SCALE, transition: PRESS_TRANSITION }
        }
      >
        {children}
      </MotionButton>
    </TogglePrimitive.Root>
  );
}
