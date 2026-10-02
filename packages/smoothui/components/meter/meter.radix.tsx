"use client";

import { cn } from "@repo/smoothui-utils";
import { useReducedMotion } from "motion/react";
import {
  type ComponentProps,
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";

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

const FULL_PERCENT = 100;

const TRACK_SIZE: Record<MeterSize, string> = {
  lg: "h-3",
  md: "h-2",
  sm: "h-1",
};

const toPercent = (value: number, min: number, max: number) => {
  if (max <= min) {
    return 0;
  }
  const ratio = ((value - min) / (max - min)) * FULL_PERCENT;
  return Math.min(FULL_PERCENT, Math.max(0, ratio));
};

interface MeterContextValue {
  formattedValue: string;
  labelId: string;
  max: number;
  min: number;
  percent: number;
  setHasLabel: (hasLabel: boolean) => void;
  value: number;
}

const MeterContext = createContext<MeterContextValue>({
  formattedValue: "0%",
  labelId: "",
  max: FULL_PERCENT,
  min: 0,
  percent: 0,
  setHasLabel: () => undefined,
  value: 0,
});

export interface MeterRootProps
  extends Omit<ComponentProps<"div">, "children"> {
  children?: ReactNode;
  max?: number;
  min?: number;
  value: number;
}

export type MeterTrackProps = ComponentProps<"div"> & { size?: MeterSize };
export type MeterIndicatorProps = ComponentProps<"div">;
export type MeterLabelProps = ComponentProps<"span">;
export type MeterValueProps = Omit<ComponentProps<"span">, "children"> & {
  children?: ReactNode | ((formattedValue: string, value: number) => ReactNode);
};

/**
 * Radix has no Meter primitive — this twin mirrors Base UI semantics with
 * `role="meter"` so both styles share the same SmoothUI props.
 */
export const MeterRoot = ({
  children,
  className,
  max = FULL_PERCENT,
  min = 0,
  value,
  ...props
}: MeterRootProps) => {
  const labelId = useId();
  const [hasLabel, setHasLabel] = useState(false);
  const percent = toPercent(value, min, max);
  const formattedValue = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        maximumFractionDigits: 0,
        style: "percent",
      }).format(percent / FULL_PERCENT),
    [percent]
  );
  const clampedValue = Math.min(max, Math.max(min, value));

  const contextValue = useMemo(
    () => ({
      formattedValue,
      labelId,
      max,
      min,
      percent,
      setHasLabel,
      value: clampedValue,
    }),
    [clampedValue, formattedValue, labelId, max, min, percent]
  );

  return (
    <MeterContext.Provider value={contextValue}>
      {/* Native <meter> is inconsistently styled across browsers — match Base UI. */}
      {/* biome-ignore lint/a11y/useSemanticElements: intentional ARIA meter twin */}
      <div
        aria-labelledby={hasLabel ? labelId : undefined}
        aria-valuemax={max}
        aria-valuemin={min}
        aria-valuenow={clampedValue}
        aria-valuetext={formattedValue}
        className={cn("flex w-full min-w-0 flex-col gap-2", className)}
        data-slot="meter"
        role="meter"
        {...props}
      >
        {children}
      </div>
    </MeterContext.Provider>
  );
};

export const MeterTrack = ({
  className,
  size = "md",
  ...props
}: MeterTrackProps) => (
  <div
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
  style,
  ...props
}: MeterIndicatorProps) => {
  const { percent } = useContext(MeterContext);
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className={cn(
        "block h-full rounded-full bg-brand",
        shouldReduceMotion
          ? null
          : "transition-[width] duration-[250ms] ease-out motion-reduce:transition-none",
        className
      )}
      data-slot="meter-indicator"
      style={{ ...style, width: `${percent}%` }}
      {...props}
    />
  );
};

export const MeterLabel = ({
  className,
  children,
  ...props
}: MeterLabelProps) => {
  const { labelId, setHasLabel } = useContext(MeterContext);

  useEffect(() => {
    setHasLabel(true);
    return () => setHasLabel(false);
  }, [setHasLabel]);

  return (
    <span
      className={cn("font-medium text-sm leading-none", className)}
      data-slot="meter-label"
      id={labelId}
      {...props}
    >
      {children}
    </span>
  );
};

export const MeterValue = ({
  children,
  className,
  ...props
}: MeterValueProps) => {
  const { formattedValue, value } = useContext(MeterContext);
  const content =
    typeof children === "function"
      ? children(formattedValue, value)
      : (children ?? formattedValue);

  return (
    <span
      className={cn("text-muted-foreground text-sm tabular-nums", className)}
      data-slot="meter-value"
      {...props}
    >
      {content}
    </span>
  );
};

/**
 * SmoothUI Meter — Radix-parity twin (no Radix Meter primitive).
 * Same public props as the Base UI twin.
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
