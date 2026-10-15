"use client";

import { PreviewCard as PreviewCardPrimitive } from "@base-ui/react/preview-card";
import { cn } from "@repo/smoothui-utils";
import { motion, useReducedMotion } from "motion/react";
import {
  type ComponentProps,
  createContext,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useContext,
} from "react";
import {
  OVERLAY_ENTER,
  OVERLAY_ENTER_INITIAL,
  OVERLAY_EXIT,
  OVERLAY_TRANSITION,
} from "../../lib/animation";

type Side = "top" | "right" | "bottom" | "left";
type Align = "start" | "center" | "end";

export interface PreviewCardProps {
  /** Alignment of the card relative to the trigger */
  align?: Align;
  /** Card content */
  children?: ReactNode;
  /** Additional CSS class names for the card */
  className?: string;
  /** Delay in ms before the card closes after the pointer leaves */
  closeDelay?: number;
  /** Delay in ms before the card opens on hover/focus */
  delay?: number;
  /** Callback when the open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Controlled open state */
  open?: boolean;
  /** Preferred side of the trigger */
  side?: Side;
  /** Distance in px from the trigger */
  sideOffset?: number;
  /** Trigger element (usually a link) that reveals the card */
  trigger?: ReactNode;
}

export interface PreviewCardContentProps {
  /** Alignment of the card relative to the trigger */
  align?: Align;
  /** Show an arrow pointing at the trigger */
  arrow?: boolean;
  /** Card content */
  children?: ReactNode;
  /** Additional CSS class names */
  className?: string;
  /** Preferred side of the trigger */
  side?: Side;
  /** Distance in px from the trigger */
  sideOffset?: number;
}

export type PreviewCardRootProps = Omit<
  ComponentProps<typeof PreviewCardPrimitive.Root>,
  "onOpenChange"
> & {
  /** Delay in ms before the card closes after the pointer leaves */
  closeDelay?: number;
  /** Delay in ms before the card opens on hover/focus */
  delay?: number;
  onOpenChange?: (open: boolean) => void;
};
export type PreviewCardTriggerProps = ComponentProps<
  typeof PreviewCardPrimitive.Trigger
>;
export type PreviewCardPortalProps = ComponentProps<
  typeof PreviewCardPrimitive.Portal
>;
export type PreviewCardPositionerProps = Omit<
  ComponentProps<typeof PreviewCardPrimitive.Positioner>,
  "className"
> & { className?: string };
export type PreviewCardPopupProps = Omit<
  ComponentProps<typeof PreviewCardPrimitive.Popup>,
  "className"
> & { className?: string };
export type PreviewCardArrowProps = Omit<
  ComponentProps<typeof PreviewCardPrimitive.Arrow>,
  "className"
> & { className?: string };

const POPUP_CLASS =
  "w-64 min-w-0 origin-[var(--transform-origin)] rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none";

const ARROW_CLASS =
  "size-2 rotate-45 border-border bg-popover data-[side=bottom]:top-[-5px] data-[side=bottom]:border-t data-[side=bottom]:border-l data-[side=left]:right-[-5px] data-[side=left]:border-t data-[side=left]:border-r data-[side=right]:left-[-5px] data-[side=right]:border-b data-[side=right]:border-l data-[side=top]:bottom-[-5px] data-[side=top]:border-r data-[side=top]:border-b";

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

interface DelayContextValue {
  closeDelay?: number;
  delay?: number;
}

const DelayContext = createContext<DelayContextValue>({});

/**
 * Preview card root. `delay` / `closeDelay` live here (same as the Radix twin)
 * and are forwarded to the trigger.
 */
export const PreviewCardRoot = ({
  closeDelay,
  delay,
  onOpenChange,
  ...props
}: PreviewCardRootProps) => (
  <DelayContext.Provider value={{ closeDelay, delay }}>
    <PreviewCardPrimitive.Root
      onOpenChange={(next) => onOpenChange?.(next)}
      {...props}
    />
  </DelayContext.Provider>
);

export const PreviewCardTrigger = ({
  closeDelay,
  delay,
  ...props
}: PreviewCardTriggerProps) => {
  const ctx = useContext(DelayContext);

  return (
    <PreviewCardPrimitive.Trigger
      closeDelay={closeDelay ?? ctx.closeDelay}
      data-slot="preview-card-trigger"
      delay={delay ?? ctx.delay}
      {...props}
    />
  );
};

export const PreviewCardPortal = (props: PreviewCardPortalProps) => (
  <PreviewCardPrimitive.Portal {...props} />
);

export const PreviewCardPositioner = ({
  className,
  ...props
}: PreviewCardPositionerProps) => (
  <PreviewCardPrimitive.Positioner
    className={cn("z-50 outline-none", className)}
    data-slot="preview-card-positioner"
    {...props}
  />
);

/** Animated card surface — Motion fade/scale from `OVERLAY_*`. */
export const PreviewCardPopup = ({
  className,
  ...props
}: PreviewCardPopupProps) => {
  const shouldReduceMotion = useReducedMotion();
  const motionProps = overlayMotion(shouldReduceMotion);

  return (
    <PreviewCardPrimitive.Popup
      className={cn(POPUP_CLASS, className)}
      data-slot="preview-card-popup"
      render={
        <motion.div
          animate={motionProps.animate}
          initial={motionProps.initial}
          transition={motionProps.transition}
        />
      }
      {...props}
    />
  );
};

export const PreviewCardArrow = ({
  className,
  ...props
}: PreviewCardArrowProps) => (
  <PreviewCardPrimitive.Arrow
    className={cn(ARROW_CLASS, className)}
    data-slot="preview-card-arrow"
    {...props}
  />
);

/**
 * Anchored card — Portal + Positioner + animated Popup (+ optional Arrow).
 */
export const PreviewCardContent = ({
  align = "center",
  arrow = false,
  children,
  className,
  side = "bottom",
  sideOffset = 8,
}: PreviewCardContentProps) => (
  <PreviewCardPortal>
    <PreviewCardPositioner align={align} side={side} sideOffset={sideOffset}>
      <PreviewCardPopup className={className}>
        {children}
        {arrow ? <PreviewCardArrow /> : null}
      </PreviewCardPopup>
    </PreviewCardPositioner>
  </PreviewCardPortal>
);

const renderTrigger = (trigger: ReactNode) => {
  if (!trigger) {
    return null;
  }
  if (isValidElement(trigger)) {
    return <PreviewCardTrigger render={trigger as ReactElement} />;
  }
  return <PreviewCardTrigger>{trigger}</PreviewCardTrigger>;
};

/**
 * SmoothUI Preview Card — Base UI twin (default).
 * Hover/focus card for link previews; convenience API with trigger + content.
 */
export default function PreviewCard({
  align = "center",
  children,
  className,
  closeDelay,
  delay,
  onOpenChange,
  open,
  side = "bottom",
  sideOffset = 8,
  trigger,
}: PreviewCardProps) {
  return (
    <PreviewCardRoot
      closeDelay={closeDelay}
      delay={delay}
      onOpenChange={onOpenChange}
      open={open}
    >
      {renderTrigger(trigger)}
      <PreviewCardContent
        align={align}
        className={className}
        side={side}
        sideOffset={sideOffset}
      >
        {children}
      </PreviewCardContent>
    </PreviewCardRoot>
  );
}
