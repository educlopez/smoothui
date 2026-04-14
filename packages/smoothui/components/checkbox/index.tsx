"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { SPRING_DEFAULT } from "../../lib/animation";

export interface CheckboxProps {
  /** Whether the checkbox is checked */
  checked?: boolean;
  /** Optional CSS class */
  className?: string;
  /** Whether the checkbox is disabled */
  disabled?: boolean;
  /** ID for label association */
  id?: string;
  /** Whether the checkbox is in an indeterminate state */
  indeterminate?: boolean;
  /** Accessible name for the checkbox */
  name?: string;
  /** Callback when the checked state changes */
  onCheckedChange?: (checked: boolean) => void;
  /** Whether the checkbox is required */
  required?: boolean;
  /** Value attribute for form submission */
  value?: string;
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
        "peer size-4 shrink-0 rounded-[4px] border border-input shadow-xs outline-none transition-shadow focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[state=checked]:border-foreground data-[state=indeterminate]:border-foreground data-[state=checked]:bg-foreground data-[state=indeterminate]:bg-foreground data-[state=unchecked]:bg-background data-[state=checked]:text-background data-[state=indeterminate]:text-background dark:data-[state=unchecked]:bg-input/30 dark:aria-invalid:ring-destructive/40",
        className
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
              animate={
                shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }
              }
              className="size-3.5"
              exit={
                shouldReduceMotion
                  ? { opacity: 0, transition: { duration: 0 } }
                  : { opacity: 0, scale: 0.8 }
              }
              fill="none"
              initial={
                shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.8 }
              }
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
              animate={
                shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }
              }
              className="size-3.5"
              exit={
                shouldReduceMotion
                  ? { opacity: 0, transition: { duration: 0 } }
                  : { opacity: 0, scale: 0.8 }
              }
              fill="none"
              initial={
                shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.8 }
              }
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
