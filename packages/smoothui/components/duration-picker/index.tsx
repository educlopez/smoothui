"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

export type DurationUnit = "hours" | "minutes" | "seconds";

export type DurationPickerProps = {
  /** Additional CSS classes */
  className?: string;
  /** Controlled value in seconds */
  value?: number;
  /** Default value (uncontrolled) in seconds */
  defaultValue?: number;
  /** Called whenever the duration changes, with the new value in seconds */
  onValueChange?: (value: number) => void;
  /** Which unit segments to render, most-significant first */
  units?: DurationUnit[];
  /** Minimum total duration in seconds */
  min?: number;
  /** Maximum total duration in seconds */
  max?: number;
  /** Increment applied per arrow key press, in the focused unit's own scale */
  step?: number;
  /** Enable horizontal pointer drag to scrub a segment's value */
  scrub?: boolean;
  /** Disable all interaction */
  disabled?: boolean;
  /** Visible label rendered above the picker */
  label?: string;
};

const UNIT_ORDER: DurationUnit[] = ["hours", "minutes", "seconds"];
const UNIT_DIVISOR: Record<DurationUnit, number> = {
  hours: 3600,
  minutes: 60,
  seconds: 1,
};
const UNIT_LABEL: Record<DurationUnit, string> = {
  hours: "hour",
  minutes: "minute",
  seconds: "second",
};

const DEFAULT_UNITS: DurationUnit[] = ["hours", "minutes", "seconds"];
const DEFAULT_MIN = 0;
const DEFAULT_MAX = 359_999;
const DEFAULT_STEP = 1;
const SHIFT_MULTIPLIER = 10;
const PAGE_STEP_MULTIPLIER = 5;
const TYPE_BUFFER_TIMEOUT_MS = 600;
const PX_PER_DRAG_STEP = 6;
const DIGIT_HEIGHT = 24;
const DIGIT_ROLL_DISTANCE = 12;
const DIGIT_KEY_PATTERN = /^[0-9]$/;

const PAD_FORMATTER = new Intl.NumberFormat(undefined, {
  minimumIntegerDigits: 2,
  useGrouping: false,
});

const clamp = (val: number, min: number, max: number) =>
  Math.min(Math.max(val, min), max);

const sortUnits = (units: DurationUnit[]): DurationUnit[] => {
  const sorted = UNIT_ORDER.filter((unit) => units.includes(unit));
  return sorted.length > 0 ? sorted : DEFAULT_UNITS;
};

const decomposeDuration = (
  totalSeconds: number,
  units: DurationUnit[]
): number[] => {
  let remaining = Math.max(0, Math.trunc(totalSeconds));
  const values: number[] = [];
  for (const unit of units) {
    const divisor = UNIT_DIVISOR[unit];
    const segmentValue = Math.floor(remaining / divisor);
    values.push(segmentValue);
    remaining -= segmentValue * divisor;
  }
  return values;
};

const getSegmentMax = (
  index: number,
  units: DurationUnit[],
  overallMax: number
): number => {
  if (index === 0) {
    return Math.floor(overallMax / UNIT_DIVISOR[units[0]]);
  }
  const higherDivisor = UNIT_DIVISOR[units[index - 1]];
  const thisDivisor = UNIT_DIVISOR[units[index]];
  return Math.floor(higherDivisor / thisDivisor) - 1;
};

const pluralize = (count: number, unit: DurationUnit) =>
  `${count} ${UNIT_LABEL[unit]}${count === 1 ? "" : "s"}`;

/** Formats a duration in seconds into a padded, colon-separated string for the given units. */
export const formatDuration = (
  totalSeconds: number,
  units: DurationUnit[] = DEFAULT_UNITS
): string => {
  const sortedUnits = sortUnits(units);
  const values = decomposeDuration(totalSeconds, sortedUnits);
  return values.map((value) => PAD_FORMATTER.format(value)).join(":");
};

type AnimatedDigitProps = {
  char: string;
  reduceMotion: boolean;
};

const AnimatedDigit = ({ char, reduceMotion }: AnimatedDigitProps) => (
  <span
    className="relative inline-block w-[0.62em] text-center"
    style={{ height: DIGIT_HEIGHT }}
  >
    <AnimatePresence initial={false} mode="popLayout">
      <motion.span
        animate={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
        className="absolute inset-0 flex items-center justify-center"
        exit={
          reduceMotion
            ? { opacity: 0, transition: { duration: 0 } }
            : { opacity: 0, y: DIGIT_ROLL_DISTANCE }
        }
        initial={
          reduceMotion
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: -DIGIT_ROLL_DISTANCE }
        }
        key={char}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { bounce: 0.1, duration: 0.25, type: "spring" }
        }
      >
        {char}
      </motion.span>
    </AnimatePresence>
  </span>
);

type TypingState = { index: number; text: string };

const DurationPicker = ({
  className,
  value: controlledValue,
  defaultValue = 0,
  onValueChange,
  units = DEFAULT_UNITS,
  min = DEFAULT_MIN,
  max = DEFAULT_MAX,
  step = DEFAULT_STEP,
  scrub = true,
  disabled = false,
  label,
}: DurationPickerProps) => {
  const shouldReduceMotion = useReducedMotion();
  const labelId = useId();
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(
    clamp(defaultValue, min, max)
  );
  const value = isControlled ? controlledValue : internalValue;

  const sortedUnits = useMemo(() => sortUnits(units), [units]);
  const values = useMemo(
    () => decomposeDuration(value, sortedUnits),
    [value, sortedUnits]
  );

  const segmentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dragStateRef = useRef<{
    index: number;
    startX: number;
    startValue: number;
  } | null>(null);
  const typingRef = useRef<TypingState | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  const setTotal = useCallback(
    (next: number) => {
      const clamped = clamp(Math.round(next), min, max);
      if (!isControlled) {
        setInternalValue(clamped);
      }
      onValueChange?.(clamped);
    },
    [isControlled, min, max, onValueChange]
  );

  const commitSegmentValue = useCallback(
    (index: number, rawValue: number) => {
      const divisor = UNIT_DIVISOR[sortedUnits[index]];
      const currentValues = decomposeDuration(value, sortedUnits);
      const delta = (rawValue - currentValues[index]) * divisor;
      setTotal(value + delta);
    },
    [sortedUnits, value, setTotal]
  );

  const clearTypingTimeout = useCallback(() => {
    if (typingTimeoutRef.current !== undefined) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = undefined;
    }
  }, []);

  useEffect(() => clearTypingTimeout, [clearTypingTimeout]);

  const focusSegment = useCallback((index: number) => {
    segmentRefs.current[index]?.focus();
  }, []);

  const commitTyped = useCallback(
    (index: number, text: string, advance: boolean) => {
      commitSegmentValue(index, Number.parseInt(text, 10));
      typingRef.current = null;
      clearTypingTimeout();
      if (advance) {
        focusSegment(index + 1);
      }
    },
    [commitSegmentValue, clearTypingTimeout, focusSegment]
  );

  const handleDigit = useCallback(
    (index: number, digit: string) => {
      const isLast = index === sortedUnits.length - 1;
      const { current } = typingRef;
      clearTypingTimeout();

      if (current && current.index === index && current.text.length === 1) {
        commitTyped(index, current.text + digit, !isLast);
        return;
      }

      typingRef.current = { index, text: digit };
      commitSegmentValue(index, Number.parseInt(digit, 10));
      typingTimeoutRef.current = setTimeout(() => {
        commitTyped(index, digit, !isLast);
      }, TYPE_BUFFER_TIMEOUT_MS);
    },
    [sortedUnits, clearTypingTimeout, commitTyped, commitSegmentValue]
  );

  const handleSegmentKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>, index: number) => {
      if (disabled) {
        return;
      }
      const unit = sortedUnits[index];
      const divisor = UNIT_DIVISOR[unit];
      const multiplier = event.shiftKey ? SHIFT_MULTIPLIER : 1;

      if (DIGIT_KEY_PATTERN.test(event.key)) {
        event.preventDefault();
        handleDigit(index, event.key);
        return;
      }

      switch (event.key) {
        case "ArrowUp":
          event.preventDefault();
          setTotal(value + step * multiplier * divisor);
          break;
        case "ArrowDown":
          event.preventDefault();
          setTotal(value - step * multiplier * divisor);
          break;
        case "PageUp":
          event.preventDefault();
          setTotal(value + step * PAGE_STEP_MULTIPLIER * divisor);
          break;
        case "PageDown":
          event.preventDefault();
          setTotal(value - step * PAGE_STEP_MULTIPLIER * divisor);
          break;
        case "Home":
          event.preventDefault();
          commitSegmentValue(index, 0);
          break;
        case "End":
          event.preventDefault();
          commitSegmentValue(index, getSegmentMax(index, sortedUnits, max));
          break;
        case "ArrowRight":
          event.preventDefault();
          focusSegment(index + 1);
          break;
        case "ArrowLeft":
          event.preventDefault();
          focusSegment(index - 1);
          break;
        default:
          break;
      }
    },
    [
      disabled,
      sortedUnits,
      step,
      value,
      max,
      setTotal,
      commitSegmentValue,
      focusSegment,
      handleDigit,
    ]
  );

  const handleSegmentBlur = useCallback(
    (index: number) => {
      if (typingRef.current?.index === index) {
        clearTypingTimeout();
        typingRef.current = null;
      }
    },
    [clearTypingTimeout]
  );

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>, index: number) => {
      if (!scrub || disabled) {
        return;
      }
      event.currentTarget.setPointerCapture(event.pointerId);
      dragStateRef.current = {
        index,
        startValue: value,
        startX: event.clientX,
      };
      setDraggingIndex(index);
    },
    [scrub, disabled, value]
  );

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const drag = dragStateRef.current;
      if (!drag) {
        return;
      }
      const divisor = UNIT_DIVISOR[sortedUnits[drag.index]];
      const deltaSteps = Math.round(
        (event.clientX - drag.startX) / PX_PER_DRAG_STEP
      );
      setTotal(drag.startValue + deltaSteps * step * divisor);
    },
    [sortedUnits, step, setTotal]
  );

  const handlePointerUp = useCallback(() => {
    dragStateRef.current = null;
    setDraggingIndex(null);
  }, []);

  return (
    <div className={cn("inline-flex flex-col gap-1.5", className)}>
      {label ? (
        <span
          className="font-medium text-muted-foreground text-xs"
          id={labelId}
        >
          {label}
        </span>
      ) : null}
      <div
        aria-label={label ? undefined : "Duration"}
        aria-labelledby={label ? labelId : undefined}
        className={cn(
          "inline-flex items-center gap-0.5 rounded-lg border border-border bg-muted/40 px-2 py-1.5",
          disabled && "opacity-50"
        )}
        role="group"
      >
        {sortedUnits.map((unit, index) => {
          const text = PAD_FORMATTER.format(values[index]);
          const isDragging = draggingIndex === index;
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: segments are stable per unit
            <span className="flex items-center" key={unit}>
              {index > 0 && (
                <span aria-hidden="true" className="mx-0.5 text-foreground/40">
                  :
                </span>
              )}
              <div
                aria-disabled={disabled || undefined}
                aria-label={UNIT_LABEL[unit]}
                aria-valuemax={getSegmentMax(index, sortedUnits, max)}
                aria-valuemin={0}
                aria-valuenow={values[index]}
                aria-valuetext={pluralize(values[index], unit)}
                className={cn(
                  "relative flex select-none items-center justify-center rounded-md px-1 py-0.5 font-medium text-foreground tabular-nums outline-none",
                  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  scrub && !disabled && "cursor-ew-resize",
                  disabled && "pointer-events-none",
                  isDragging && "bg-foreground/10"
                )}
                onBlur={() => handleSegmentBlur(index)}
                onKeyDown={(event) => handleSegmentKeyDown(event, index)}
                onPointerDown={(event) => handlePointerDown(event, index)}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                ref={(el) => {
                  segmentRefs.current[index] = el;
                }}
                role="spinbutton"
                style={{ fontSize: 18, touchAction: "none" }}
                tabIndex={disabled ? -1 : 0}
              >
                {text.split("").map((char, charIndex) => (
                  <AnimatedDigit
                    char={char}
                    // biome-ignore lint/suspicious/noArrayIndexKey: digit position within a segment is stable
                    key={charIndex}
                    reduceMotion={Boolean(shouldReduceMotion)}
                  />
                ))}
              </div>
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default DurationPicker;
