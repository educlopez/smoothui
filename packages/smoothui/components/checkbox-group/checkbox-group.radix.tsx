"use client";

import { cn } from "@repo/smoothui-utils";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
} from "react";
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

const CHECKBOX_CLASS =
  "peer size-4 shrink-0 rounded-[4px] border border-foreground/40 shadow-xs outline-none state-transition focus-visible:border-ring focus-ring disabled:cursor-not-allowed disabled:border-foreground/30 disabled:bg-muted aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[state=checked]:border-foreground data-[state=indeterminate]:border-foreground data-[state=checked]:bg-foreground data-[state=indeterminate]:bg-foreground data-[state=unchecked]:bg-background data-[state=checked]:text-background data-[state=indeterminate]:text-background disabled:data-[state=checked]:border-muted-foreground disabled:data-[state=indeterminate]:border-muted-foreground disabled:data-[state=checked]:bg-muted-foreground disabled:data-[state=indeterminate]:bg-muted-foreground dark:data-[state=unchecked]:bg-foreground/10 dark:aria-invalid:ring-destructive/40";

const CheckmarkPath = motion.path;
const MotionSvg = motion.svg;

interface CheckboxGroupContextValue {
  allValues: string[];
  disabled: boolean;
  setValue: (next: string[]) => void;
  value: string[];
}

const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(
  null
);

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
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 24 24"
        >
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
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 24 24"
        >
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
 * SmoothUI Checkbox Group — Radix-parity twin (no Radix CheckboxGroup).
 * Same public props as the Base UI twin.
 */
export function CheckboxGroup({
  allValues = [],
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  children,
  className,
  defaultValue,
  disabled = false,
  onValueChange,
  value: valueProp,
}: CheckboxGroupProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue ?? []);
  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : uncontrolled;

  const setValue = useCallback(
    (next: string[]) => {
      if (!isControlled) {
        setUncontrolled(next);
      }
      onValueChange?.(next);
    },
    [isControlled, onValueChange]
  );

  const contextValue = useMemo(
    () => ({ allValues, disabled, setValue, value }),
    [allValues, disabled, setValue, value]
  );

  return (
    <CheckboxGroupContext.Provider value={contextValue}>
      <fieldset
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className={cn("m-0 grid min-w-0 gap-3 border-0 p-0", className)}
        data-slot="checkbox-group"
      >
        {children}
      </fieldset>
    </CheckboxGroupContext.Provider>
  );
}

export function CheckboxGroupItem({
  children,
  className,
  disabled: itemDisabled,
  id,
  parent = false,
  value: itemValue,
}: CheckboxGroupItemProps) {
  const ctx = useContext(CheckboxGroupContext);
  if (!ctx) {
    throw new Error("CheckboxGroupItem must be used within CheckboxGroup");
  }

  const generatedId = useId();
  const itemId = id ?? generatedId;
  const disabled = ctx.disabled || itemDisabled;

  const selectedCount = ctx.allValues.filter((v) =>
    ctx.value.includes(v)
  ).length;
  const allSelected =
    ctx.allValues.length > 0 && selectedCount === ctx.allValues.length;
  const someSelected = selectedCount > 0 && !allSelected;

  let checked: boolean | "indeterminate" = false;
  if (parent) {
    if (allSelected) {
      checked = true;
    } else if (someSelected) {
      checked = "indeterminate";
    }
  } else if (itemValue) {
    checked = ctx.value.includes(itemValue);
  }

  let glyphState: "checked" | "indeterminate" | "unchecked" = "unchecked";
  if (checked === "indeterminate") {
    glyphState = "indeterminate";
  } else if (checked) {
    glyphState = "checked";
  }

  const handleChange = (next: boolean | "indeterminate") => {
    if (next === "indeterminate") {
      return;
    }
    if (parent) {
      ctx.setValue(next ? [...ctx.allValues] : []);
      return;
    }
    if (!itemValue) {
      return;
    }
    if (next) {
      ctx.setValue(
        ctx.value.includes(itemValue) ? ctx.value : [...ctx.value, itemValue]
      );
    } else {
      ctx.setValue(ctx.value.filter((v) => v !== itemValue));
    }
  };

  return (
    <label
      className="flex cursor-pointer items-center gap-2 text-sm leading-none peer-disabled:cursor-not-allowed has-disabled:cursor-not-allowed has-disabled:opacity-50"
      htmlFor={itemId}
    >
      <CheckboxPrimitive.Root
        checked={checked}
        className={cn(CHECKBOX_CLASS, className)}
        data-slot="checkbox"
        disabled={disabled}
        id={itemId}
        onCheckedChange={handleChange}
      >
        <CheckboxPrimitive.Indicator
          className="grid place-content-center text-current"
          data-slot="checkbox-indicator"
          forceMount
        >
          <CheckboxGlyph state={glyphState} />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {children ? <span>{children}</span> : null}
    </label>
  );
}

export default CheckboxGroup;
