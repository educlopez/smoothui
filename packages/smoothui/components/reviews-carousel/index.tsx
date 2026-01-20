"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState } from "react";

const FRAME_OFFSET = -30;
const FRAMES_VISIBLE_LENGTH = 3;

function clamp(val: number, [min, max]: [number, number]): number {
  return Math.min(Math.max(val, min), max);
}

export type Review = {
  id: string | number;
  body: string;
  author: string;
  title: string;
};

type ReviewCardProps = {
  review: Review;
  index: number;
  activeIndex: number;
  totalCards: number;
};

function ReviewCard({
  review,
  index,
  activeIndex,
  totalCards,
}: ReviewCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const offsetIndex = index - activeIndex;

  // Same logic as time-machine
  const blur = activeIndex > index ? 2 : 0;
  const opacity = activeIndex > index ? 0 : 1;
  const scale = shouldReduceMotion
    ? 1
    : clamp(1 - offsetIndex * 0.08, [0.08, 2]);
  const y = shouldReduceMotion
    ? 0
    : clamp(offsetIndex * FRAME_OFFSET, [
        FRAME_OFFSET * FRAMES_VISIBLE_LENGTH,
        Number.POSITIVE_INFINITY,
      ]);

  const isActive = index === activeIndex;

  return (
    <motion.figure
      animate={{
        y,
        scale,
        transition: {
          type: "spring",
          stiffness: 250,
          damping: 20,
          mass: 0.5,
          duration: 0.25,
        },
      }}
      className={cn(
        "-translate-x-1/2 -translate-y-1/2 absolute left-1/2 w-[calc(100%-2rem)] max-w-[600px] rounded-2xl border border-foreground/10 bg-background/80 p-4 shadow-lg backdrop-blur-md sm:p-6"
      )}
      initial={false}
      style={{
        borderWidth: 1 / scale,
        willChange: "opacity, filter, transform",
        filter: `blur(${blur}px)`,
        opacity,
        transitionProperty: "opacity, filter",
        transitionDuration: shouldReduceMotion ? "0ms" : "250ms",
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
        zIndex: totalCards - index,
        pointerEvents: isActive ? "auto" : "none",
        top: "50%", // Centrar verticalmente
      }}
    >
      <blockquote className="relative">
        <div className="-left-2 -top-1 absolute text-4xl text-foreground/10 leading-none dark:text-foreground/5">
          "
        </div>
        <p className="relative text-foreground/80 text-sm leading-relaxed">
          {review.body}
        </p>
      </blockquote>
      <figcaption className="mt-4 flex items-center gap-2 border-foreground/5 border-t pt-4">
        <div className="flex flex-col">
          <span className="font-semibold text-foreground text-xs">
            {review.author}
          </span>
          <span className="text-foreground/50 text-xs">{review.title}</span>
        </div>
      </figcaption>
    </motion.figure>
  );
}

type NavigationButtonProps = {
  direction: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
};

function NavigationButton({
  direction,
  onClick,
  disabled,
}: NavigationButtonProps) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;

  return (
    <button
      aria-label={direction === "prev" ? "Anterior" : "Siguiente"}
      className={cn(
        "box-gen group relative z-0 flex h-7 w-7 items-center justify-center rounded-full border-[0.5px] border-foreground/10 bg-background/50 backdrop-blur-sm transition-all duration-200",
        disabled
          ? "cursor-not-allowed opacity-30"
          : "cursor-pointer hover:border-foreground/20 hover:bg-background/70 hover:shadow-lg",
        "dark:border-foreground/5 dark:bg-foreground/5 dark:hover:border-foreground/10 dark:hover:bg-foreground/10"
      )}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <Icon
        className={cn(
          "h-3.5 w-3.5 text-foreground/60 transition-colors",
          "group-hover:text-foreground group-disabled:text-foreground/20"
        )}
      />
    </button>
  );
}

export type ReviewsCarouselProps = {
  reviews: Review[];
  className?: string;
  height?: string;
  excludeIds?: (string | number)[];
  showIndicators?: boolean;
  showNavigation?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
};

export default function ReviewsCarousel({
  reviews,
  className = "",
  height = "300px",
  excludeIds = [],
  showIndicators = true,
  showNavigation = true,
  autoPlay = false,
  autoPlayInterval = 5000,
}: ReviewsCarouselProps) {
  // Filter out excluded reviews
  const filteredReviews = useMemo(
    () => reviews.filter((review) => !excludeIds.includes(review.id)),
    [reviews, excludeIds]
  );

  const maxIndex = filteredReviews.length - 1;
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || maxIndex < 0) {
      return;
    }

    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => {
        if (prevIndex >= maxIndex) {
          return 0;
        }
        return prevIndex + 1;
      });
    }, autoPlayInterval);

    return () => {
      clearInterval(interval);
    };
  }, [autoPlay, autoPlayInterval, maxIndex]);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") {
        setActiveIndex((i) => clamp(i - 1, [0, maxIndex]));
      } else if (event.key === "ArrowRight") {
        setActiveIndex((i) => clamp(i + 1, [0, maxIndex]));
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [maxIndex]);

  const goToPrevious = () => {
    setActiveIndex((prevIndex) => {
      if (prevIndex > 0) {
        return prevIndex - 1;
      }
      return prevIndex;
    });
  };

  const goToNext = () => {
    setActiveIndex((prevIndex) => {
      const newIndex = prevIndex + 1;
      return newIndex <= maxIndex ? newIndex : prevIndex;
    });
  };

  if (filteredReviews.length === 0) {
    return null;
  }

  return (
    <div
      className={cn("relative mx-auto w-full max-w-4xl", className)}
      style={{ height }}
    >
      {/* Stack of cards - using grid-stack pattern */}
      <div className="relative h-full w-full py-8">
        <div className="grid h-full w-full place-items-center">
          {filteredReviews.map((review: Review, index: number) => (
            <ReviewCard
              activeIndex={activeIndex}
              index={index}
              key={review.id}
              review={review}
              totalCards={filteredReviews.length}
            />
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      {(showNavigation || showIndicators) && (
        <div className="-translate-x-1/2 absolute bottom-4 left-1/2 z-50 flex items-center gap-2">
          {showNavigation && (
            <NavigationButton
              direction="prev"
              disabled={activeIndex <= 0}
              onClick={goToPrevious}
            />
          )}
          {showIndicators && (
            <div className="flex items-center gap-2">
              {filteredReviews.map((review: Review, index: number) => (
                <button
                  aria-label={`Ir al testimonio ${index + 1}`}
                  className={cn(
                    "h-2 rounded-full transition-all duration-200",
                    index === activeIndex
                      ? "w-8 bg-brand"
                      : "w-2 bg-brand/30 hover:bg-brand/50"
                  )}
                  key={review.id}
                  onClick={() => {
                    setActiveIndex(index);
                  }}
                  type="button"
                />
              ))}
            </div>
          )}
          {showNavigation && (
            <NavigationButton
              direction="next"
              disabled={activeIndex === maxIndex}
              onClick={goToNext}
            />
          )}
        </div>
      )}
    </div>
  );
}
