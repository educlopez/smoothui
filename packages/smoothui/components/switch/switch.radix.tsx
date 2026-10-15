"use client";

import { cn } from "@repo/smoothui-utils";
import { motion, useReducedMotion } from "motion/react";
import { Switch as SwitchPrimitive } from "radix-ui";
import { useState } from "react";
import { SPRING_DEFAULT } from "../../lib/animation";

export interface SwitchProps {
  /** Accessible name, for switches without a visible `<label>` */
  "aria-label"?: string;
  /** ID of the element labelling the switch */
  "aria-labelledby"?: string;
  /** Whether the switch is checked (controlled) */
  checked?: boolean;
  /** Optional CSS class */
  className?: string;
  /** Whether the switch is initially checked (uncontrolled) */
  defaultChecked?: boolean;
  /** Whether the switch is disabled */
  disabled?: boolean;
  /** ID for label association */
  id?: string;
  /** Name attribute for form submission */
  name?: string;
  /** Callback when the checked state changes */
  onCheckedChange?: (checked: boolean) => void;
  /** Whether the switch is required */
  required?: boolean;
  /** Value attribute for form submission */
  value?: string;
}

const MotionThumb = motion.span;

const THUMB_OFF = "translateX(0.125rem)";
const THUMB_ON = "translateX(1rem)";

/**
 * SmoothUI Switch — Radix twin.
 * Same public props as the Base UI twin; headless via `radix-ui` Switch.
 */
export default function Switch({
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  checked,
  className,
  defaultChecked = false,
  disabled = false,
  id,
  name,
  onCheckedChange,
  required,
  value,
}: SwitchProps) {
  const shouldReduceMotion = useReducedMotion();
  const [uncontrolledChecked, setUncontrolledChecked] =
    useState(defaultChecked);
  const isOn = checked ?? uncontrolledChecked;

  return (
    <SwitchPrimitive.Root
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      checked={isOn}
      className={cn(
        "peer state-transition focus-ring inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-transparent shadow-xs outline-none focus-visible:border-ring disabled:cursor-not-allowed",
        disabled
          ? isOn
            ? "bg-muted-foreground"
            : "bg-foreground/35"
          : isOn
            ? "bg-brand"
            : "bg-foreground/40",
        className
      )}
      data-slot="switch"
      disabled={disabled}
      id={id}
      name={name}
      onCheckedChange={(next) => {
        if (checked === undefined) {
          setUncontrolledChecked(next);
        }
        onCheckedChange?.(next);
      }}
      required={required}
      value={value}
    >
      <SwitchPrimitive.Thumb asChild data-slot="switch-thumb">
        <MotionThumb
          animate={{
            transform: isOn ? THUMB_ON : THUMB_OFF,
          }}
          className={cn(
            "pointer-events-none block size-4 rounded-full ring-0",
            disabled
              ? "bg-thumb shadow-sm"
              : isOn
                ? "bg-thumb"
                : "bg-background dark:bg-foreground"
          )}
          transition={shouldReduceMotion ? { duration: 0 } : SPRING_DEFAULT}
        />
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );
}
