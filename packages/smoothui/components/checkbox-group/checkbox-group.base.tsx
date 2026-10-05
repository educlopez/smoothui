"use client";

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { CheckboxGroup as CheckboxGroupPrimitive } from "@base-ui/react/checkbox-group";
import { cn } from "@repo/smoothui-utils";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type ComponentProps, type ReactNode, useId } from "react";
import { SPRING_DEFAULT } from "../../lib/animation";

export interface CheckboxGroupProps {
  /** All child values — required when using a parent item */
  allValues?: string[];
  /** Accessible name when there is no visible label */
  "aria-label"?: string;
  /** ID of the labelling element */
  "aria-labelledby"?: string;
  /** Group items */
  children?: ReactNode;
  /** Optional CSS class for the group */
  className?: string;
  /** Uncontrolled initial values */
  defaultValue?: string[];
  /** Disable the whole group */
  disabled?: boolean;
  /** Called when the selected values change */
  onValueChange?: (value: string[]) => void;
  /** Controlled selected values */
  value?: string[];
}

export interface CheckboxGroupItemProps {
  /** Label content rendered next to the checkbox */
  children?: ReactNode;
  /** Optional CSS class for the checkbox control */
  className?: string;
  /** Disable this item */
  disabled?: boolean;
  /** ID for label association */
  id?: string;
  /** Parent / select-all control — requires `allValues` on the group */
  parent?: boolean;
  /** Value identifying this item in the group (omit for parent) */
  value?: string;
}

export type CheckboxGroupRootProps = Omit<
  ComponentProps<typeof CheckboxGroupPrimitive>,
  "className"
> & { className?: string };

const CHECKBOX_CLASS =
  "peer size-4 shrink-0 cursor-pointer appearance-none rounded-[4px] border border-foreground/40 bg-background p-0 shadow-xs outline-none transition-shadow focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:border-foreground/30 disabled:bg-muted aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-checked:border-foreground data-indeterminate:border-foreground data-checked:bg-foreground data-indeterminate:bg-foreground data-unchecked:bg-background data-checked:text-background data-indeterminate:text-background disabled:data-checked:border-muted-foreground disabled:data-indeterminate:border-muted-foreground disabled:data-checked:bg-muted-foreground disabled:data-indeterminate:bg-muted-foreground dark:data-unchecked:bg-foreground/10 dark:aria-invalid:ring-destructive/40";

const CheckmarkPath = motion.path;
const MotionSvg = motion.svg;

const CheckboxGlyph = ({
  state,
}: {
  state: "checked" | "indeterminate" | "unchecked";
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      {state === "checked" ? (
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
      ) : null}
      {state === "indeterminate" ? (
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
      ) : null}
    </AnimatePresence>
  );
};

/**
 * SmoothUI Checkbox Group — Base UI twin (default).
 */
export function CheckboxGroup({
  allValues,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  children,
  className,
  defaultValue,
  disabled = false,
  onValueChange,
  value,
}: CheckboxGroupProps) {
  return (
    <CheckboxGroupPrimitive
      allValues={allValues}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={cn("grid gap-3", className)}
      data-slot="checkbox-group"
      defaultValue={defaultValue}
      disabled={disabled}
      onValueChange={onValueChange}
      value={value}
    >
      {children}
    </CheckboxGroupPrimitive>
  );
}

/**
 * Labelled checkbox row. Pass `parent` for select-all (requires `allValues`).
 */
export function CheckboxGroupItem({
  children,
  className,
  disabled,
  id,
  parent = false,
  value,
}: CheckboxGroupItemProps) {
  const generatedId = useId();
  const itemId = id ?? generatedId;

  return (
    <label
      className="flex cursor-pointer items-center gap-2 text-sm leading-none peer-disabled:cursor-not-allowed has-disabled:cursor-not-allowed has-disabled:opacity-50"
      htmlFor={itemId}
    >
      <CheckboxPrimitive.Root
        className={cn(CHECKBOX_CLASS, className)}
        data-slot="checkbox"
        disabled={disabled}
        id={itemId}
        nativeButton
        parent={parent}
        render={<button type="button" />}
        value={value}
      >
        <CheckboxPrimitive.Indicator
          className="grid place-content-center text-current"
          data-slot="checkbox-indicator"
          keepMounted
          render={(props, state) => {
            let glyphState: "checked" | "indeterminate" | "unchecked" =
              "unchecked";
            if (state.indeterminate) {
              glyphState = "indeterminate";
            } else if (state.checked) {
              glyphState = "checked";
            }
            return (
              <span {...props}>
                <CheckboxGlyph state={glyphState} />
              </span>
            );
          }}
        />
      </CheckboxPrimitive.Root>
      {children ? <span>{children}</span> : null}
    </label>
  );
}

export default CheckboxGroup;
