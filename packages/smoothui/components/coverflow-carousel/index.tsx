"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import SmoothButton from "@repo/smoothui/components/smooth-button";
import { motion, useReducedMotion } from "motion/react";
import type { KeyboardEvent, ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

export interface CoverflowCarouselItem {
  alt?: string;
  content?: ReactNode;
  id: string;
  image?: string;
}

export interface CoverflowCarouselProps {
  autoplay?: boolean;
  autoplayDelay?: number;
  className?: string;
  depth?: number;
  index?: number;
  inverted?: boolean;
  items: CoverflowCarouselItem[];
  loop?: boolean;
  onIndexChange?: (index: number) => void;
  rotation?: number;
  scaleStep?: number;
  spacing?: number;
}

interface DragInfo {
  offset: { x: number; y: number };
  velocity: { x: number; y: number };
}

const DEFAULT_DEPTH = 180;
const DEFAULT_ROTATION = 45;
const DEFAULT_SPACING = 220;
const DEFAULT_SCALE_STEP = 0.15;
const DEFAULT_AUTOPLAY_DELAY = 4000;
const SWIPE_VELOCITY_THRESHOLD = 500;
const SWIPE_DISTANCE_THRESHOLD = 80;
const MAX_VISIBLE_OFFSET = 3;
const MIN_SCALE = 0.4;

const CoverflowCarousel = ({
  items,
  index: indexProp,
  onIndexChange,
  inverted = false,
  depth = DEFAULT_DEPTH,
  rotation = DEFAULT_ROTATION,
  spacing = DEFAULT_SPACING,
  scaleStep = DEFAULT_SCALE_STEP,
  loop = false,
  autoplay = false,
  autoplayDelay = DEFAULT_AUTOPLAY_DELAY,
  className,
}: CoverflowCarouselProps) => {
  const shouldReduceMotion = useReducedMotion();
  const [internalIndex, setInternalIndex] = useState(0);
  const isControlled = indexProp !== undefined;
  const activeIndex = isControlled ? indexProp : internalIndex;
  const [isPaused, setIsPaused] = useState(false);
  const total = items.length;

  const goTo = useCallback(
    (next: number) => {
      const clamped = loop
        ? ((next % total) + total) % total
        : Math.min(Math.max(next, 0), total - 1);

      if (!isControlled) {
        setInternalIndex(clamped);
      }
      onIndexChange?.(clamped);
    },
    [isControlled, loop, onIndexChange, total]
  );

  useEffect(() => {
    if (!autoplay || shouldReduceMotion || isPaused || total <= 1) {
      return;
    }

    const timer = setInterval(() => {
      goTo(activeIndex + 1);
    }, autoplayDelay);

    return () => clearInterval(timer);
  }, [
    autoplay,
    shouldReduceMotion,
    isPaused,
    activeIndex,
    autoplayDelay,
    goTo,
    total,
  ]);

  useEffect(() => {
    const handleVisibility = () => {
      setIsPaused(document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(activeIndex + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(activeIndex - 1);
    }
  };

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: DragInfo
  ) => {
    const isSwipeLeft =
      info.offset.x < -SWIPE_DISTANCE_THRESHOLD ||
      info.velocity.x < -SWIPE_VELOCITY_THRESHOLD;
    const isSwipeRight =
      info.offset.x > SWIPE_DISTANCE_THRESHOLD ||
      info.velocity.x > SWIPE_VELOCITY_THRESHOLD;

    if (isSwipeLeft) {
      goTo(activeIndex + 1);
    } else if (isSwipeRight) {
      goTo(activeIndex - 1);
    }
  };

  const dragEndRef = useRef(handleDragEnd);
  dragEndRef.current = handleDragEnd;

  return (
    <div
      aria-label="Coverflow carousel"
      aria-roledescription="carousel"
      className={cn("relative w-full select-none outline-none", className)}
      onBlur={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      style={{ perspective: shouldReduceMotion ? undefined : 1200 }}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: this WAI-ARIA APG carousel widget intentionally accepts focus so ArrowLeft/ArrowRight can move slides while the region is focused (in addition to the Previous/Next buttons below); removing tabIndex would remove that keyboard-navigation path entirely.
      tabIndex={0}
    >
      <motion.div
        className="relative mx-auto flex h-[320px] items-center justify-center"
        drag={total > 1 && !shouldReduceMotion ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.12}
        onDragEnd={(event, info) => dragEndRef.current(event, info)}
        style={{ transformStyle: "preserve-3d" }}
      >
        {items.map((item, i) => {
          const offset = i - activeIndex;
          const isVisible = Math.abs(offset) <= MAX_VISIBLE_OFFSET;
          const isActive = offset === 0;

          if (!isVisible) {
            return null;
          }

          const direction = inverted ? -1 : 1;
          const rotateY = shouldReduceMotion
            ? 0
            : direction * -offset * rotation;
          const translateX = offset * spacing;
          const translateZ = shouldReduceMotion ? 0 : -Math.abs(offset) * depth;
          const scale = Math.max(1 - Math.abs(offset) * scaleStep, MIN_SCALE);

          return (
            <motion.div
              animate={
                shouldReduceMotion
                  ? { opacity: isActive ? 1 : 0, x: translateX }
                  : {
                      opacity: 1,
                      rotateY,
                      scale,
                      x: translateX,
                      z: translateZ,
                    }
              }
              aria-hidden={!isActive}
              className="absolute h-[220px] w-[280px] overflow-hidden rounded-2xl border border-foreground/10 bg-background shadow-xl"
              key={item.id}
              style={{
                transformStyle: "preserve-3d",
                zIndex: total - Math.abs(offset),
              }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { bounce: 0.1, duration: 0.25, type: "spring" }
              }
            >
              {item.image ? (
                <img
                  alt={item.alt ?? ""}
                  className="h-full w-full object-cover"
                  draggable={false}
                  src={item.image}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center p-4 text-sm">
                  {item.content}
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      <div className="mt-4 flex items-center justify-center gap-4">
        <SmoothButton
          aria-label="Previous slide"
          disabled={!loop && activeIndex === 0}
          onClick={() => goTo(activeIndex - 1)}
          shape="pill"
          size="sm"
          variant="outline"
        >
          Prev
        </SmoothButton>
        <SmoothButton
          aria-label="Next slide"
          disabled={!loop && activeIndex === total - 1}
          onClick={() => goTo(activeIndex + 1)}
          shape="pill"
          size="sm"
          variant="outline"
        >
          Next
        </SmoothButton>
      </div>

      <div aria-live="polite" className="sr-only">
        {`Slide ${activeIndex + 1} of ${total}`}
      </div>
    </div>
  );
};

export default CoverflowCarousel;
