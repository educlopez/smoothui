"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type React from "react";
import { SPRING_DEFAULT } from "../../lib/animation";

export interface CheckboxProps {
  /** Whether the checkbox is checked */
  checked?: boolean;
  /** Whether the checkbox is in an indeterminate state */
  indeterminate?: boolean;
  /** Callback when the checked state changes */
  onCheckedChange?: (checked: boolean) => void;
  /** Whether the checkbox is disabled */
  disabled?: boolean;
  /** Optional CSS class */
  className?: string;
  /** Accessible name for the checkbox */
  name?: string;
  /** Value attribute for form submission */
  value?: string;
  /** ID for label association */
  id?: string;
  /** Whether the checkbox is required */
  required?: boolean;
}

const CheckmarkPath = motion.path;
const MotionSvg = motion.svg;

export default function Checkbox({
  checked = false,
  indeterminate = false,
  onCheckedChange,
  disabled = false,
  className,
  name,
  value,
  id,
  required,
}: CheckboxProps) {
  const shouldReduceMotion = useReducedMotion();

  const derivedState = indeterminate
    ? "indeterminate"
    : checked
      ? "checked"
      : "unchecked";

  const handleChange = (state: boolean | "indeterminate") => {
    if (state === "indeterminate") {
      return;
    }
    onCheckedChange?.(state);
  };

  return (
    <CheckboxPrimitive.Root
      aria-checked={indeterminate ? "mixed" : checked}
      checked={indeterminate ? "indeterminate" : checked}
      className={cn(
        "peer border-input data-[state=unchecked]:bg-background dark:data-[state=unchecked]:bg-input/30 data-[state=checked]:bg-foreground data-[state=checked]:text-background data-[state=indeterminate]:bg-foreground data-[state=indeterminate]:text-background data-[state=checked]:border-foreground data-[state=indeterminate]:border-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      data-slot="checkbox"
      disabled={disabled}
      id={id}
      name={name}
      onCheckedChange={handleChange}
      required={required}
      value={value}
    >
      <CheckboxPrimitive.Indicator
        className="grid place-content-center text-current"
        data-slot="checkbox-indicator"
        forceMount
      >
        <AnimatePresence mode="wait">
          {derivedState === "checked" && (
            <MotionSvg
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
              className="size-3.5"
              exit={
                shouldReduceMotion
                  ? { opacity: 0, transition: { duration: 0 } }
                  : { opacity: 0, scale: 0.8 }
              }
              fill="none"
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.8 }}
              key="check"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              transition={shouldReduceMotion ? { duration: 0 } : SPRING_DEFAULT}
              viewBox="0 0 24 24"
            >
              <title>Checked</title>
              <CheckmarkPath
                animate={shouldReduceMotion ? {} : { pathLength: 1 }}
                d="M20 6L9 17l-5-5"
                initial={shouldReduceMotion ? {} : { pathLength: 0 }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { ...SPRING_DEFAULT, delay: 0.05 }
                }
              />
            </MotionSvg>
          )}
          {derivedState === "indeterminate" && (
            <MotionSvg
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
              className="size-3.5"
              exit={
                shouldReduceMotion
                  ? { opacity: 0, transition: { duration: 0 } }
                  : { opacity: 0, scale: 0.8 }
              }
              fill="none"
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.8 }}
              key="indeterminate"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              transition={shouldReduceMotion ? { duration: 0 } : SPRING_DEFAULT}
              viewBox="0 0 24 24"
            >
              <title>Indeterminate</title>
              <CheckmarkPath
                animate={shouldReduceMotion ? {} : { pathLength: 1 }}
                d="M5 12h14"
                initial={shouldReduceMotion ? {} : { pathLength: 0 }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { ...SPRING_DEFAULT, delay: 0.05 }
                }
              />
            </MotionSvg>
          )}
        </AnimatePresence>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
