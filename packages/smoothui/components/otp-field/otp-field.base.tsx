"use client";

import { OTPField as OTPFieldPrimitive } from "@base-ui/react/otp-field";
import { cn } from "@repo/smoothui-utils";
import type { ComponentProps, ReactNode } from "react";
import { useId } from "react";

export interface OTPFieldProps {
  /** Accessible name when there is no visible `label` */
  "aria-label"?: string;
  /** Optional CSS class for the root */
  className?: string;
  /** Uncontrolled initial value */
  defaultValue?: string;
  /** Disable all slots */
  disabled?: boolean;
  /** Visible label above the slots */
  label?: string;
  /** Number of digit slots (default 6) */
  length?: number;
  /** Obscure characters (shared-screen friendly) */
  mask?: boolean;
  /** Form name */
  name?: string;
  /** Called when the OTP string changes */
  onValueChange?: (value: string) => void;
  /** Placeholder character for empty slots */
  placeholder?: string;
  /** Controlled value */
  value?: string;
}

export type OTPFieldRootProps = Omit<
  ComponentProps<typeof OTPFieldPrimitive.Root>,
  "className"
> & { className?: string };
export type OTPFieldInputProps = Omit<
  ComponentProps<typeof OTPFieldPrimitive.Input>,
  "className"
> & { className?: string };

const SLOT_CLASS =
  "m-0 size-10 shrink-0 rounded-md border border-foreground/25 bg-background text-center font-medium text-sm tabular-nums outline-none transition-[color,box-shadow] placeholder:text-muted-foreground/50 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground data-disabled:cursor-not-allowed data-disabled:bg-muted";

export const OTPFieldRoot = ({ className, ...props }: OTPFieldRootProps) => (
  <OTPFieldPrimitive.Root
    className={cn("flex w-full gap-2", className)}
    data-slot="otp-field"
    {...props}
  />
);

export const OTPFieldInput = ({ className, ...props }: OTPFieldInputProps) => (
  <OTPFieldPrimitive.Input
    className={cn(SLOT_CLASS, className)}
    data-slot="otp-field-input"
    {...props}
  />
);

/**
 * SmoothUI OTP Field — Base UI twin (default).
 * Convenience API that renders `length` digit slots.
 */
export default function OTPField({
  "aria-label": ariaLabel,
  className,
  defaultValue,
  disabled,
  label,
  length = 6,
  mask = false,
  name,
  onValueChange,
  placeholder = "•",
  value,
}: OTPFieldProps) {
  const id = useId();
  const slots: ReactNode[] = [];

  for (let index = 0; index < length; index += 1) {
    slots.push(
      <OTPFieldInput
        aria-label={
          index === 0 ? undefined : `Character ${index + 1} of ${length}`
        }
        disabled={disabled}
        key={index}
        placeholder={placeholder}
      />
    );
  }

  return (
    <div className={cn("flex flex-col items-start gap-1.5", className)}>
      {label ? (
        <label className="font-medium text-sm leading-none" htmlFor={id}>
          {label}
        </label>
      ) : null}
      <OTPFieldRoot
        aria-label={label ? undefined : ariaLabel}
        defaultValue={defaultValue}
        disabled={disabled}
        id={id}
        length={length}
        mask={mask}
        name={name}
        onValueChange={(next) => {
          onValueChange?.(next);
        }}
        value={value}
      >
        {slots}
      </OTPFieldRoot>
    </div>
  );
}
