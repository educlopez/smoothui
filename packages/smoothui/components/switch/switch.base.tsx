"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { cn } from "@repo/smoothui-utils";
import { motion, useReducedMotion } from "motion/react";
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
 * SmoothUI Switch — Base UI twin (default).
 * Same public props as the Radix twin; headless via `@base-ui/react/switch`.
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
        "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-transparent shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed",
        // Avoid root opacity — translucent tracks vanish on dark stages
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
      nativeButton
      onCheckedChange={(next) => {
        if (checked === undefined) {
          setUncontrolledChecked(next);
        }
        onCheckedChange?.(next);
      }}
      render={<button type="button" />}
      required={required}
      value={value}
    >
      <SwitchPrimitive.Thumb
        className="pointer-events-none block"
        data-slot="switch-thumb"
        render={
          <MotionThumb
            animate={{
              transform: isOn ? THUMB_ON : THUMB_OFF,
            }}
            className={cn(
              "pointer-events-none block size-4 rounded-full ring-0",
              disabled
                ? "bg-white shadow-sm"
                : isOn
                  ? "bg-white"
                  : "bg-background dark:bg-foreground"
            )}
            transition={shouldReduceMotion ? { duration: 0 } : SPRING_DEFAULT}
          />
        }
      />
    </SwitchPrimitive.Root>
  );
}
