"use client";

import { cn } from "@repo/smoothui-utils";
import { motion, useReducedMotion } from "motion/react";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import type React from "react";
import { Children, cloneElement, isValidElement, useId } from "react";
import { SPRING_DEFAULT } from "../../lib/animation";

export interface RadioGroupProps {
  /** Radio items to render */
  children: React.ReactNode;
  /** Optional CSS class for the group container */
  className?: string;
  /** The default value when uncontrolled */
  defaultValue?: string;
  /** Whether the entire group is disabled */
  disabled?: boolean;
  /** Name attribute for form submission */
  name?: string;
  /** Callback when the selected value changes */
  onValueChange?: (value: string) => void;
  /** Orientation of the radio group for arrow key navigation */
  orientation?: "horizontal" | "vertical";
  /** Whether a selection is required */
  required?: boolean;
  /** The controlled value of the selected radio item */
  value?: string;
}

export interface RadioProps {
  /** @internal Stagger index passed by RadioGroup */
  _staggerIndex?: number;
  /** Children (label content) to render next to the radio */
  children?: React.ReactNode;
  /** Optional CSS class */
  className?: string;
  /** Whether this radio is disabled */
  disabled?: boolean;
  /** ID for label association */
  id?: string;
  /** The value of this radio option */
  value: string;
}

/** Spring for the selection dot — playful bounce per CLAUDE.md (0.2-0.3 for playful interactions) */
const SPRING_DOT = {
  bounce: 0.2,
  duration: 0.25,
  type: "spring" as const,
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
        className
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
      {/* biome-ignore lint/suspicious/noLeakedRender: both branches are ReactNode, which is exactly what a wrapper should render */}
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
    _staggerIndex === undefined ? 0 : _staggerIndex * STAGGER_DELAY;
  // Radix renders the item as a <button role="radio"> with no inner text, so
  // its only accessible name is the sibling <label>. Without a generated
  // fallback the label's htmlFor pointed nowhere whenever the consumer omitted
  // `id`, leaving the control nameless.
  const generatedId = useId();
  const radioId = id ?? generatedId;

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
      <RadioGroupPrimitive.Item
        className={cn(
          "group/radio state-transition inline-flex size-4 shrink-0 items-center justify-center rounded-full border border-foreground/50 bg-background shadow-xs outline-none",
          "focus-ring hover:border-foreground focus-visible:border-ring",
          "disabled:cursor-not-allowed disabled:border-foreground/30 disabled:bg-muted disabled:hover:border-foreground/30",
          "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
          "data-[state=checked]:border-brand data-[state=checked]:hover:border-brand dark:bg-foreground/10",
          className
        )}
        data-slot="radio-group-item"
        disabled={disabled}
        id={radioId}
        value={value}
      >
        <RadioGroupPrimitive.Indicator
          className="flex size-full items-center justify-center"
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
            transition={shouldReduceMotion ? { duration: 0 } : SPRING_DOT}
          />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>
      {children ? (
        <label
          className={cn(
            "font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            disabled && "cursor-not-allowed opacity-70"
          )}
          htmlFor={radioId}
        >
          {children}
        </label>
      ) : null}
    </>
  );
}

Radio.displayName = "Radio";

export default RadioGroup;
