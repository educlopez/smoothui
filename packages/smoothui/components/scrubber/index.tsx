"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

export interface ScrubberProps {
  /** Label displayed on the left side of the track */
  label?: string;
  /** Controlled value */
  value?: number;
  /** Default value for uncontrolled usage */
  defaultValue?: number;
  /** Called when value changes during interaction */
  onValueChange?: (value: number) => void;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step increment */
  step?: number;
  /** Number of decimal places to display */
  decimals?: number;
  /** Number of tick marks (0 to hide) */
  ticks?: number;
  /** Additional CSS classes */
  className?: string;
}

const clamp = (val: number, min: number, max: number) =>
  Math.min(Math.max(val, min), max);

const roundToStep = (val: number, step: number, min: number) =>
  Math.round((val - min) / step) * step + min;

const Scrubber = ({
  label = "Value",
  value: controlledValue,
  defaultValue = 0,
  onValueChange,
  min = 0,
  max = 1,
  step = 0.01,
  decimals = 2,
  ticks = 9,
  className,
}: ScrubberProps) => {
  const shouldReduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isHoverDevice, setIsHoverDevice] = useState(false);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;
  const range = max - min;
  const percentage = range > 0 ? ((value - min) / range) * 100 : 0;
  const isActive = isDragging || (isHoverDevice && isHovering);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setIsHoverDevice(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsHoverDevice(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const setValue = useCallback(
    (newValue: number) => {
      const clamped = clamp(roundToStep(newValue, step, min), min, max);
      if (!isControlled) setInternalValue(clamped);
      onValueChange?.(clamped);
    },
    [step, min, max, isControlled, onValueChange]
  );

  const getValueFromPointer = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return value;
      const rect = track.getBoundingClientRect();
      const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
      return min + ratio * range;
    },
    [min, range, value]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      trackRef.current?.setPointerCapture(e.pointerId);
      setIsDragging(true);
      setValue(getValueFromPointer(e.clientX));
    },
    [getValueFromPointer, setValue]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      setValue(getValueFromPointer(e.clientX));
    },
    [isDragging, getValueFromPointer, setValue]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      let next: number | undefined;
      switch (e.key) {
        case "ArrowRight":
        case "ArrowUp":
          next = value + step;
          break;
        case "ArrowLeft":
        case "ArrowDown":
          next = value - step;
          break;
        case "Home":
          next = min;
          break;
        case "End":
          next = max;
          break;
        default:
          return;
      }
      e.preventDefault();
      setValue(next);
    },
    [value, step, min, max, setValue]
  );

  const springConfig = shouldReduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, duration: 0.25, bounce: 0.1 };

  return (
    <div className={cn("relative w-full select-none", className)}>
      <div
        aria-label={label}
        aria-valuemax={max}
        aria-valuemin={min}
        aria-valuenow={Number(value.toFixed(decimals))}
        className="relative cursor-pointer overflow-hidden bg-muted outline-offset-2"
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        ref={trackRef}
        role="slider"
        style={{
          height: 52,
          borderRadius: 12,
          touchAction: "none",
        }}
        tabIndex={0}
      >
        {/* Fill indicator */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 bg-foreground/14"
          style={{
            borderRadius: 12,
            width: `${percentage}%`,
            transition: isDragging
              ? "none"
              : "width 150ms cubic-bezier(0.23, 1, 0.32, 1)",
          }}
        />

        {/* Tick marks */}
        {ticks > 0 && (
          <div className="pointer-events-none absolute inset-0">
            {Array.from({ length: ticks }, (_, i) => {
              const pos = ((i + 1) / (ticks + 1)) * 100;
              return (
                <div
                  className="absolute top-1/2 bg-foreground/25"
                  key={pos}
                  style={{
                    left: `${pos}%`,
                    width: 1,
                    height: 8,
                    borderRadius: 999,
                    transform: "translateX(-50%) translateY(-50%)",
                  }}
                />
              );
            })}
          </div>
        )}

        {/* Scrub bar (capsule thumb) */}
        <div
          className="pointer-events-none absolute"
          style={{
            top: "50%",
            left: `${percentage}%`,
            transform: "translateX(-50%) translateY(-50%)",
            marginLeft: -6,
            zIndex: 3,
            transition: isDragging
              ? "none"
              : "left 150ms cubic-bezier(0.23, 1, 0.32, 1)",
          }}
        >
          <motion.div
            animate={{
              opacity: isActive ? 0.8 : 0.15,
              scaleX: isActive ? 1 : 0.7,
              scaleY: isActive ? 1 : 0.7,
            }}
            className="bg-foreground/90"
            style={{
              width: 5,
              height: 34,
              borderRadius: 999,
            }}
            transition={springConfig}
          />
        </div>

        {/* Label */}
        <div
          className="pointer-events-none absolute top-1/2 left-[18px] -translate-y-1/2 whitespace-nowrap text-foreground"
          style={{
            fontSize: 17,
            zIndex: 4,
          }}
        >
          {label}
        </div>

        {/* Value display */}
        <div
          className="pointer-events-none absolute top-1/2 right-[14px] -translate-y-1/2 text-foreground"
          style={{
            zIndex: 4,
            fontFamily: "ui-monospace, monospace",
            fontVariantNumeric: "tabular-nums",
            fontSize: 15,
            fontWeight: 500,
          }}
        >
          {value.toFixed(decimals)}
        </div>
      </div>
    </div>
  );
};

export default Scrubber;
