"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

const DEFAULT_MAX_VISIBLE = 5;
const DEFAULT_STAGGER = 0.05;
const DEFAULT_FEED_INTERVAL = 2000;
const MAX_STAGGER_DELAY = 0.3;
const RECEDE_OPACITY_STEP = 0.18;
const RECEDE_SCALE_STEP = 0.05;
const MIN_RECEDE_OPACITY = 0.35;
const MIN_RECEDE_SCALE = 0.85;
const ENTER_OFFSET = 14;
const SPRING_TRANSITION = {
  bounce: 0.1,
  duration: 0.25,
  type: "spring" as const,
};

export type AnimatedListItem = {
  content: ReactNode;
  id: string;
};

export type AnimatedListDirection = "up" | "down";

export type AnimatedListProps = {
  className?: string;
  direction?: AnimatedListDirection;
  feed?: boolean;
  feedInterval?: number;
  items: AnimatedListItem[];
  maxVisible?: number;
  onItemClick?: (id: string) => void;
  pauseOnHover?: boolean;
  stagger?: number;
};

const AnimatedList = ({
  items,
  direction = "down",
  maxVisible = DEFAULT_MAX_VISIBLE,
  stagger = DEFAULT_STAGGER,
  feed = false,
  feedInterval = DEFAULT_FEED_INTERVAL,
  pauseOnHover = true,
  onItemClick,
  className,
}: AnimatedListProps) => {
  const shouldReduceMotion = useReducedMotion();
  const [feedCount, setFeedCount] = useState(feed ? 0 : items.length);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    setFeedCount(feed ? 0 : items.length);
  }, [feed, items]);

  useEffect(() => {
    if (!feed || isPaused || feedCount >= items.length) {
      return;
    }

    const timer = window.setInterval(() => {
      setFeedCount((count) => Math.min(count + 1, items.length));
    }, feedInterval);

    return () => window.clearInterval(timer);
  }, [feed, isPaused, feedCount, items.length, feedInterval]);

  const activeItems = feed ? items.slice(0, feedCount) : items;
  const visibleItems = activeItems.slice(
    Math.max(0, activeItems.length - maxVisible)
  );
  const orderedItems =
    direction === "down" ? [...visibleItems].reverse() : visibleItems;

  const handleMouseEnter = () => {
    if (pauseOnHover) {
      setIsPaused(true);
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      setIsPaused(false);
    }
  };

  return (
    <ul
      aria-live="polite"
      className={cn("flex flex-col gap-2", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <AnimatePresence mode="popLayout">
        {orderedItems.map((item, index) => {
          const recedeOpacity = Math.max(
            MIN_RECEDE_OPACITY,
            1 - index * RECEDE_OPACITY_STEP
          );
          const recedeScale = Math.max(
            MIN_RECEDE_SCALE,
            1 - index * RECEDE_SCALE_STEP
          );
          const enterY = direction === "down" ? -ENTER_OFFSET : ENTER_OFFSET;
          const delay = shouldReduceMotion
            ? 0
            : Math.min(index * stagger, MAX_STAGGER_DELAY);

          return (
            <motion.li
              animate={
                shouldReduceMotion
                  ? { opacity: 1, scale: 1, y: 0 }
                  : { opacity: recedeOpacity, scale: recedeScale, y: 0 }
              }
              className="list-none"
              exit={
                shouldReduceMotion
                  ? { opacity: 0, transition: { duration: 0 } }
                  : { opacity: 0, scale: 0.9, y: 0 }
              }
              initial={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 0, scale: 0.95, y: enterY }
              }
              key={item.id}
              layout
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { ...SPRING_TRANSITION, delay }
              }
            >
              {onItemClick ? (
                <button
                  className="w-full rounded-lg text-left"
                  onClick={() => onItemClick(item.id)}
                  type="button"
                >
                  {item.content}
                </button>
              ) : (
                item.content
              )}
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ul>
  );
};

export default AnimatedList;
