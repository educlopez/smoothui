"use client";

import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
import { cn } from "@repo/smoothui-utils";
import { motion, useReducedMotion } from "motion/react";
import { type ComponentProps, createContext, useContext } from "react";
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

export type ProgressRootProps = Omit<
  ComponentProps<typeof ProgressPrimitive.Root>,
  "className"
> & { className?: string };
export type ProgressTrackProps = Omit<
  ComponentProps<typeof ProgressPrimitive.Track>,
  "className"
> & { className?: string; size?: ProgressSize };
export type ProgressIndicatorProps = Omit<
  ComponentProps<typeof ProgressPrimitive.Indicator>,
  "className" | "render"
> & { className?: string };
export type ProgressLabelProps = Omit<
  ComponentProps<typeof ProgressPrimitive.Label>,
  "className"
> & { className?: string };
export type ProgressValueProps = Omit<
  ComponentProps<typeof ProgressPrimitive.Value>,
  "className"
> & { className?: string };

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

const ProgressPercentContext = createContext<number | null>(null);

/**
 * Progress root — groups label, value, and track.
 * Renders `role="progressbar"` with value semantics from Base UI.
 */
export const ProgressRoot = ({
  className,
  max = FULL_PERCENT,
  min = 0,
  value,
  ...props
}: ProgressRootProps) => (
  <ProgressPercentContext.Provider value={toPercent(value, min, max)}>
    <ProgressPrimitive.Root
      className={cn("flex w-full min-w-0 flex-col gap-2", className)}
      data-slot="progress"
      max={max}
      min={min}
      value={value}
      {...props}
    />
  </ProgressPercentContext.Provider>
);

export const ProgressTrack = ({
  className,
  size = "md",
  ...props
}: ProgressTrackProps) => (
  <ProgressPrimitive.Track
    className={cn(
      "relative w-full min-w-0 overflow-hidden rounded-full bg-foreground/40",
      TRACK_SIZE[size],
      className
    )}
    data-slot="progress-track"
    {...props}
  />
);

/**
 * Animated fill. Determinate: full-width bar clipped via `translateX` so
 * rounded caps stay circular. Indeterminate: a sliding bar. Both are
 * transform-only; reduced motion is instant / static.
 */
export const ProgressIndicator = ({
  className,
  ...props
}: ProgressIndicatorProps) => {
  const percent = useContext(ProgressPercentContext);
  const shouldReduceMotion = useReducedMotion();
  const isIndeterminate = percent === null;

  let animate: { opacity?: number; transform: string | string[] };
  let initial: { opacity?: number; transform: string } | false = false;
  let transition: object = SPRING_DEFAULT;

  if (isIndeterminate) {
    if (shouldReduceMotion) {
      // Full bar at low opacity — a static 40%-wide bar reads as determinate
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
    // translateX keeps rounded ends; scaleX would squash them into ellipses
    animate = {
      transform: `translateX(${(percent ?? 0) - FULL_PERCENT}%)`,
    };
    if (shouldReduceMotion) {
      transition = { duration: 0 };
    }
  }

  return (
    <ProgressPrimitive.Indicator
      className={cn("block h-full rounded-full bg-brand", className)}
      data-slot="progress-indicator"
      render={
        <motion.div
          animate={animate}
          initial={initial}
          style={{
            width: isIndeterminate
              ? shouldReduceMotion
                ? "100%"
                : INDETERMINATE_WIDTH
              : "100%",
          }}
          transition={transition}
        />
      }
      {...props}
    />
  );
};

export const ProgressLabel = ({ className, ...props }: ProgressLabelProps) => (
  <ProgressPrimitive.Label
    className={cn("font-medium text-sm leading-none", className)}
    data-slot="progress-label"
    {...props}
  />
);

export const ProgressValue = ({ className, ...props }: ProgressValueProps) => (
  <ProgressPrimitive.Value
    className={cn("text-muted-foreground text-sm tabular-nums", className)}
    data-slot="progress-value"
    {...props}
  />
);

/**
 * SmoothUI Progress — Base UI twin (default).
 * Convenience API; use the compound parts for custom layouts.
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
    <ProgressRoot
      aria-label={label ? undefined : ariaLabel}
      className={className}
      max={max}
      min={min}
      value={value}
    >
      {hasHeader ? (
        <div className="flex items-center justify-between gap-2">
          {label ? <ProgressLabel>{label}</ProgressLabel> : <span />}
          {showValue && value !== null ? <ProgressValue /> : null}
        </div>
      ) : null}
      <ProgressTrack size={size}>
        <ProgressIndicator />
      </ProgressTrack>
    </ProgressRoot>
  );
}
