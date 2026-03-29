"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import { motion, useReducedMotion } from "motion/react";
import type React from "react";
import { Children, isValidElement, cloneElement } from "react";
import { SPRING_DEFAULT } from "../../lib/animation";

export interface RadioGroupProps {
  /** The controlled value of the selected radio item */
  value?: string;
  /** The default value when uncontrolled */
  defaultValue?: string;
  /** Callback when the selected value changes */
  onValueChange?: (value: string) => void;
  /** Whether the entire group is disabled */
  disabled?: boolean;
  /** Optional CSS class for the group container */
  className?: string;
  /** Radio items to render */
  children: React.ReactNode;
  /** Name attribute for form submission */
  name?: string;
  /** Whether a selection is required */
  required?: boolean;
  /** Orientation of the radio group for arrow key navigation */
  orientation?: "horizontal" | "vertical";
}

export interface RadioProps {
  /** The value of this radio option */
  value: string;
  /** Whether this radio is disabled */
  disabled?: boolean;
  /** Optional CSS class */
  className?: string;
  /** ID for label association */
  id?: string;
  /** Children (label content) to render next to the radio */
  children?: React.ReactNode;
  /** @internal Stagger index passed by RadioGroup */
  _staggerIndex?: number;
}

/** Spring for the selection dot — playful bounce per CLAUDE.md (0.2-0.3 for playful interactions) */
const SPRING_DOT = {
  type: "spring" as const,
  duration: 0.25,
  bounce: 0.2,
};

/** Stagger delay per radio item on initial render */
const STAGGER_DELAY = 0.04;

export function RadioGroup({
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  className,
  children,
  name,
  required,
  orientation = "vertical",
}: RadioGroupProps) {
  const shouldReduceMotion = useReducedMotion();

  // Inject stagger index into Radio children for entrance stagger
  let radioIndex = 0;
  const enhancedChildren = Children.map(children, (child) => {
    if (
      isValidElement(child) &&
      (child.type === Radio ||
        (child.type as { displayName?: string })?.displayName === "Radio")
    ) {
      const currentIndex = radioIndex;
      radioIndex += 1;
      return cloneElement(child as React.ReactElement<RadioProps>, {
        _staggerIndex: currentIndex,
      });
    }
    return child;
  });

  return (
    <RadioGroupPrimitive.Root
      className={cn(
        orientation === "vertical" ? "grid gap-3" : "flex items-center gap-4",
        className,
      )}
      data-slot="radio-group"
      defaultValue={defaultValue}
      disabled={disabled}
      name={name}
      onValueChange={onValueChange}
      orientation={orientation}
      required={required}
      value={value}
    >
      {shouldReduceMotion ? children : enhancedChildren}
    </RadioGroupPrimitive.Root>
  );
}

export function Radio({
  value,
  disabled = false,
  className,
  id,
  children,
  _staggerIndex,
}: RadioProps) {
  const shouldReduceMotion = useReducedMotion();
  const staggerDelay =
    _staggerIndex !== undefined ? _staggerIndex * STAGGER_DELAY : 0;

  const wrapper = (content: React.ReactNode) => {
    if (shouldReduceMotion || _staggerIndex === undefined) {
      return <div className="flex items-center gap-2">{content}</div>;
    }
    return (
      <motion.div
        animate={{ opacity: 1, transform: "translateY(0px)" }}
        className="flex items-center gap-2"
        initial={{ opacity: 0, transform: "translateY(4px)" }}
        transition={{
          ...SPRING_DEFAULT,
          delay: staggerDelay,
        }}
      >
        {content}
      </motion.div>
    );
  };

  return wrapper(
    <>
      <motion.div
        whileHover={
          shouldReduceMotion ? {} : { transform: "scale(1.1)" }
        }
        transition={shouldReduceMotion ? { duration: 0 } : SPRING_DEFAULT}
        className="relative"
      >
        <RadioGroupPrimitive.Item
          className={cn(
            "group/radio border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 data-[state=checked]:border-brand aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          data-slot="radio-group-item"
          disabled={disabled}
          id={id}
          value={value}
        >
          <RadioGroupPrimitive.Indicator
            className="flex items-center justify-center"
            data-slot="radio-group-indicator"
          >
            <motion.span
              animate={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 1, transform: "scale(1)" }
              }
              className="block size-2 rounded-full bg-brand"
              exit={
                shouldReduceMotion
                  ? { opacity: 0, transition: { duration: 0 } }
                  : {
                      opacity: 0,
                      transform: "scale(0)",
                      transition: { ...SPRING_DEFAULT, bounce: 0 },
                    }
              }
              initial={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 0, transform: "scale(0)" }
              }
              transition={
                shouldReduceMotion ? { duration: 0 } : SPRING_DOT
              }
            />
          </RadioGroupPrimitive.Indicator>
        </RadioGroupPrimitive.Item>
      </motion.div>
      {children && (
        <label
          className={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            disabled && "cursor-not-allowed opacity-70",
          )}
          htmlFor={id}
        >
          {children}
        </label>
      )}
    </>
  );
}

Radio.displayName = "Radio";

export default RadioGroup;
