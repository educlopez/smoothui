"use client";

import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { cn } from "@repo/smoothui-utils";
import { motion, useReducedMotion } from "motion/react";
import type { ComponentProps } from "react";
import { PRESS_TRANSITION, SPRING_SNAPPY } from "../../lib/animation";

export type SliderRootProps = ComponentProps<typeof SliderPrimitive.Root> & {
  className?: string;
};

export type SliderControlProps = ComponentProps<
  typeof SliderPrimitive.Control
> & {
  className?: string;
};

export type SliderTrackProps = ComponentProps<typeof SliderPrimitive.Track> & {
  className?: string;
};

export type SliderIndicatorProps = ComponentProps<
  typeof SliderPrimitive.Indicator
> & {
  className?: string;
};

export type SliderThumbProps = ComponentProps<typeof SliderPrimitive.Thumb> & {
  className?: string;
};

/** Convenience single-thumb slider props */
export interface SliderProps {
  "aria-label"?: string;
  className?: string;
  defaultValue?: number;
  disabled?: boolean;
  max?: number;
  min?: number;
  onValueChange?: (value: number) => void;
  step?: number;
  value?: number;
}

const MotionThumb = motion.span;

/**
 * SmoothUI Slider — Base UI twin (default).
 * Compound parts + thin convenience default for single value.
 */
const SliderRoot = ({ className, ...props }: SliderRootProps) => (
  <SliderPrimitive.Root
    className={cn(
      // Group dims fill/thumb when disabled — avoid root opacity on a faint track
      "group/slider relative flex w-full touch-none select-none items-center",
      "data-disabled:cursor-not-allowed",
      className
    )}
    data-slot="slider"
    {...props}
  />
);

const SliderControl = ({ className, ...props }: SliderControlProps) => (
  <SliderPrimitive.Control
    className={cn("relative flex w-full items-center py-2.5", className)}
    data-slot="slider-control"
    {...props}
  />
);

const SliderTrack = ({ className, ...props }: SliderTrackProps) => (
  <SliderPrimitive.Track
    className={cn(
      // Track must read on transparent dark stages — `input` (15% fg) vanishes;
      // Prefer a stronger fg tint so empty track stays visible on frame-box.
      "relative h-1.5 w-full grow rounded-full bg-foreground/40 group-data-disabled/slider:bg-muted-foreground/55",
      className
    )}
    data-slot="slider-track"
    {...props}
  />
);

const SliderIndicator = ({ className, ...props }: SliderIndicatorProps) => (
  <SliderPrimitive.Indicator
    className={cn(
      "h-full rounded-full bg-brand group-data-disabled/slider:bg-muted-foreground",
      className
    )}
    data-slot="slider-indicator"
    {...props}
  />
);

const SliderThumb = ({ className, ...props }: SliderThumbProps) => {
  const shouldReduceMotion = useReducedMotion();
  return (
    <SliderPrimitive.Thumb
      className={cn("block outline-none", className)}
      data-slot="slider-thumb"
      render={
        <MotionThumb
          className={cn(
            // Solid fill so the thumb stays visible on dark preview surfaces
            "block size-4 rounded-full border-2 border-brand bg-white shadow-sm",
            // Focus lands on the hidden <input> child, not the thumb itself
            "has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/50",
            "data-disabled:pointer-events-none",
            // Never `bg-background` when disabled — matches dark frame-box and vanishes
            "group-data-disabled/slider:border-muted-foreground group-data-disabled/slider:bg-muted-foreground"
          )}
          transition={shouldReduceMotion ? { duration: 0 } : SPRING_SNAPPY}
          whileTap={
            shouldReduceMotion
              ? undefined
              : { scale: 1.12, transition: PRESS_TRANSITION }
          }
        />
      }
      {...props}
    />
  );
};

/** Thin convenience: single-value slider with Track + Indicator + Thumb. */
const Slider = ({
  "aria-label": ariaLabel,
  className,
  defaultValue = 50,
  disabled,
  max = 100,
  min = 0,
  onValueChange,
  step = 1,
  value,
}: SliderProps) => (
  <SliderRoot
    className={className}
    defaultValue={defaultValue}
    disabled={disabled}
    max={max}
    min={min}
    onValueChange={(next) => {
      if (typeof next === "number") {
        onValueChange?.(next);
      }
    }}
    step={step}
    value={value}
  >
    <SliderControl>
      <SliderTrack>
        <SliderIndicator />
        <SliderThumb aria-label={ariaLabel ?? "Value"} />
      </SliderTrack>
    </SliderControl>
  </SliderRoot>
);

export { SliderControl, SliderIndicator, SliderRoot, SliderThumb, SliderTrack };

export default Slider;
