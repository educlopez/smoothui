"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

export type NotificationBadgeProps = {
  /** The variant of the badge */
  variant?: "dot" | "count" | "status";
  /** The count to display (for count variant) */
  count?: number;
  /** Maximum count before showing "+" suffix (e.g., 99+) */
  max?: number;
  /** Status type (for status variant) */
  status?: "online" | "offline" | "busy" | "away";
  /** Whether to show the badge when count is zero */
  showZero?: boolean;
  /** Whether to show a ping animation for attention */
  ping?: boolean;
  /** Position of the badge relative to children */
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  /** The content to wrap with the badge */
  children?: ReactNode;
  /** Additional CSS classes */
  className?: string;
};

const statusColors = {
  online: "bg-emerald-500",
  offline: "bg-gray-400",
  busy: "bg-red-500",
  away: "bg-amber-500",
};

const positionClasses = {
  "top-right": "-top-1 -right-1",
  "top-left": "-top-1 -left-1",
  "bottom-right": "-bottom-1 -right-1",
  "bottom-left": "-bottom-1 -left-1",
};

const NotificationBadge = ({
  variant = "dot",
  count = 0,
  max = 99,
  status = "online",
  showZero = false,
  ping = false,
  position = "top-right",
  children,
  className,
}: NotificationBadgeProps) => {
  const shouldReduceMotion = useReducedMotion();
  const [displayCount, setDisplayCount] = useState(count);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevCountRef = useRef(count);

  // Handle count changes with animation
  useEffect(() => {
    if (variant === "count" && count !== prevCountRef.current) {
      setIsAnimating(true);
      setDisplayCount(count);
      prevCountRef.current = count;

      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 250);

      return () => clearTimeout(timer);
    }
  }, [count, variant]);

  // Determine if badge should be visible
  const shouldShowBadge = () => {
    if (variant === "dot" || variant === "status") {
      return true;
    }
    if (variant === "count") {
      return count > 0 || showZero;
    }
    return false;
  };

  // Format the count display
  const formatCount = (value: number) => {
    if (value > max) {
      return `${max}+`;
    }
    return value.toString();
  };

  // Get badge size classes based on variant
  const getBadgeClasses = () => {
    if (variant === "dot") {
      return "h-2.5 w-2.5";
    }
    if (variant === "status") {
      return "h-3 w-3";
    }
    // Count variant - size based on digit count
    const formattedCount = formatCount(displayCount);
    if (formattedCount.length === 1) {
      return "h-5 w-5 text-xs";
    }
    if (formattedCount.length === 2) {
      return "h-5 min-w-5 px-1 text-xs";
    }
    return "h-5 min-w-6 px-1 text-xs";
  };

  // Render the badge content
  const renderBadgeContent = () => {
    if (variant === "count") {
      return (
        <span className="font-medium leading-none">
          {formatCount(displayCount)}
        </span>
      );
    }
    return null;
  };

  // Get background color
  const getBackgroundColor = () => {
    if (variant === "status") {
      return statusColors[status];
    }
    return "bg-red-500";
  };

  const badgeElement = (
    <AnimatePresence mode="wait">
      {shouldShowBadge() && (
        <motion.span
          animate={
            shouldReduceMotion
              ? { opacity: 1, scale: 1 }
              : {
                  opacity: 1,
                  scale: isAnimating && variant === "count" ? [1, 1.2, 1] : 1,
                }
          }
          className={cn(
            "absolute flex items-center justify-center rounded-full text-white",
            getBackgroundColor(),
            getBadgeClasses(),
            positionClasses[position],
            variant === "status" && "ring-2 ring-white dark:ring-gray-900",
            className
          )}
          exit={
            shouldReduceMotion
              ? { opacity: 0, transition: { duration: 0 } }
              : { opacity: 0, scale: 0.5, transition: { duration: 0.15 } }
          }
          initial={
            shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.5 }
          }
          key={variant === "count" ? "count-badge" : "badge"}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { type: "spring", duration: 0.25, bounce: 0.1 }
          }
        >
          {renderBadgeContent()}

          {/* Ping animation overlay */}
          {ping && !shouldReduceMotion && (
            <span
              aria-hidden="true"
              className={cn(
                "absolute inset-0 animate-ping rounded-full",
                getBackgroundColor(),
                "opacity-75"
              )}
            />
          )}
        </motion.span>
      )}
    </AnimatePresence>
  );

  // If no children, just render the badge
  if (!children) {
    return (
      <span className="relative inline-flex">
        <span className={cn("h-4 w-4", className)} />
        {badgeElement}
      </span>
    );
  }

  return (
    <span className="relative inline-flex">
      {children}
      {badgeElement}
    </span>
  );
};

export default NotificationBadge;
