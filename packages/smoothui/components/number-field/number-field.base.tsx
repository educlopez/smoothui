"use client";

import { NumberField as NumberFieldPrimitive } from "@base-ui/react/number-field";
import { cn } from "@repo/smoothui-utils";
import type { ComponentProps, ReactNode, SVGProps } from "react";
import { useId } from "react";

export interface NumberFieldProps {
  /** Accessible name when there is no visible `label` */
  "aria-label"?: string;
  /** Optional CSS class for the root */
  className?: string;
  /** Uncontrolled initial value */
  defaultValue?: number;
  /** Disable the field */
  disabled?: boolean;
  /** Visible label (also enables scrub on the label) */
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

export type NumberFieldRootProps = Omit<
  ComponentProps<typeof NumberFieldPrimitive.Root>,
  "className"
> & { className?: string };
export type NumberFieldGroupProps = Omit<
  ComponentProps<typeof NumberFieldPrimitive.Group>,
  "className"
> & { className?: string };
export type NumberFieldInputProps = Omit<
  ComponentProps<typeof NumberFieldPrimitive.Input>,
  "className"
> & { className?: string };
export type NumberFieldIncrementProps = Omit<
  ComponentProps<typeof NumberFieldPrimitive.Increment>,
  "className"
> & { className?: string; children?: ReactNode };
export type NumberFieldDecrementProps = Omit<
  ComponentProps<typeof NumberFieldPrimitive.Decrement>,
  "className"
> & { className?: string; children?: ReactNode };
export type NumberFieldScrubAreaProps = Omit<
  ComponentProps<typeof NumberFieldPrimitive.ScrubArea>,
  "className"
> & { className?: string };

const STEPPER_CLASS =
  "flex size-8 shrink-0 items-center justify-center border border-foreground/25 bg-background text-foreground outline-none state-transition hover:bg-muted focus-visible:z-10 focus-ring disabled:pointer-events-none disabled:opacity-50 data-disabled:pointer-events-none data-disabled:opacity-50";

const INPUT_CLASS =
  "h-8 w-[7ch] min-w-0 border border-foreground/25 bg-background px-2 text-center font-medium text-sm tabular-nums outline-none state-transition focus-visible:z-10 focus-visible:border-ring focus-ring disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground";

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

export const NumberFieldRoot = ({
  className,
  ...props
}: NumberFieldRootProps) => (
  <NumberFieldPrimitive.Root
    className={cn("flex flex-col items-start gap-1.5", className)}
    data-slot="number-field"
    {...props}
  />
);

export const NumberFieldGroup = ({
  className,
  ...props
}: NumberFieldGroupProps) => (
  <NumberFieldPrimitive.Group
    className={cn("flex h-8 items-stretch", className)}
    data-slot="number-field-group"
    {...props}
  />
);

export const NumberFieldInput = ({
  className,
  ...props
}: NumberFieldInputProps) => (
  <NumberFieldPrimitive.Input
    className={cn(INPUT_CLASS, className)}
    data-slot="number-field-input"
    {...props}
  />
);

export const NumberFieldDecrement = ({
  children,
  className,
  ...props
}: NumberFieldDecrementProps) => (
  <NumberFieldPrimitive.Decrement
    aria-label="Decrement"
    className={cn(STEPPER_CLASS, "rounded-l-md border-r-0", className)}
    data-slot="number-field-decrement"
    {...props}
  >
    {children ?? <MinusIcon />}
  </NumberFieldPrimitive.Decrement>
);

export const NumberFieldIncrement = ({
  children,
  className,
  ...props
}: NumberFieldIncrementProps) => (
  <NumberFieldPrimitive.Increment
    aria-label="Increment"
    className={cn(STEPPER_CLASS, "rounded-r-md border-l-0", className)}
    data-slot="number-field-increment"
    {...props}
  >
    {children ?? <PlusIcon />}
  </NumberFieldPrimitive.Increment>
);

export const NumberFieldScrubArea = ({
  className,
  ...props
}: NumberFieldScrubAreaProps) => (
  <NumberFieldPrimitive.ScrubArea
    className={cn("cursor-ew-resize select-none", className)}
    data-slot="number-field-scrub-area"
    {...props}
  />
);

/**
 * SmoothUI Number Field — Base UI twin (default).
 * Convenience API with label + steppers; use compounds for custom layouts.
 */
export default function NumberField({
  "aria-label": ariaLabel,
  className,
  defaultValue,
  disabled,
  label,
  max,
  min,
  name,
  onValueChange,
  step,
  value,
}: NumberFieldProps) {
  const id = useId();

  return (
    <NumberFieldRoot
      className={className}
      defaultValue={defaultValue}
      disabled={disabled}
      id={id}
      max={max}
      min={min}
      name={name}
      onValueChange={(next) => {
        onValueChange?.(next);
      }}
      step={step}
      value={value}
    >
      {label ? (
        <NumberFieldScrubArea>
          <label
            className="cursor-ew-resize font-medium text-sm leading-none"
            htmlFor={id}
          >
            {label}
          </label>
        </NumberFieldScrubArea>
      ) : null}
      <NumberFieldGroup>
        <NumberFieldDecrement />
        <NumberFieldInput aria-label={label ? undefined : ariaLabel} />
        <NumberFieldIncrement />
      </NumberFieldGroup>
    </NumberFieldRoot>
  );
}
