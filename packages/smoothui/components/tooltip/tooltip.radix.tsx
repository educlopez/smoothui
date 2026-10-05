"use client";

import { cn } from "@repo/smoothui-utils";
import { motion, useReducedMotion } from "motion/react";
import { Tooltip as TooltipPrimitive } from "radix-ui";
import {
  type ComponentProps,
  isValidElement,
  type ReactNode,
  useState,
} from "react";
import {
  OVERLAY_ENTER,
  OVERLAY_ENTER_INITIAL,
  OVERLAY_EXIT,
  OVERLAY_TRANSITION,
} from "../../lib/animation";

const DEFAULT_DELAY = 400;

export interface TooltipProps {
  /** Trigger element */
  children: ReactNode;
  /** Additional CSS class names for the tooltip content */
  className?: string;
  /** Tooltip label / content */
  content: ReactNode;
  /** Hover open delay in ms */
  delay?: number;
  /** Callback when the open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Controlled open state */
  open?: boolean;
  /** Preferred side of the trigger */
  side?: "top" | "right" | "bottom" | "left";
  /** Distance in px from the trigger */
  sideOffset?: number;
}

export interface TooltipContentProps {
  /** Tooltip label / content */
  children?: ReactNode;
  /** Additional CSS class names */
  className?: string;
  /** Preferred side of the trigger */
  side?: "top" | "right" | "bottom" | "left";
  /** Distance in px from the trigger */
  sideOffset?: number;
}

const POPUP_CLASS =
  "z-50 origin-(--radix-tooltip-content-transform-origin) rounded-md bg-foreground px-3 py-1.5 text-background text-xs shadow-md outline-none";

const overlayMotion = (shouldReduceMotion: boolean | null) => ({
  animate: shouldReduceMotion
    ? { opacity: 1 }
    : { opacity: OVERLAY_ENTER.opacity, scale: OVERLAY_ENTER.scale },
  exit: shouldReduceMotion
    ? { opacity: 0, transition: { duration: 0 } }
    : {
        opacity: OVERLAY_EXIT.opacity,
        scale: OVERLAY_EXIT.scale,
        transition: { duration: 0.12 },
      },
  initial: shouldReduceMotion
    ? { opacity: 1 }
    : {
        opacity: OVERLAY_ENTER_INITIAL.opacity,
        scale: OVERLAY_ENTER_INITIAL.scale,
      },
  transition: shouldReduceMotion ? { duration: 0 } : OVERLAY_TRANSITION,
});

export const TooltipProvider = ({
  delayDuration = DEFAULT_DELAY,
  ...props
}: ComponentProps<typeof TooltipPrimitive.Provider>) => (
  <TooltipPrimitive.Provider delayDuration={delayDuration} {...props} />
);

export const TooltipTrigger = ({
  ...props
}: ComponentProps<typeof TooltipPrimitive.Trigger>) => (
  <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
);

/**
 * Tooltip content — Portal + animated Content.
 */
export const TooltipContent = ({
  className,
  side = "top",
  sideOffset = 4,
  children,
}: TooltipContentProps) => {
  const shouldReduceMotion = useReducedMotion();
  const motionProps = overlayMotion(shouldReduceMotion);

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        className={cn(POPUP_CLASS, className)}
        data-slot="tooltip-content"
        side={side}
        sideOffset={sideOffset}
      >
        <motion.div
          animate={motionProps.animate}
          initial={motionProps.initial}
          transition={motionProps.transition}
        >
          {children}
        </motion.div>
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
};

/**
 * SmoothUI Tooltip — Radix twin.
 * Same public props as the Base UI twin; headless via `radix-ui` Tooltip.
 */
export default function Tooltip({
  children,
  content,
  side = "top",
  sideOffset = 4,
  delay = DEFAULT_DELAY,
  className,
  open,
  onOpenChange,
}: TooltipProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const handleOpenChange = (next: boolean) => {
    if (!isControlled) {
      setInternalOpen(next);
    }
    onOpenChange?.(next);
  };

  return (
    <TooltipProvider delayDuration={delay}>
      <TooltipPrimitive.Root onOpenChange={handleOpenChange} open={isOpen}>
        {isValidElement(children) ? (
          <TooltipTrigger asChild>{children}</TooltipTrigger>
        ) : (
          <TooltipTrigger>{children}</TooltipTrigger>
        )}
        <TooltipContent
          className={className}
          side={side}
          sideOffset={sideOffset}
        >
          {content}
        </TooltipContent>
      </TooltipPrimitive.Root>
    </TooltipProvider>
  );
}
