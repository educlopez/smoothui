"use client";

import { cn } from "@repo/smoothui-utils";
import {
  type ComponentProps,
  type ReactNode,
  type SVGProps,
  useCallback,
  useId,
  useState,
} from "react";

export interface NumberFieldProps {
  /** Accessible name when there is no visible `label` */
  "aria-label"?: string;
  /** Optional CSS class for the root */
  className?: string;
  /** Uncontrolled initial value */
  defaultValue?: number;
  /** Disable the field */
  disabled?: boolean;
  /** Visible label */
  label?: string;
  /** Maximum value */
  max?: number;
  /** Minimum value */
  min?: number;
  /** Form name */
  name?: string;
  /** Called when the numeric value changes */
  onValueChange?: (value: number | null) => void;
  /** Step increment */
  step?: number;
  /** Controlled value */
  value?: number | null;
}

export type NumberFieldRootProps = ComponentProps<"div"> & {
  defaultValue?: number;
  disabled?: boolean;
  max?: number;
  min?: number;
  name?: string;
  onValueChange?: (value: number | null) => void;
  step?: number;
  value?: number | null;
};
export type NumberFieldGroupProps = ComponentProps<"div">;
export type NumberFieldInputProps = ComponentProps<"input">;
export type NumberFieldIncrementProps = ComponentProps<"button"> & {
  children?: ReactNode;
};
export type NumberFieldDecrementProps = ComponentProps<"button"> & {
  children?: ReactNode;
};
export type NumberFieldScrubAreaProps = ComponentProps<"div">;

const STEPPER_CLASS =
  "flex size-8 shrink-0 items-center justify-center border border-foreground/25 bg-background text-foreground outline-none transition-colors hover:bg-muted focus-visible:z-10 focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50";

const INPUT_CLASS =
  "h-8 w-[7ch] min-w-0 border border-foreground/25 bg-background px-2 text-center font-medium text-sm tabular-nums outline-none transition-[color,box-shadow] focus-visible:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [appearance:textfield]";

const MinusIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    fill="none"
    height="14"
    stroke="currentColor"
    strokeLinecap="round"
    strokeWidth="2"
    aria-hidden="true"
    focusable="false"
    viewBox="0 0 16 16"
    width="14"
    {...props}
  >
    <path d="M3 8h10" />
  </svg>
);

const PlusIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    fill="none"
    height="14"
    stroke="currentColor"
    strokeLinecap="round"
    strokeWidth="2"
    aria-hidden="true"
    focusable="false"
    viewBox="0 0 16 16"
    width="14"
    {...props}
  >
    <path d="M8 3v10M3 8h10" />
  </svg>
);

/**
 * Radix has no Number Field — this twin mirrors Base UI props with a native
 * number input and stepper buttons.
 */
export const NumberFieldRoot = ({
  className,
  ...props
}: NumberFieldRootProps) => (
  <div
    className={cn("flex flex-col items-start gap-1.5", className)}
    data-slot="number-field"
    {...props}
  />
);

export const NumberFieldGroup = ({
  className,
  ...props
}: NumberFieldGroupProps) => (
  <div
    className={cn("flex h-8 items-stretch", className)}
    data-slot="number-field-group"
    {...props}
  />
);

export const NumberFieldInput = ({
  className,
  ...props
}: NumberFieldInputProps) => (
  <input
    className={cn(INPUT_CLASS, className)}
    data-slot="number-field-input"
    type="number"
    {...props}
  />
);

export const NumberFieldDecrement = ({
  children,
  className,
  type = "button",
  ...props
}: NumberFieldDecrementProps) => (
  <button
    className={cn(STEPPER_CLASS, "rounded-l-md border-r-0", className)}
    data-slot="number-field-decrement"
    type={type}
    {...props}
  >
    {children ?? <MinusIcon />}
  </button>
);

export const NumberFieldIncrement = ({
  children,
  className,
  type = "button",
  ...props
}: NumberFieldIncrementProps) => (
  <button
    className={cn(STEPPER_CLASS, "rounded-r-md border-l-0", className)}
    data-slot="number-field-increment"
    type={type}
    {...props}
  >
    {children ?? <PlusIcon />}
  </button>
);

export const NumberFieldScrubArea = ({
  className,
  ...props
}: NumberFieldScrubAreaProps) => (
  <div
    className={cn("select-none", className)}
    data-slot="number-field-scrub-area"
    {...props}
  />
);

export default function NumberField({
  "aria-label": ariaLabel,
  className,
  defaultValue = 0,
  disabled,
  label,
  max,
  min,
  name,
  onValueChange,
  step = 1,
  value: valueProp,
}: NumberFieldProps) {
  const id = useId();
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const isControlled = valueProp !== undefined;
  const value = isControlled ? (valueProp ?? 0) : uncontrolled;

  const commit = useCallback(
    (next: number) => {
      let clamped = next;
      if (typeof min === "number") {
        clamped = Math.max(min, clamped);
      }
      if (typeof max === "number") {
        clamped = Math.min(max, clamped);
      }
      if (!isControlled) {
        setUncontrolled(clamped);
      }
      onValueChange?.(clamped);
    },
    [isControlled, max, min, onValueChange]
  );

  return (
    <NumberFieldRoot className={className}>
      {label ? (
        <NumberFieldScrubArea>
          <label className="font-medium text-sm leading-none" htmlFor={id}>
            {label}
          </label>
        </NumberFieldScrubArea>
      ) : null}
      <NumberFieldGroup>
        <NumberFieldDecrement
          aria-label="Decrement"
          disabled={disabled}
          onClick={() => commit(value - step)}
        />
        <NumberFieldInput
          aria-label={label ? undefined : ariaLabel}
          disabled={disabled}
          id={id}
          max={max}
          min={min}
          name={name}
          onChange={(event) => {
            const next = event.target.valueAsNumber;
            commit(Number.isFinite(next) ? next : 0);
          }}
          step={step}
          value={value}
        />
        <NumberFieldIncrement
          aria-label="Increment"
          disabled={disabled}
          onClick={() => commit(value + step)}
        />
      </NumberFieldGroup>
    </NumberFieldRoot>
  );
}
