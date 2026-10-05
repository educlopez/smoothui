"use client";

import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { cn } from "@repo/smoothui-utils";
import { motion, useReducedMotion } from "motion/react";
import {
  type ComponentProps,
  isValidElement,
  type ReactElement,
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
  "z-50 w-72 origin-[var(--transform-origin)] rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none";

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

type TriggerComponent = (props: {
  children?: ReactNode;
  nativeButton?: boolean;
  render?: ReactElement;
}) => ReactElement | null;

const renderTrigger = (Trigger: TriggerComponent, trigger: ReactNode) => {
  if (!trigger) {
    return null;
  }
  if (isValidElement(trigger)) {
    const element = trigger as ReactElement;
    const nativeButton =
      typeof element.type === "string" ? element.type === "button" : true;
    return <Trigger nativeButton={nativeButton} render={element} />;
  }
  return <Trigger>{trigger}</Trigger>;
};

export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverClose = PopoverPrimitive.Close;

export const PopoverRoot = ({
  ...props
}: ComponentProps<typeof PopoverPrimitive.Root>) => (
  <PopoverPrimitive.Root data-slot="popover" {...props} />
);

/**
 * Anchored popover content — Portal + Positioner + animated Popup.
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
      <PopoverPrimitive.Positioner
        align={align}
        className="outline-none"
        side={side}
        sideOffset={sideOffset}
      >
        <PopoverPrimitive.Popup
          className={cn(POPUP_CLASS, className)}
          data-slot="popover-content"
          render={
            <motion.div
              animate={motionProps.animate}
              initial={motionProps.initial}
              transition={motionProps.transition}
            />
          }
        >
          {children}
        </PopoverPrimitive.Popup>
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
};

/**
 * SmoothUI Popover — Base UI twin (default).
 * Convenience API with trigger + content; compounds available for advanced use.
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

  return (
    <PopoverPrimitive.Root onOpenChange={handleOpenChange} open={isOpen}>
      {renderTrigger(PopoverPrimitive.Trigger, trigger)}
      <PopoverContent
        align={align}
        className={className}
        side={side}
        sideOffset={sideOffset}
      >
        {children}
      </PopoverContent>
    </PopoverPrimitive.Root>
  );
}
