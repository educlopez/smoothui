"use client";

import { cn } from "@repo/smoothui-utils";
import { motion, useReducedMotion } from "motion/react";
import { HoverCard as PreviewCardPrimitive } from "radix-ui";
import {
  type ComponentProps,
  createContext,
  isValidElement,
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

export interface PreviewCardRootProps {
  children?: ReactNode;
  /** Delay in ms before the card closes after the pointer leaves */
  closeDelay?: number;
  /** Delay in ms before the card opens on hover/focus */
  delay?: number;
  /** Callback when the open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Controlled open state */
  open?: boolean;
}
export type PreviewCardTriggerProps = ComponentProps<
  typeof PreviewCardPrimitive.Trigger
>;
export interface PreviewCardPortalProps {
  children?: ReactNode;
}
export interface PreviewCardPositionerProps {
  /** Alignment of the card relative to the trigger */
  align?: Align;
  children?: ReactNode;
  /** Preferred side of the trigger */
  side?: Side;
  /** Distance in px from the trigger */
  sideOffset?: number;
}
export type PreviewCardPopupProps = Omit<
  ComponentProps<typeof PreviewCardPrimitive.Content>,
  "align" | "className" | "side" | "sideOffset"
> & { className?: string };
export type PreviewCardArrowProps = Omit<
  ComponentProps<typeof PreviewCardPrimitive.Arrow>,
  "className"
> & { className?: string };

const POPUP_CLASS =
  "w-64 min-w-0 origin-(--radix-hover-card-content-transform-origin) rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none";

const ARROW_CLASS = "fill-popover stroke-border";

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

interface PositionerContextValue {
  align: Align;
  side: Side;
  sideOffset: number;
}

const PositionerContext = createContext<PositionerContextValue>({
  align: "center",
  side: "bottom",
  sideOffset: 8,
});

/** Preview card root — maps `delay` to Radix `openDelay`. */
export const PreviewCardRoot = ({ delay, ...props }: PreviewCardRootProps) => (
  <PreviewCardPrimitive.Root openDelay={delay} {...props} />
);

export const PreviewCardTrigger = (props: PreviewCardTriggerProps) => (
  <PreviewCardPrimitive.Trigger data-slot="preview-card-trigger" {...props} />
);

export const PreviewCardPortal = ({ children }: PreviewCardPortalProps) => (
  <PreviewCardPrimitive.Portal>{children}</PreviewCardPrimitive.Portal>
);

/**
 * Radix positions inside `Content`; the Positioner just carries side / align /
 * offset so the compound tree matches the Base UI twin.
 */
export const PreviewCardPositioner = ({
  align = "center",
  children,
  side = "bottom",
  sideOffset = 8,
}: PreviewCardPositionerProps) => (
  <PositionerContext.Provider value={{ align, side, sideOffset }}>
    {children}
  </PositionerContext.Provider>
);

/** Animated card surface — Motion fade/scale from `OVERLAY_*`. */
export const PreviewCardPopup = ({
  children,
  className,
  ...props
}: PreviewCardPopupProps) => {
  const shouldReduceMotion = useReducedMotion();
  const motionProps = overlayMotion(shouldReduceMotion);
  const { align, side, sideOffset } = useContext(PositionerContext);

  return (
    <PreviewCardPrimitive.Content
      align={align}
      asChild
      data-slot="preview-card-popup"
      side={side}
      sideOffset={sideOffset}
      {...props}
    >
      <motion.div
        animate={motionProps.animate}
        className={cn("z-50", POPUP_CLASS, className)}
        initial={motionProps.initial}
        transition={motionProps.transition}
      >
        {children}
      </motion.div>
    </PreviewCardPrimitive.Content>
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
    return <PreviewCardTrigger asChild>{trigger}</PreviewCardTrigger>;
  }
  return <PreviewCardTrigger>{trigger}</PreviewCardTrigger>;
};

/**
 * SmoothUI Preview Card — Radix twin.
 * Same public props as the Base UI twin; headless via `radix-ui` HoverCard.
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
