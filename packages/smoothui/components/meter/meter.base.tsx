"use client";

import { Meter as MeterPrimitive } from "@base-ui/react/meter";
import { cn } from "@repo/smoothui-utils";
import { useReducedMotion } from "motion/react";
import type { ComponentProps } from "react";

export type MeterSize = "sm" | "md" | "lg";

export interface MeterProps {
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
  size?: MeterSize;
  /** Current value within the range */
  value: number;
}

export type MeterRootProps = Omit<
  ComponentProps<typeof MeterPrimitive.Root>,
  "className"
> & { className?: string };
export type MeterTrackProps = Omit<
  ComponentProps<typeof MeterPrimitive.Track>,
  "className"
> & { className?: string; size?: MeterSize };
export type MeterIndicatorProps = Omit<
  ComponentProps<typeof MeterPrimitive.Indicator>,
  "className"
> & { className?: string };
export type MeterLabelProps = Omit<
  ComponentProps<typeof MeterPrimitive.Label>,
  "className"
> & { className?: string };
export type MeterValueProps = Omit<
  ComponentProps<typeof MeterPrimitive.Value>,
  "className"
> & { className?: string };

const TRACK_SIZE: Record<MeterSize, string> = {
  lg: "h-3",
  md: "h-2",
  sm: "h-1",
};

export const MeterRoot = ({ className, ...props }: MeterRootProps) => (
  <MeterPrimitive.Root
    className={cn("flex w-full min-w-0 flex-col gap-2", className)}
    data-slot="meter"
    {...props}
  />
);

export const MeterTrack = ({
  className,
  size = "md",
  ...props
}: MeterTrackProps) => (
  <MeterPrimitive.Track
    className={cn(
      "relative w-full min-w-0 overflow-hidden rounded-full bg-foreground/40",
      TRACK_SIZE[size],
      className
    )}
    data-slot="meter-track"
    {...props}
  />
);

export const MeterIndicator = ({
  className,
  ...props
}: MeterIndicatorProps) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <MeterPrimitive.Indicator
      className={cn(
        "block h-full rounded-full bg-brand",
        shouldReduceMotion
          ? null
          : "transition-[width] duration-[250ms] ease-out motion-reduce:transition-none",
        className
      )}
      data-slot="meter-indicator"
      {...props}
    />
  );
};

export const MeterLabel = ({ className, ...props }: MeterLabelProps) => (
  <MeterPrimitive.Label
    className={cn("font-medium text-sm leading-none", className)}
    data-slot="meter-label"
    {...props}
  />
);

export const MeterValue = ({ className, ...props }: MeterValueProps) => (
  <MeterPrimitive.Value
    className={cn("text-muted-foreground text-sm tabular-nums", className)}
    data-slot="meter-value"
    {...props}
  />
);

/**
 * SmoothUI Meter — Base UI twin (default).
 * Convenience API for capacity / gauge values; use compounds for custom layouts.
 */
export default function Meter({
  "aria-label": ariaLabel,
  className,
  label,
  max,
  min,
  showValue = false,
  size = "md",
  value,
}: MeterProps) {
  const hasHeader = Boolean(label) || showValue;

  return (
    <MeterRoot
      aria-label={label ? undefined : ariaLabel}
      className={className}
      max={max}
      min={min}
      value={value}
    >
      {hasHeader ? (
        <div className="flex items-center justify-between gap-2">
          {label ? <MeterLabel>{label}</MeterLabel> : <span />}
          {showValue ? <MeterValue /> : null}
        </div>
      ) : null}
      <MeterTrack size={size}>
        <MeterIndicator />
      </MeterTrack>
    </MeterRoot>
  );
}
