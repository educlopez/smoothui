"use client";

import { cn } from "@repo/smoothui-utils";
import { motion, useReducedMotion } from "motion/react";
import { Progress as ProgressPrimitive } from "radix-ui";
import {
  type ComponentProps,
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useId,
  useState,
} from "react";
import { EASE_IN_OUT, SPRING_DEFAULT } from "../../lib/animation";

export type ProgressSize = "sm" | "md" | "lg";

export interface ProgressProps {
  /** Accessible name when there is no visible `label` */
  "aria-label"?: string;
  /** Optional CSS class for the root */
  className?: string;
  /** Visible label rendered above the track */
  label?: string;
  /** Maximum value (default 100) */
  max?: number;
  /** Minimum value (default 0) */
  min?: number;
  /** Show the formatted value next to the label */
  showValue?: boolean;
  /** Track height: `sm`, `md` (default) or `lg` */
  size?: ProgressSize;
  /** Current value. Pass `null` for an indeterminate bar. */
  value: number | null;
}

export interface ProgressRootProps
  extends Omit<ComponentProps<"div">, "children"> {
  children?: ReactNode;
  /** Maximum value (default 100) */
  max?: number;
  /** Minimum value (default 0) */
  min?: number;
  /** Current value. Pass `null` for an indeterminate bar. */
  value: number | null;
}
export type ProgressTrackProps = Omit<
  ComponentProps<typeof ProgressPrimitive.Root>,
  "max" | "value"
> & { size?: ProgressSize };
export type ProgressIndicatorProps = Omit<
  ComponentProps<typeof ProgressPrimitive.Indicator>,
  "asChild" | "children"
> & { className?: string };
export type ProgressLabelProps = ComponentProps<"span">;
export type ProgressValueProps = Omit<ComponentProps<"span">, "children"> & {
  children?: ReactNode | ((formattedValue: string) => ReactNode);
};

const TRACK_SIZE: Record<ProgressSize, string> = {
  lg: "h-3",
  md: "h-2",
  sm: "h-1",
};

const INDETERMINATE_WIDTH = "40%";
const INDETERMINATE_DURATION = 1.4;
const FULL_PERCENT = 100;

/** Normalized 0–100 percentage, or `null` when indeterminate. */
const toPercent = (value: number | null, min: number, max: number) => {
  if (value === null || max <= min) {
    return null;
  }
  const ratio = ((value - min) / (max - min)) * FULL_PERCENT;
  return Math.min(FULL_PERCENT, Math.max(0, ratio));
};

interface ProgressContextValue {
  hasLabel: boolean;
  labelId: string;
  max: number;
  min: number;
  percent: number | null;
  setHasLabel: (hasLabel: boolean) => void;
  value: number | null;
}

const ProgressContext = createContext<ProgressContextValue>({
  hasLabel: false,
  labelId: "",
  max: FULL_PERCENT,
  min: 0,
  percent: null,
  setHasLabel: () => undefined,
  value: null,
});

/**
 * Progress root — groups label, value, and track.
 */
export const ProgressRoot = ({
  className,
  max = FULL_PERCENT,
  min = 0,
  value,
  ...props
}: ProgressRootProps) => {
  const labelId = useId();
  const [hasLabel, setHasLabel] = useState(false);

  return (
    <ProgressContext.Provider
      value={{
        hasLabel,
        labelId,
        max,
        min,
        percent: toPercent(value, min, max),
        setHasLabel,
        value,
      }}
    >
      <div
        className={cn("flex w-full min-w-0 flex-col gap-2", className)}
        data-slot="progress"
        {...props}
      />
    </ProgressContext.Provider>
  );
};

/** Radix Progress root — carries `role="progressbar"` and value semantics. */
export const ProgressTrack = ({
  className,
  size = "md",
  ...props
}: ProgressTrackProps) => {
  const { hasLabel, labelId, max, min, value } = useContext(ProgressContext);
  // Radix measures 0..max; shift so `min` maps to 0.
  const shifted = value === null ? null : value - min;

  return (
    <ProgressPrimitive.Root
      aria-labelledby={hasLabel ? labelId : undefined}
      className={cn(
        "relative w-full min-w-0 overflow-hidden rounded-full bg-foreground/40",
        TRACK_SIZE[size],
        className
      )}
      data-slot="progress-track"
      max={max - min}
      value={shifted}
      {...props}
    />
  );
};

/**
 * Animated fill. Determinate: full-width bar clipped via `translateX` so
 * rounded caps stay circular. Indeterminate: a sliding bar. Both are
 * transform-only; reduced motion is instant / static.
 */
export const ProgressIndicator = ({
  className,
  ...props
}: ProgressIndicatorProps) => {
  const { percent } = useContext(ProgressContext);
  const shouldReduceMotion = useReducedMotion();
  const isIndeterminate = percent === null;

  let animate: { opacity?: number; transform: string | string[] };
  let initial: { opacity?: number; transform: string } | false = false;
  let transition: object = SPRING_DEFAULT;

  if (isIndeterminate) {
    if (shouldReduceMotion) {
      animate = { opacity: 0.4, transform: "translateX(0%)" };
      initial = { opacity: 0.4, transform: "translateX(0%)" };
      transition = { duration: 0 };
    } else {
      animate = { transform: ["translateX(-100%)", "translateX(250%)"] };
      initial = { transform: "translateX(-100%)" };
      transition = {
        duration: INDETERMINATE_DURATION,
        ease: EASE_IN_OUT,
        repeat: Number.POSITIVE_INFINITY,
      };
    }
  } else {
    animate = {
      transform: `translateX(${(percent ?? 0) - FULL_PERCENT}%)`,
    };
    if (shouldReduceMotion) {
      transition = { duration: 0 };
    }
  }

  return (
    <ProgressPrimitive.Indicator asChild data-slot="progress-indicator">
      <motion.div
        animate={animate}
        className={cn("block h-full rounded-full bg-brand", className)}
        initial={initial}
        style={{
          width: isIndeterminate
            ? shouldReduceMotion
              ? "100%"
              : INDETERMINATE_WIDTH
            : "100%",
        }}
        transition={transition}
        {...(props as object)}
      />
    </ProgressPrimitive.Indicator>
  );
};

export const ProgressLabel = ({ className, ...props }: ProgressLabelProps) => {
  const { labelId, setHasLabel } = useContext(ProgressContext);

  useEffect(() => {
    setHasLabel(true);
    return () => setHasLabel(false);
  }, [setHasLabel]);

  return (
    <span
      className={cn("font-medium text-sm leading-none", className)}
      data-slot="progress-label"
      id={labelId}
      {...props}
    />
  );
};

export const ProgressValue = ({
  children,
  className,
  ...props
}: ProgressValueProps) => {
  const { percent } = useContext(ProgressContext);
  const formatted = percent === null ? "" : `${Math.round(percent)}%`;

  return (
    <span
      className={cn("text-muted-foreground text-sm tabular-nums", className)}
      data-slot="progress-value"
      {...props}
    >
      {typeof children === "function"
        ? children(formatted)
        : (children ?? formatted)}
    </span>
  );
};

/**
 * SmoothUI Progress — Radix twin.
 * Same public props as the Base UI twin; headless via `radix-ui` Progress.
 */
export default function Progress({
  "aria-label": ariaLabel,
  className,
  label,
  max,
  min,
  showValue = false,
  size = "md",
  value,
}: ProgressProps) {
  const hasHeader = Boolean(label) || (showValue && value !== null);

  return (
    <ProgressRoot className={className} max={max} min={min} value={value}>
      {hasHeader ? (
        <div className="flex items-center justify-between gap-2">
          {label ? <ProgressLabel>{label}</ProgressLabel> : <span />}
          {showValue && value !== null ? <ProgressValue /> : null}
        </div>
      ) : null}
      <ProgressTrack aria-label={label ? undefined : ariaLabel} size={size}>
        <ProgressIndicator />
      </ProgressTrack>
    </ProgressRoot>
  );
}
