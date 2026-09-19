"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import SmoothButton from "@repo/smoothui/components/smooth-button";
import { Minus, Plus } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useAnimation,
  useReducedMotion,
} from "motion/react";
import {
  type ChangeEvent,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

const DEFAULT_STEP = 1;
const DEFAULT_MIN = Number.NEGATIVE_INFINITY;
const DEFAULT_MAX = Number.POSITIVE_INFINITY;
const LARGE_STEP_MULTIPLIER = 10;
const SMALL_STEP_DIVISOR = 10;
const SCRUB_THRESHOLD_PX = 4;
const SCRUB_STEP_PX = 8;
const ROLL_DISTANCE = 14;
const SHAKE_DISTANCE = 6;
const SHAKE_DURATION = 0.4;
const DIGIT_SPRING = { bounce: 0.1, duration: 0.25, type: "spring" as const };
const MOVEMENT_EASE: [number, number, number, number] = [
  0.645, 0.045, 0.355, 1,
];
const NON_NUMERIC_CHARS_REGEX = /[^\d.-]/g;

export type AnimatedNumberInputProps = {
  /** Additional CSS classes for the outer wrapper */
  className?: string;
  /** Whether a typed out-of-range value is clamped to min/max on blur */
  clampOnBlur?: boolean;
  /** Default value for uncontrolled usage */
  defaultValue?: number;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Intl.NumberFormat options used to render the value */
  format?: Intl.NumberFormatOptions;
  /** Visible label rendered above the field */
  label?: string;
  /** Maximum allowed value */
  max?: number;
  /** Minimum allowed value */
  min?: number;
  /** Called whenever the committed value changes */
  onValueChange?: (value: number) => void;
  /** Number of decimal places the value is rounded to */
  precision?: number;
  /** Static text rendered before the value */
  prefix?: string;
  /** Whether dragging horizontally changes the value */
  scrub?: boolean;
  /** Increment used by arrows, stepper buttons and scrubbing */
  step?: number;
  /** Whether to render +/- stepper buttons */
  stepper?: boolean;
  /** Static text rendered after the value */
  suffix?: string;
  /** Controlled value */
  value?: number;
};

const clampValue = (num: number, min: number, max: number) =>
  Math.min(max, Math.max(min, num));

const isDigitChar = (char: string) => /\d/.test(char);

const parseRawValue = (
  text: string,
  prefix?: string,
  suffix?: string
): number | null => {
  let cleaned = text.trim();
  if (prefix && cleaned.startsWith(prefix)) {
    cleaned = cleaned.slice(prefix.length);
  }
  if (suffix && cleaned.endsWith(suffix)) {
    cleaned = cleaned.slice(0, cleaned.length - suffix.length);
  }
  cleaned = cleaned.replace(NON_NUMERIC_CHARS_REGEX, "");
  if (cleaned === "" || cleaned === "-") {
    return null;
  }
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
};

type DigitSlotProps = {
  char: string;
  direction: 1 | -1;
  reduceMotion: boolean;
};

const DigitSlot = ({ char, direction, reduceMotion }: DigitSlotProps) => {
  const rolling = isDigitChar(char);
  return (
    <span className="relative inline-block h-[1.2em] w-[0.62em] overflow-hidden text-center align-bottom tabular-nums">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          animate={{ opacity: 1, y: 0 }}
          className="absolute inset-0 flex items-center justify-center"
          exit={
            reduceMotion
              ? { opacity: 0, transition: { duration: 0 } }
              : { opacity: 0, y: rolling ? -direction * ROLL_DISTANCE : 0 }
          }
          initial={
            reduceMotion
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: rolling ? direction * ROLL_DISTANCE : 0 }
          }
          key={char}
          transition={reduceMotion ? { duration: 0 } : DIGIT_SPRING}
        >
          {char}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

type FadeBlockProps = {
  className?: string;
  reduceMotion: boolean;
  text: string;
};

const FadeBlock = ({ text, reduceMotion, className }: FadeBlockProps) => (
  <AnimatePresence initial={false} mode="popLayout">
    <motion.span
      animate={{ opacity: 1 }}
      className={cn("inline-block", className)}
      exit={
        reduceMotion
          ? { opacity: 0, transition: { duration: 0 } }
          : { opacity: 0 }
      }
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
      key={text}
      transition={reduceMotion ? { duration: 0 } : DIGIT_SPRING}
    >
      {text}
    </motion.span>
  </AnimatePresence>
);

const AnimatedNumberInput = ({
  value: controlledValue,
  defaultValue = 0,
  onValueChange,
  min = DEFAULT_MIN,
  max = DEFAULT_MAX,
  step = DEFAULT_STEP,
  precision,
  format,
  prefix = "",
  suffix = "",
  scrub = true,
  stepper = false,
  clampOnBlur = true,
  disabled = false,
  label,
  className,
}: AnimatedNumberInputProps) => {
  const shouldReduceMotion = !!useReducedMotion();
  const reactId = useId();
  const inputId = `animated-number-input-${reactId.replace(/:/g, "")}`;

  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;
  const lastValueRef = useRef(value);

  const [isEditing, setIsEditing] = useState(false);
  const [rawInputValue, setRawInputValue] = useState("");
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isInvalid, setIsInvalid] = useState(false);
  const [isScrubbing, setIsScrubbing] = useState(false);

  const shakeControls = useAnimation();
  const scrubRef = useRef<{
    active: boolean;
    startValue: number;
    startX: number;
  } | null>(null);

  const numberFormatter = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        maximumFractionDigits: precision,
        minimumFractionDigits: precision,
        ...format,
      }),
    [precision, format]
  );

  const formattedText = useMemo(
    () => numberFormatter.format(value),
    [numberFormatter, value]
  );

  useEffect(() => {
    lastValueRef.current = value;
  }, [value]);

  useEffect(() => {
    if (!isInvalid) {
      return;
    }
    if (shouldReduceMotion) {
      setIsInvalid(false);
      return;
    }
    let cancelled = false;
    shakeControls
      .start({
        transition: { duration: SHAKE_DURATION, ease: MOVEMENT_EASE },
        x: [0, -SHAKE_DISTANCE, SHAKE_DISTANCE, -SHAKE_DISTANCE / 2, 0],
      })
      .then(() => {
        if (!cancelled) {
          setIsInvalid(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [isInvalid, shouldReduceMotion, shakeControls]);

  const applyValue = useCallback(
    (next: number, options?: { clamp?: boolean }) => {
      const shouldClamp = options?.clamp ?? true;
      let nextValue = shouldClamp ? clampValue(next, min, max) : next;
      if (precision !== undefined) {
        const factor = 10 ** precision;
        nextValue = Math.round(nextValue * factor) / factor;
      }
      setDirection(nextValue >= lastValueRef.current ? 1 : -1);
      lastValueRef.current = nextValue;
      if (!isControlled) {
        setInternalValue(nextValue);
      }
      onValueChange?.(nextValue);
      setIsEditing(false);
      setIsInvalid(false);
    },
    [isControlled, min, max, precision, onValueChange]
  );

  const commitFromText = useCallback(() => {
    const parsed = parseRawValue(rawInputValue, prefix, suffix);
    if (parsed === null) {
      setIsInvalid(true);
      setIsEditing(false);
      setRawInputValue(formattedText);
      return;
    }
    applyValue(parsed, { clamp: clampOnBlur });
  }, [rawInputValue, prefix, suffix, formattedText, clampOnBlur, applyValue]);

  const handleFocus = () => {
    setIsEditing(true);
    setRawInputValue(formattedText);
  };

  const handleBlur = () => {
    commitFromText();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsEditing(true);
    setRawInputValue(event.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) {
      return;
    }
    const bigStep = step * LARGE_STEP_MULTIPLIER;
    const smallStep = step / SMALL_STEP_DIVISOR;
    const effectiveStep = event.shiftKey
      ? bigStep
      : event.altKey
        ? smallStep
        : step;

    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        applyValue(lastValueRef.current + effectiveStep);
        break;
      case "ArrowDown":
        event.preventDefault();
        applyValue(lastValueRef.current - effectiveStep);
        break;
      case "PageUp":
        event.preventDefault();
        applyValue(lastValueRef.current + bigStep);
        break;
      case "PageDown":
        event.preventDefault();
        applyValue(lastValueRef.current - bigStep);
        break;
      case "Home":
        if (Number.isFinite(min)) {
          event.preventDefault();
          applyValue(min);
        }
        break;
      case "End":
        if (Number.isFinite(max)) {
          event.preventDefault();
          applyValue(max);
        }
        break;
      case "Enter":
        event.preventDefault();
        commitFromText();
        break;
      default:
        break;
    }
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLInputElement>) => {
    if (!scrub || disabled) {
      return;
    }
    scrubRef.current = {
      active: false,
      startValue: lastValueRef.current,
      startX: event.clientX,
    };
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLInputElement>) => {
    if (!(scrub && scrubRef.current) || disabled) {
      return;
    }
    const state = scrubRef.current;
    const deltaX = event.clientX - state.startX;
    if (!state.active) {
      if (Math.abs(deltaX) < SCRUB_THRESHOLD_PX) {
        return;
      }
      state.active = true;
      setIsScrubbing(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    event.preventDefault();
    const steps = Math.trunc(deltaX / SCRUB_STEP_PX);
    applyValue(state.startValue + steps * step);
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLInputElement>) => {
    if (scrubRef.current?.active) {
      event.currentTarget.releasePointerCapture(event.pointerId);
      setIsScrubbing(false);
    }
    scrubRef.current = null;
  };

  const handleStep = (delta: number) => () => {
    if (disabled) {
      return;
    }
    applyValue(lastValueRef.current + delta);
  };

  const currentText = isEditing ? rawInputValue : formattedText;

  return (
    <div className={cn("inline-flex flex-col gap-1.5", className)}>
      {label ? (
        <label
          className="font-medium text-foreground text-sm"
          htmlFor={inputId}
        >
          {label}
        </label>
      ) : null}
      <motion.div
        animate={shakeControls}
        className={cn(
          "relative flex h-10 items-center overflow-hidden rounded-lg border border-border bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
          isInvalid && "border-destructive",
          disabled && "cursor-not-allowed opacity-50",
          scrub && !disabled && !isScrubbing && "cursor-ew-resize",
          isScrubbing && "cursor-ew-resize"
        )}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none flex flex-1 select-none items-center px-3 font-medium text-foreground text-sm"
        >
          {prefix ? (
            <FadeBlock
              className="mr-0.5"
              reduceMotion={shouldReduceMotion}
              text={prefix}
            />
          ) : null}
          {currentText.split("").map((char, index) => (
            <DigitSlot
              char={char}
              direction={direction}
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed-width positional digit slots, identity is carried by the inner AnimatePresence key
              key={index}
              reduceMotion={shouldReduceMotion}
            />
          ))}
          {suffix ? (
            <FadeBlock
              className="ml-0.5"
              reduceMotion={shouldReduceMotion}
              text={suffix}
            />
          ) : null}
        </div>
        <input
          aria-invalid={isInvalid}
          aria-label={label ?? "Number input"}
          aria-valuemax={Number.isFinite(max) ? max : undefined}
          aria-valuemin={Number.isFinite(min) ? min : undefined}
          aria-valuenow={value}
          aria-valuetext={formattedText}
          className="absolute inset-0 h-full w-full bg-transparent px-3 text-transparent outline-none"
          disabled={disabled}
          id={inputId}
          inputMode="decimal"
          onBlur={handleBlur}
          onChange={handleChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          role="spinbutton"
          style={{ caretColor: "var(--color-foreground)" }}
          type="text"
          value={currentText}
        />
        {stepper ? (
          <div className="relative z-10 mr-1 flex items-center gap-0.5">
            <SmoothButton
              aria-label="Decrease value"
              disabled={disabled || value <= min}
              onClick={handleStep(-step)}
              size="icon-sm"
              variant="ghost"
            >
              <Minus />
            </SmoothButton>
            <SmoothButton
              aria-label="Increase value"
              disabled={disabled || value >= max}
              onClick={handleStep(step)}
              size="icon-sm"
              variant="ghost"
            >
              <Plus />
            </SmoothButton>
          </div>
        ) : null}
      </motion.div>
    </div>
  );
};

export default AnimatedNumberInput;
