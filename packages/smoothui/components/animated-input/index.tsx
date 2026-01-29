import { motion, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";

const EASE_IN_OUT_CUBIC_X1 = 0.4;
const EASE_IN_OUT_CUBIC_Y1 = 0;
const EASE_IN_OUT_CUBIC_X2 = 0.2;
const EASE_IN_OUT_CUBIC_Y2 = 1;
const RADIX_BASE_36 = 36;
const RANDOM_ID_START_INDEX = 2;
const RANDOM_ID_LENGTH = 9;

const LABEL_TRANSITION = {
  duration: 0.28,
  ease: [
    EASE_IN_OUT_CUBIC_X1,
    EASE_IN_OUT_CUBIC_Y1,
    EASE_IN_OUT_CUBIC_X2,
    EASE_IN_OUT_CUBIC_Y2,
  ], // standard material easing
};

export type AnimatedInputProps = {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  icon?: React.ReactNode;
};

export default function AnimatedInput({
  value,
  defaultValue = "",
  onChange,
  label,
  placeholder = "",
  disabled = false,
  className = "",
  inputClassName = "",
  labelClassName = "",
  icon,
}: AnimatedInputProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const val = isControlled ? value : internalValue;
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const isFloating = !!val || isFocused;
  const shouldReduceMotion = useReducedMotion();
  const inputId = `animated-input-${Math.random().toString(RADIX_BASE_36).substring(RANDOM_ID_START_INDEX, RANDOM_ID_LENGTH)}`;

  return (
    <div className={`relative flex items-center ${className}`}>
      {icon && (
        <span
          aria-hidden="true"
          className="absolute top-1/2 left-3 -translate-y-1/2"
        >
          {icon}
        </span>
      )}
      <input
        aria-label={label}
        className={`peer w-full rounded-sm border bg-background px-3 py-2 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${icon ? "pl-10" : ""} ${inputClassName}`}
        disabled={disabled}
        id={inputId}
        onBlur={() => setIsFocused(false)}
        onChange={(e) => {
          if (!isControlled) {
            setInternalValue(e.target.value);
          }
          onChange?.(e.target.value);
        }}
        onFocus={() => setIsFocused(true)}
        placeholder={isFloating ? placeholder : ""}
        ref={inputRef}
        type="text"
        value={val}
      />
      <motion.label
        animate={
          shouldReduceMotion
            ? {}
            : isFloating
              ? {
                  y: -24,
                  scale: 0.85,
                  color: "var(--color-brand)",
                  borderColor: "var(--color-brand)",
                }
              : { y: 0, scale: 1, color: "#6b7280" }
        }
        className={`pointer-events-none absolute top-1/2 left-3 origin-left -translate-y-1/2 rounded-sm border border-transparent bg-background px-1 text-foreground transition-all ${labelClassName}`}
        htmlFor={inputId}
        style={{
          zIndex: 2,
          ...(shouldReduceMotion && isFloating
            ? {
                transform: "translateY(-24px) scale(0.85)",
                color: "var(--color-brand)",
                borderColor: "var(--color-brand)",
              }
            : shouldReduceMotion
              ? {
                  transform: "translateY(0) scale(1)",
                  color: "#6b7280",
                }
              : {}),
        }}
        transition={shouldReduceMotion ? { duration: 0 } : LABEL_TRANSITION}
      >
        {label}
      </motion.label>
    </div>
  );
}
