"use client";

import { cn } from "@repo/smoothui-utils";
import { motion, useReducedMotion } from "motion/react";
import type { ComponentProps, ReactNode } from "react";

export type BadgeVariant =
  | "default"
  | "secondary"
  | "outline"
  | "destructive"
  | "success"
  | "warning";

export type BadgeSize = "sm" | "md";

export interface BadgeProps extends Omit<ComponentProps<"span">, "children"> {
  /** Optional leading icon or indicator */
  children?: ReactNode;
  /** Visual size */
  size?: BadgeSize;
  /** Color / emphasis treatment */
  variant?: BadgeVariant;
}

export type StatusDotStatus = "online" | "offline" | "busy" | "away";

export type StatusDotSize = "sm" | "md" | "lg";

export interface StatusDotProps {
  /** Optional CSS class names */
  className?: string;
  /** Pulse animation for live presence (honors reduced motion) */
  pulse?: boolean;
  /** Dot diameter */
  size?: StatusDotSize;
  /** Presence / health state */
  status?: StatusDotStatus;
}

const BADGE_VARIANT: Record<BadgeVariant, string> = {
  default: "border-transparent bg-primary text-primary-foreground",
  destructive:
    "border-transparent bg-destructive text-white dark:bg-destructive/80",
  outline: "border-foreground/25 bg-transparent text-foreground",
  secondary: "border-transparent bg-secondary text-secondary-foreground",
  success:
    "border-transparent bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  warning:
    "border-transparent bg-amber-500/15 text-amber-800 dark:text-amber-400",
};

const BADGE_SIZE: Record<BadgeSize, string> = {
  md: "h-5 gap-1 px-2 text-xs",
  sm: "h-4 gap-0.5 px-1.5 text-[10px]",
};

const DOT_SIZE: Record<StatusDotSize, string> = {
  lg: "size-3",
  md: "size-2.5",
  sm: "size-2",
};

const DOT_COLOR: Record<StatusDotStatus, string> = {
  away: "bg-amber-500",
  busy: "bg-destructive",
  offline: "bg-zinc-400 dark:bg-zinc-600",
  online: "bg-emerald-500",
};

/**
 * SmoothUI Badge — compact label / tag. SmoothUI-owned (no Base/Radix twin).
 */
export default function Badge({
  children,
  className,
  size = "md",
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "ease inline-flex w-fit shrink-0 items-center justify-center whitespace-nowrap rounded-full border font-medium transition-colors duration-200 [&_svg]:pointer-events-none [&_svg]:size-3",
        BADGE_SIZE[size],
        BADGE_VARIANT[variant],
        className
      )}
      data-slot="badge"
      data-variant={variant}
      {...props}
    >
      {children}
    </span>
  );
}

/**
 * Presence / health indicator. Place near avatars or list rows.
 */
export const StatusDot = ({
  className,
  pulse = false,
  size = "md",
  status = "online",
}: StatusDotProps) => {
  const shouldReduceMotion = useReducedMotion();
  const showPulse = pulse && !shouldReduceMotion && status === "online";

  return (
    <span
      aria-label={status}
      className={cn(
        "relative inline-flex shrink-0 rounded-full",
        DOT_SIZE[size],
        DOT_COLOR[status],
        className
      )}
      data-slot="status-dot"
      data-status={status}
      role="status"
    >
      {showPulse ? (
        <motion.span
          animate={{ opacity: [0.55, 0], scale: [1, 1.85] }}
          aria-hidden
          className={cn("absolute inset-0 rounded-full", DOT_COLOR[status])}
          transition={{
            duration: 1.4,
            ease: [0.23, 1, 0.32, 1],
            repeat: Number.POSITIVE_INFINITY,
          }}
        />
      ) : null}
    </span>
  );
};
