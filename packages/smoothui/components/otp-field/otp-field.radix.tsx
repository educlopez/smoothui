"use client";

import { cn } from "@repo/smoothui-utils";
import {
  type ChangeEvent,
  type ClipboardEvent,
  type ComponentProps,
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

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

export type OTPFieldRootProps = ComponentProps<"fieldset"> & {
  length?: number;
};
export type OTPFieldInputProps = ComponentProps<"input">;

const SLOT_CLASS =
  "m-0 size-10 shrink-0 rounded-md border border-foreground/25 bg-background text-center font-medium text-sm tabular-nums outline-none state-transition placeholder:text-muted-foreground/50 focus-visible:border-ring focus-ring disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground";

const DIGIT_ONLY = /^\d*$/;

export const OTPFieldRoot = ({ className, ...props }: OTPFieldRootProps) => (
  <fieldset
    className={cn("m-0 flex w-full min-w-0 gap-2 border-0 p-0", className)}
    data-slot="otp-field"
    {...props}
  />
);

export const OTPFieldInput = ({ className, ...props }: OTPFieldInputProps) => (
  <input
    className={cn(SLOT_CLASS, className)}
    data-slot="otp-field-input"
    {...props}
  />
);

/**
 * Radix has no OTP Field — this twin mirrors Base UI props with coordinated
 * single-character inputs, paste, and arrow-key navigation.
 */
export default function OTPField({
  "aria-label": ariaLabel,
  className,
  defaultValue = "",
  disabled,
  label,
  length = 6,
  mask = false,
  name,
  onValueChange,
  placeholder = "•",
  value: valueProp,
}: OTPFieldProps) {
  const id = useId();
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : uncontrolled;
  const chars = useMemo(() => {
    const padded = value.padEnd(length, " ").slice(0, length);
    return padded.split("").map((char) => (char === " " ? "" : char));
  }, [length, value]);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const commit = useCallback(
    (nextChars: string[]) => {
      const next = nextChars.join("").replaceAll(" ", "");
      if (!isControlled) {
        setUncontrolled(next);
      }
      onValueChange?.(next);
    },
    [isControlled, onValueChange]
  );

  const focusAt = (index: number) => {
    refs.current[index]?.focus();
    refs.current[index]?.select();
  };

  const handleChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const raw = event.target.value;
    if (!DIGIT_ONLY.test(raw)) {
      return;
    }
    const nextChars = [...chars];
    if (raw.length === 0) {
      nextChars[index] = "";
      commit(nextChars);
      return;
    }
    const digits = raw
      .replace(/\D/g, "")
      .slice(0, length - index)
      .split("");
    for (let offset = 0; offset < digits.length; offset += 1) {
      nextChars[index + offset] = digits[offset] ?? "";
    }
    commit(nextChars);
    const nextIndex = Math.min(index + digits.length, length - 1);
    focusAt(nextIndex);
  };

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Backspace" && !chars[index] && index > 0) {
      event.preventDefault();
      const nextChars = [...chars];
      nextChars[index - 1] = "";
      commit(nextChars);
      focusAt(index - 1);
      return;
    }
    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      focusAt(index - 1);
    }
    if (event.key === "ArrowRight" && index < length - 1) {
      event.preventDefault();
      focusAt(index + 1);
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);
    if (!pasted) {
      return;
    }
    const nextChars = Array.from({ length }, (_, i) => pasted[i] ?? "");
    commit(nextChars);
    focusAt(Math.min(pasted.length, length - 1));
  };

  const slots: ReactNode[] = [];
  for (let index = 0; index < length; index += 1) {
    slots.push(
      <OTPFieldInput
        aria-label={
          index === 0 && (label || ariaLabel)
            ? undefined
            : `Character ${index + 1} of ${length}`
        }
        autoComplete={index === 0 ? "one-time-code" : "off"}
        disabled={disabled}
        id={index === 0 ? id : undefined}
        inputMode="numeric"
        key={index}
        maxLength={length}
        onChange={(event) => handleChange(index, event)}
        onKeyDown={(event) => handleKeyDown(index, event)}
        onPaste={handlePaste}
        placeholder={placeholder}
        ref={(node) => {
          refs.current[index] = node;
        }}
        type={mask ? "password" : "text"}
        value={chars[index] ?? ""}
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
      <OTPFieldRoot aria-label={label ? undefined : ariaLabel}>
        {slots}
      </OTPFieldRoot>
      {name ? <input name={name} type="hidden" value={value} /> : null}
    </div>
  );
}
