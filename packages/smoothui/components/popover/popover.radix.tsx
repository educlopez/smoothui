"use client";

import { cn } from "@repo/smoothui-utils";
import { motion, useReducedMotion } from "motion/react";
import { Popover as PopoverPrimitive } from "radix-ui";
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

export interface PopoverProps {
  /** Alignment of the popover relative to the trigger */
  align?: "start" | "center" | "end";
  /** Popover content */
  children?: ReactNode;
  /** Additional CSS class names for the content */
  className?: string;
  /** Callback when the open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Controlled open state */
  open?: boolean;
  /** Preferred side of the trigger */
  side?: "top" | "right" | "bottom" | "left";
  /** Distance in px from the trigger */
  sideOffset?: number;
  /** Trigger element that opens the popover */
  trigger?: ReactNode;
}

export interface PopoverContentProps {
  /** Alignment of the popover relative to the trigger */
  align?: "start" | "center" | "end";
  /** Popover content */
  children?: ReactNode;
  /** Additional CSS class names */
  className?: string;
  /** Preferred side of the trigger */
  side?: "top" | "right" | "bottom" | "left";
  /** Distance in px from the trigger */
  sideOffset?: number;
}

const POPUP_CLASS =
  "z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none";

const overlayMotion = (shouldReduceMotion: boolean | null) => ({
  animate: shouldReduceMotion
    ? { opacity: 1 }
    : { opacity: OVERLAY_ENTER.opacity, scale: OVERLAY_ENTER.scale },
  exit: shouldReduceMotion
    ? { opacity: 0, transition: { duration: 0 } }
    : {
        opacity: OVERLAY_EXIT.opacity,
        scale: OVERLAY_EXIT.scale,
        transition: { duration: 0.15 },
      },
  initial: shouldReduceMotion
    ? { opacity: 1 }
    : {
        opacity: OVERLAY_ENTER_INITIAL.opacity,
        scale: OVERLAY_ENTER_INITIAL.scale,
      },
  transition: shouldReduceMotion ? { duration: 0 } : OVERLAY_TRANSITION,
});

export const PopoverRoot = ({
  ...props
}: ComponentProps<typeof PopoverPrimitive.Root>) => (
  <PopoverPrimitive.Root data-slot="popover" {...props} />
);

export const PopoverTrigger = ({
  ...props
}: ComponentProps<typeof PopoverPrimitive.Trigger>) => (
  <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
);

export const PopoverClose = ({
  ...props
}: ComponentProps<typeof PopoverPrimitive.Close>) => (
  <PopoverPrimitive.Close data-slot="popover-close" {...props} />
);

/**
 * Anchored popover content — Portal + animated Content.
 */
export const PopoverContent = ({
  className,
  side = "bottom",
  align = "center",
  sideOffset = 4,
  children,
}: PopoverContentProps) => {
  const shouldReduceMotion = useReducedMotion();
  const motionProps = overlayMotion(shouldReduceMotion);

  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        align={align}
        asChild
        data-slot="popover-content"
        side={side}
        sideOffset={sideOffset}
      >
        <motion.div
          animate={motionProps.animate}
          className={cn(POPUP_CLASS, className)}
          initial={motionProps.initial}
          transition={motionProps.transition}
        >
          {children}
        </motion.div>
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
};

/**
 * SmoothUI Popover — Radix twin.
 * Same public props as the Base UI twin; headless via `radix-ui` Popover.
 */
export default function Popover({
  open,
  onOpenChange,
  trigger,
  children,
  className,
  side = "bottom",
  align = "center",
  sideOffset = 4,
}: PopoverProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const handleOpenChange = (next: boolean) => {
    if (!isControlled) {
      setInternalOpen(next);
    }
    onOpenChange?.(next);
  };

  let triggerNode: ReactNode = null;
  if (trigger) {
    triggerNode = isValidElement(trigger) ? (
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
    ) : (
      <PopoverTrigger>{trigger}</PopoverTrigger>
    );
  }

  return (
    <PopoverRoot onOpenChange={handleOpenChange} open={isOpen}>
      {triggerNode}
      <PopoverContent
        align={align}
        className={className}
        side={side}
        sideOffset={sideOffset}
      >
        {children}
      </PopoverContent>
    </PopoverRoot>
  );
}
