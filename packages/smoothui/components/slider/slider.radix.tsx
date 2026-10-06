"use client";

import { cn } from "@repo/smoothui-utils";
import { motion, useReducedMotion } from "motion/react";
import { Slider as SliderPrimitive } from "radix-ui";
import type { ComponentProps, ReactNode } from "react";
import { PRESS_TRANSITION, SPRING_SNAPPY } from "../../lib/animation";
import type { SliderProps } from "./slider.base";

export type SliderRootProps = ComponentProps<typeof SliderPrimitive.Root> & {
  className?: string;
  children?: ReactNode;
};

export type SliderControlProps = {
  className?: string;
  children?: ReactNode;
};

export type SliderTrackProps = ComponentProps<typeof SliderPrimitive.Track> & {
  className?: string;
  children?: ReactNode;
};

export type SliderIndicatorProps = ComponentProps<
  typeof SliderPrimitive.Range
> & {
  className?: string;
};

export type SliderThumbProps = ComponentProps<typeof SliderPrimitive.Thumb> & {
  className?: string;
};

export type { SliderProps } from "./slider.base";

const MotionThumb = motion.span;

/**
 * SmoothUI Slider — Radix twin.
 * Same public API as Base; Range maps to Indicator.
 */
const SliderRoot = ({ className, ...props }: SliderRootProps) => (
  <SliderPrimitive.Root
    className={cn(
      "group/slider relative flex w-full touch-none select-none items-center",
      "data-[disabled]:cursor-not-allowed",
      className
    )}
    data-slot="slider"
    {...props}
  />
);

const SliderControl = ({ className, children }: SliderControlProps) => (
  <div
    className={cn("relative flex w-full items-center py-2.5", className)}
    data-slot="slider-control"
  >
    {children}
  </div>
);

const SliderTrack = ({ className, ...props }: SliderTrackProps) => (
  <SliderPrimitive.Track
    className={cn(
      // No `overflow-hidden` (it clips the Thumb). `flex items-center` centers
      // Radix's absolutely-positioned thumb wrapper on the 6px track.
      "relative flex h-1.5 w-full grow items-center rounded-full bg-foreground/40 group-data-[disabled]/slider:bg-muted-foreground/55",
      className
    )}
    data-slot="slider-track"
    {...props}
  />
);

const SliderIndicator = ({ className, ...props }: SliderIndicatorProps) => (
  <SliderPrimitive.Range
    className={cn(
      "absolute h-full rounded-full bg-brand group-data-[disabled]/slider:bg-muted-foreground",
      className
    )}
    data-slot="slider-indicator"
    {...props}
  />
);

const SliderThumb = ({ className, ...props }: SliderThumbProps) => {
  const shouldReduceMotion = useReducedMotion();
  return (
    <SliderPrimitive.Thumb asChild {...props}>
      <MotionThumb
        className={cn(
          "block size-4 rounded-full border-2 border-brand bg-thumb shadow-sm outline-none",
          "focus-ring",
          "data-[disabled]:pointer-events-none",
          "group-data-[disabled]/slider:border-muted-foreground group-data-[disabled]/slider:bg-muted-foreground",
          className
        )}
        data-slot="slider-thumb"
        transition={shouldReduceMotion ? { duration: 0 } : SPRING_SNAPPY}
        whileTap={
          shouldReduceMotion
            ? undefined
            : { scale: 1.12, transition: PRESS_TRANSITION }
        }
      />
    </SliderPrimitive.Thumb>
  );
};

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
    defaultValue={defaultValue === undefined ? undefined : [defaultValue]}
    disabled={disabled}
    max={max}
    min={min}
    onValueChange={(next) => {
      const [first] = next;
      if (typeof first === "number") {
        onValueChange?.(first);
      }
    }}
    step={step}
    value={value === undefined ? undefined : [value]}
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
