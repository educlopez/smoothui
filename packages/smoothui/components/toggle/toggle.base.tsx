"use client";

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { cn } from "@repo/smoothui-utils";
import { motion, useReducedMotion } from "motion/react";
import {
  PRESS_SCALE,
  PRESS_TRANSITION,
  SPRING_SNAPPY,
} from "../../lib/animation";

export interface ToggleProps {
  /** Accessible name when no visible text */
  "aria-label"?: string;
  /** Children rendered inside the toggle */
  children?: React.ReactNode;
  /** Optional CSS class */
  className?: string;
  /** Uncontrolled initial pressed state */
  defaultPressed?: boolean;
  /** Whether the toggle is disabled */
  disabled?: boolean;
  /** Callback when pressed state changes */
  onPressedChange?: (pressed: boolean) => void;
  /** Controlled pressed state */
  pressed?: boolean;
  /** Value when used inside a ToggleGroup */
  value?: string;
}

const MotionButton = motion.button;

/**
 * SmoothUI Toggle — Base UI twin (default).
 * Pressed background + spring scale on press.
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
    <TogglePrimitive
      aria-label={ariaLabel}
      className={cn(
        "hit-area relative inline-flex h-9 shrink-0 select-none items-center justify-center gap-2 rounded-md border border-transparent px-3 font-medium text-sm outline-none",
        "bg-secondary text-muted-foreground",
        "state-transition focus-ring hover:bg-muted",
        "data-pressed:border-border data-pressed:bg-background data-pressed:text-foreground data-pressed:shadow-sm dark:data-pressed:bg-foreground/15",
        "data-disabled:pointer-events-none data-disabled:border-foreground/25 data-disabled:bg-foreground/10 data-disabled:text-muted-foreground",
        className
      )}
      data-slot="toggle"
      defaultPressed={defaultPressed}
      disabled={disabled}
      onPressedChange={(next) => {
        onPressedChange?.(next);
      }}
      pressed={pressed}
      render={
        <MotionButton
          transition={shouldReduceMotion ? { duration: 0 } : SPRING_SNAPPY}
          type="button"
          whileTap={
            shouldReduceMotion
              ? undefined
              : { scale: PRESS_SCALE, transition: PRESS_TRANSITION }
          }
        />
      }
      value={value}
    >
      {children}
    </TogglePrimitive>
  );
}
