"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import {
  motion,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import {
  type KeyboardEvent,
  type PointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export type ComparisonSliderProps = {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  initialPosition?: number;
  orientation?: "horizontal" | "vertical";
  showLabels?: boolean;
  dividerColor?: string;
  className?: string;
};

const KEYBOARD_STEP = 5;
const SPRING_CONFIG = { duration: 0.3, bounce: 0 };

export default function ComparisonSlider({
  beforeImage,
  afterImage,
  beforeLabel = "Before",
  afterLabel = "After",
  initialPosition = 50,
  orientation = "horizontal",
  showLabels = true,
  dividerColor = "white",
  className,
}: ComparisonSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const clampedInitial = Math.min(100, Math.max(0, initialPosition));
  const position = useSpring(
    shouldReduceMotion ? clampedInitial : 0,
    shouldReduceMotion ? { duration: 0 } : SPRING_CONFIG
  );

  const isHorizontal = orientation === "horizontal";

  // Create derived motion values using useTransform
  const clipPath = useTransform(position, (v) =>
    isHorizontal
      ? `inset(0 ${100 - v}% 0 0)`
      : `inset(0 0 ${100 - v}% 0)`
  );

  const dividerPosition = useTransform(position, (v) => `${v}%`);

  const beforeLabelOpacity = useTransform(position, (v) =>
    Math.min(1, v / 25)
  );

  const afterLabelOpacity = useTransform(position, (v) =>
    Math.min(1, (100 - v) / 25)
  );

  useEffect(() => {
    if (!hasAnimated && !shouldReduceMotion) {
      const timer = setTimeout(() => {
        position.set(clampedInitial);
        setHasAnimated(true);
      }, 100);
      return () => clearTimeout(timer);
    }
    if (shouldReduceMotion && !hasAnimated) {
      position.set(clampedInitial);
      setHasAnimated(true);
    }
  }, [hasAnimated, shouldReduceMotion, clampedInitial, position]);

  const calculatePosition = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return clampedInitial;

      const rect = containerRef.current.getBoundingClientRect();
      let newPosition: number;

      if (isHorizontal) {
        const x = clientX - rect.left;
        newPosition = (x / rect.width) * 100;
      } else {
        const y = clientY - rect.top;
        newPosition = (y / rect.height) * 100;
      }

      return Math.min(100, Math.max(0, newPosition));
    },
    [isHorizontal, clampedInitial]
  );

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
    const newPos = calculatePosition(event.clientX, event.clientY);
    position.set(newPos);
    (event.target as HTMLDivElement).setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const newPos = calculatePosition(event.clientX, event.clientY);
    position.set(newPos);
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    (event.target as HTMLDivElement).releasePointerCapture(event.pointerId);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const currentPos = position.get();
    let newPos = currentPos;

    if (isHorizontal) {
      if (event.key === "ArrowLeft") {
        newPos = Math.max(0, currentPos - KEYBOARD_STEP);
      } else if (event.key === "ArrowRight") {
        newPos = Math.min(100, currentPos + KEYBOARD_STEP);
      }
    } else {
      if (event.key === "ArrowUp") {
        newPos = Math.max(0, currentPos - KEYBOARD_STEP);
      } else if (event.key === "ArrowDown") {
        newPos = Math.min(100, currentPos + KEYBOARD_STEP);
      }
    }

    if (newPos !== currentPos) {
      event.preventDefault();
      position.set(newPos);
    }
  };

  const handleContainerClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (isDragging) return;
    const newPos = calculatePosition(event.clientX, event.clientY);
    position.set(newPos);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full overflow-hidden select-none",
        isHorizontal ? "aspect-video" : "aspect-[3/4]",
        className
      )}
      onClick={handleContainerClick}
      onKeyDown={handleKeyDown}
      role="slider"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(position.get())}
      aria-label={`Image comparison slider. ${isHorizontal ? "Use left and right arrow keys" : "Use up and down arrow keys"} to adjust.`}
      tabIndex={0}
    >
      {/* After image (background) */}
      <img
        src={afterImage}
        alt={afterLabel}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />

      {/* Before image (clipped) */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ clipPath }}
      >
        <img
          src={beforeImage}
          alt={beforeLabel}
          className="h-full w-full object-cover"
          draggable={false}
        />
      </motion.div>

      {/* Divider line */}
      <motion.div
        className={cn(
          "absolute z-10",
          isHorizontal ? "top-0 h-full w-0.5" : "left-0 h-0.5 w-full"
        )}
        style={{
          backgroundColor: dividerColor,
          ...(isHorizontal
            ? { left: dividerPosition, x: "-50%" }
            : { top: dividerPosition, y: "-50%" }),
        }}
      />

      {/* Divider handle */}
      <motion.div
        className={cn(
          "absolute z-20 flex items-center justify-center rounded-full shadow-lg",
          "h-10 w-10 cursor-grab active:cursor-grabbing",
          isDragging && "cursor-grabbing"
        )}
        style={{
          backgroundColor: dividerColor,
          ...(isHorizontal
            ? {
                left: dividerPosition,
                top: "50%",
                x: "-50%",
                y: "-50%",
              }
            : {
                top: dividerPosition,
                left: "50%",
                x: "-50%",
                y: "-50%",
              }),
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Handle icon */}
        <div
          className={cn(
            "flex items-center gap-0.5",
            !isHorizontal && "rotate-90"
          )}
        >
          <svg
            width="6"
            height="14"
            viewBox="0 0 6 14"
            fill="none"
            className="text-black/60"
          >
            <path
              d="M5 1L1 7L5 13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <svg
            width="6"
            height="14"
            viewBox="0 0 6 14"
            fill="none"
            className="text-black/60"
          >
            <path
              d="M1 1L5 7L1 13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </motion.div>

      {/* Labels */}
      {showLabels && (
        <>
          <motion.div
            className={cn(
              "pointer-events-none absolute z-10 rounded-md bg-black/50 px-3 py-1.5 font-medium text-sm text-white backdrop-blur-sm",
              isHorizontal ? "top-4 left-4" : "top-4 left-4"
            )}
            style={{ opacity: beforeLabelOpacity }}
          >
            {beforeLabel}
          </motion.div>
          <motion.div
            className={cn(
              "pointer-events-none absolute z-10 rounded-md bg-black/50 px-3 py-1.5 font-medium text-sm text-white backdrop-blur-sm",
              isHorizontal ? "top-4 right-4" : "bottom-4 right-4"
            )}
            style={{ opacity: afterLabelOpacity }}
          >
            {afterLabel}
          </motion.div>
        </>
      )}
    </div>
  );
}
