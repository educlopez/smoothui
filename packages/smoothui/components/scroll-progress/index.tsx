"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import {
  type MotionValue,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { type CSSProperties, type RefObject, useState } from "react";

const SPRING_CONFIG = { damping: 30, mass: 0.4, stiffness: 220 } as const;
const SEGMENT_SPRING = { bounce: 0.1, duration: 0.25 } as const;
const DEFAULT_RING_SIZE_PX = 56;
const DEFAULT_SEGMENTS = 8;
const SEGMENT_WIDTH_PX = 18;
const PERCENT_MULTIPLIER = 100;
const MIN_PERCENT = 0;
const MAX_PERCENT = 100;
const DEFAULT_THICKNESS = 4;
const TRACK_MIN_THICKNESS = 2;
/** Width of the brightened leading edge baked into the bar's own gradient. */
const LEADING_EDGE_STOP = "2.25rem";
/** Ring label font size as a fraction of the ring diameter. */
const RING_LABEL_SIZE_RATIO = 0.28;
/**
 * Digits carry no descender, so a numeral block centred on its line box reads
 * a hair low against a geometric centre like a ring. Nudging it up by a
 * fraction of an em restores the optical centre. Kept in em so it tracks the
 * figure size at any ring diameter.
 */
const NUMERAL_OPTICAL_LIFT = "-0.028em";

export type ScrollProgressVariant = "bar" | "ring" | "number" | "segments";
export type ScrollProgressPosition =
  | "top"
  | "bottom"
  | "fixed-corner"
  | "inline";

export interface ScrollProgressProps {
  className?: string;
  color?: string;
  /** Ref to a scrollable ancestor whose own scroll is measured instead of the window. */
  container?: RefObject<HTMLElement | null>;
  /**
   * Uses `position: sticky` (not `fixed`) so the indicator stays contained
   * within its scrollable ancestor instead of escaping to the viewport.
   * `inline` opts out of stickiness entirely — use it when you place the
   * indicator in your own header or footer bar.
   */
  position?: ScrollProgressPosition;
  /** Number of segments for the "segments" variant. */
  segments?: number;
  showLabel?: boolean;
  /** Diameter (px) of the "ring" variant. */
  size?: number;
  /** Spring-smooth the value. Ignored (always direct) when reduced motion is preferred. */
  smooth?: boolean;
  /** Bar height, ring/segment stroke width, in pixels. */
  thickness?: number;
  variant?: ScrollProgressVariant;
}

const POSITION_CLASSES: Record<ScrollProgressPosition, string> = {
  bottom: "sticky inset-x-0 bottom-0 z-40",
  "fixed-corner": "sticky inset-x-0 bottom-4 z-40 flex justify-end pr-4",
  inline: "relative",
  top: "sticky inset-x-0 top-0 z-40",
};

const clampPercent = (value: number) =>
  Math.min(MAX_PERCENT, Math.max(MIN_PERCENT, value));

const clampUnit = (value: number) => Math.min(1, Math.max(0, value));

interface PercentFigureProps {
  className?: string;
  /** Applied to the digits only, so the unit can stay muted beside them. */
  digitColor?: string;
  percent: number;
  style?: CSSProperties;
}

/**
 * The digits and the `%` are one typographic unit, not two stacked spans:
 * shared baseline, tabular figures so the block never reflows as it counts,
 * and a unit sized as a deliberate fraction of the figures rather than an
 * arbitrary small size.
 */
const PercentFigure = ({
  percent,
  digitColor,
  className,
  style,
}: PercentFigureProps) => (
  <span
    className={cn(
      "inline-flex items-baseline font-semibold leading-none tracking-tight",
      className
    )}
    style={style}
  >
    <span
      className="tabular-nums"
      style={digitColor ? { color: digitColor } : undefined}
    >
      {percent}
    </span>
    <span className="ml-[0.06em] font-medium text-[0.56em] text-muted-foreground leading-none">
      %
    </span>
  </span>
);

interface SegmentDashProps {
  color: string;
  index: number;
  segments: number;
  thickness: number;
  value: MotionValue<number>;
}

const SegmentDash = ({
  value,
  index,
  segments,
  thickness,
  color,
}: SegmentDashProps) => {
  const shouldReduceMotion = useReducedMotion();
  // Each pill owns one 1/segments slice of the range, so they fill strictly
  // one after another instead of all easing together.
  const fill = useTransform(value, (progress) =>
    clampUnit(progress * segments - index)
  );
  const springFill = useSpring(fill, SEGMENT_SPRING);

  return (
    <span
      className="relative block shrink-0 overflow-hidden rounded-full bg-foreground/12"
      style={{ height: thickness, width: SEGMENT_WIDTH_PX }}
    >
      <motion.span
        className="absolute inset-0 origin-left rounded-full"
        style={{
          backgroundColor: color,
          scaleX: shouldReduceMotion ? fill : springFill,
        }}
      />
    </span>
  );
};

export default function ScrollProgress({
  variant = "bar",
  position = "top",
  container,
  thickness = DEFAULT_THICKNESS,
  color = "var(--color-brand)",
  showLabel = false,
  segments = DEFAULT_SEGMENTS,
  size = DEFAULT_RING_SIZE_PX,
  smooth = true,
  className,
}: ScrollProgressProps) {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ container });
  const springValue = useSpring(scrollYProgress, SPRING_CONFIG);
  const value = shouldReduceMotion || !smooth ? scrollYProgress : springValue;

  const [percent, setPercent] = useState(0);
  useMotionValueEvent(value, "change", (latest) => {
    setPercent(Math.round(clampPercent(latest * PERCENT_MULTIPLIER)));
  });

  // The fill is full-width and slides in from the left instead of being
  // scaled: a translate leaves the gradient and the rounded cap undistorted,
  // so the leading edge is literally the end of the bar and can never drift
  // away from it the way a separately positioned glow could.
  const fillX = useTransform(
    value,
    (latest) => `${-PERCENT_MULTIPLIER * (1 - clampUnit(latest))}%`
  );

  const ariaProps = {
    "aria-label": "Reading progress",
    "aria-valuemax": MAX_PERCENT,
    "aria-valuemin": MIN_PERCENT,
    "aria-valuenow": percent,
    role: "progressbar" as const,
  };

  if (variant === "bar") {
    return (
      <div
        {...ariaProps}
        className={cn(POSITION_CLASSES[position], "w-full", className)}
      >
        <div
          className="w-full overflow-hidden rounded-full bg-foreground/12"
          style={{ height: Math.max(thickness, TRACK_MIN_THICKNESS) }}
        >
          <motion.div
            className="h-full w-full rounded-full"
            style={{
              backgroundImage: `linear-gradient(90deg, ${color} 0%, ${color} calc(100% - ${LEADING_EDGE_STOP}), color-mix(in oklab, ${color} 40%, white) 100%)`,
              x: fillX,
            }}
          />
        </div>
        {showLabel ? (
          <span className="sr-only">{`${percent}% read`}</span>
        ) : null}
      </div>
    );
  }

  if (variant === "ring") {
    const ringRadius = (size - thickness) / 2;

    return (
      <div
        {...ariaProps}
        className={cn(
          POSITION_CLASSES[position],
          "inline-flex shrink-0 items-center justify-center",
          className
        )}
      >
        <svg
          aria-hidden="true"
          className="-rotate-90"
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          width={size}
        >
          <circle
            className="text-foreground/12"
            cx={size / 2}
            cy={size / 2}
            fill="none"
            r={ringRadius}
            stroke="currentColor"
            strokeWidth={thickness}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            fill="none"
            pathLength={1}
            r={ringRadius}
            stroke={color}
            strokeLinecap="round"
            strokeWidth={thickness}
            style={{ pathLength: value }}
          />
        </svg>
        {showLabel ? (
          // The figure block is centred as one unit inside the ring, then
          // lifted by the optical correction — geometric centring alone leaves
          // a descender-less numeral sitting low.
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <PercentFigure
              className="text-foreground"
              percent={percent}
              style={{
                // `em` here resolves against the figure's own size, so the
                // correction scales with the ring.
                fontSize: size * RING_LABEL_SIZE_RATIO,
                transform: `translateY(${NUMERAL_OPTICAL_LIFT})`,
              }}
            />
          </span>
        ) : null}
      </div>
    );
  }

  if (variant === "number") {
    return (
      <div
        {...ariaProps}
        className={cn(
          POSITION_CLASSES[position],
          // Size lives on the root so a consumer's `text-*` class wins over it
          // and scales the figures with it.
          "inline-flex shrink-0 items-baseline text-4xl leading-none",
          className
        )}
      >
        <PercentFigure digitColor={color} percent={percent} />
        {showLabel ? (
          // Sits further from the figure than the `%` does, so the unit reads
          // as part of the number and the word reads as a separate label.
          <span className="ml-[0.9em] font-medium text-[0.3em] text-muted-foreground uppercase leading-none tracking-[0.08em]">
            read
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <div
      {...ariaProps}
      className={cn(
        POSITION_CLASSES[position],
        "flex items-center gap-1.5",
        className
      )}
    >
      {Array.from({ length: segments }, (_, index) => (
        <SegmentDash
          color={color}
          index={index}
          key={`scroll-progress-segment-${index}`}
          segments={segments}
          thickness={thickness}
          value={value}
        />
      ))}
      {showLabel ? (
        // Fixed measure + tabular figures: the row must not shuffle sideways
        // every time the count gains a digit.
        <span className="ml-2 w-[3.25ch] text-right font-medium text-muted-foreground text-xs tabular-nums">
          {percent}%
        </span>
      ) : null}
    </div>
  );
}
