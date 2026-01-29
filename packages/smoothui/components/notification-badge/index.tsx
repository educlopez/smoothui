"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

export type NotificationBadgeProps = {
  variant?: "dot" | "count" | "status";
  count?: number;
  max?: number;
  status?: "online" | "offline" | "busy" | "away";
  showZero?: boolean;
  ping?: boolean;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  children?: ReactNode;
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

const AnimatedCount = ({
  value,
  max,
  shouldReduceMotion,
}: {
  value: number;
  max: number;
  shouldReduceMotion: boolean | null;
}) => {
  const displayValue = value > max ? `${max}+` : value.toString();
  const prevValueRef = useRef(value);
  const direction = value > prevValueRef.current ? 1 : -1;

  useEffect(() => {
    prevValueRef.current = value;
  }, [value]);

  if (shouldReduceMotion) {
    return <span className="font-medium leading-none">{displayValue}</span>;
  }

  return (
    <span className="relative overflow-hidden font-medium leading-none">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: direction * 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: direction * -12, opacity: 0 }}
          transition={{ type: "spring", duration: 0.3, bounce: 0.1 }}
          className="inline-block"
        >
          {displayValue}
        </motion.span>
      </AnimatePresence>
    </span>
  );
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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const shouldShow =
      variant === "dot" ||
      variant === "status" ||
      (variant === "count" && (count > 0 || showZero));
    setIsVisible(shouldShow);
  }, [variant, count, showZero]);

  const getBadgeClasses = () => {
    if (variant === "dot") return "h-2.5 w-2.5";
    if (variant === "status") return "h-3 w-3";
    const displayValue = count > max ? `${max}+` : count.toString();
    if (displayValue.length === 1) return "h-5 w-5 text-xs";
    if (displayValue.length === 2) return "h-5 min-w-5 px-1 text-xs";
    return "h-5 min-w-6 px-1 text-xs";
  };

  const getBackgroundColor = () => {
    if (variant === "status") return statusColors[status];
    return "bg-brand";
  };

  const badgeElement = (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.span
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={
            shouldReduceMotion
              ? { opacity: 0, transition: { duration: 0 } }
              : { opacity: 0, scale: 0, transition: { duration: 0.15 } }
          }
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { type: "spring", duration: 0.25, bounce: 0.2 }
          }
          className={cn(
            "absolute flex items-center justify-center rounded-full text-white",
            getBackgroundColor(),
            getBadgeClasses(),
            positionClasses[position],
            variant === "status" && "ring-2 ring-white dark:ring-gray-900",
            className
          )}
        >
          {variant === "count" && (
            <AnimatedCount
              value={count}
              max={max}
              shouldReduceMotion={shouldReduceMotion}
            />
          )}

          {ping && !shouldReduceMotion && (
            <span
              aria-hidden="true"
              className={cn(
                "absolute inset-0 animate-ping rounded-full opacity-75",
                getBackgroundColor()
              )}
            />
          )}
        </motion.span>
      )}
    </AnimatePresence>
  );

  if (!children) {
    return (
      <span className="relative inline-flex">
        <span className="h-4 w-4" />
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
