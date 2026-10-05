"use client";

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import { cn } from "@repo/smoothui-utils";
import {
  type ComponentProps,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useState,
} from "react";

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
  "z-50 origin-[var(--transform-origin)] rounded-md bg-foreground px-3 py-1.5 text-background text-xs shadow-md outline-none transition-[opacity,transform] duration-150 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0";

type TriggerComponent = (props: {
  children?: ReactNode;
  delay?: number;
  render?: ReactElement;
}) => ReactElement | null;

const renderTrigger = (
  Trigger: TriggerComponent,
  trigger: ReactNode,
  delay?: number
) => {
  if (isValidElement(trigger)) {
    return <Trigger delay={delay} render={trigger as ReactElement} />;
  }
  return <Trigger delay={delay}>{trigger}</Trigger>;
};

export const TooltipProvider = ({
  delay = DEFAULT_DELAY,
  ...props
}: ComponentProps<typeof TooltipPrimitive.Provider>) => (
  <TooltipPrimitive.Provider delay={delay} {...props} />
);

export const TooltipTrigger = TooltipPrimitive.Trigger;

/**
 * Tooltip content — Portal + Positioner + Popup.
 * CSS enter/exit via Base UI starting/ending styles (no Motion — Popup
 * must receive Base UI's open styles or it stays `display: none`).
 */
export const TooltipContent = ({
  className,
  side = "top",
  sideOffset = 4,
  children,
}: TooltipContentProps) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Positioner
      className="outline-none"
      side={side}
      sideOffset={sideOffset}
    >
      <TooltipPrimitive.Popup
        className={cn(POPUP_CLASS, className)}
        data-slot="tooltip-content"
      >
        {children}
      </TooltipPrimitive.Popup>
    </TooltipPrimitive.Positioner>
  </TooltipPrimitive.Portal>
);

/**
 * SmoothUI Tooltip — Base UI twin (default).
 * Convenience wraps Provider + Root + Trigger + Content.
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
    <TooltipProvider delay={delay}>
      <TooltipPrimitive.Root onOpenChange={handleOpenChange} open={isOpen}>
        {renderTrigger(TooltipPrimitive.Trigger, children, delay)}
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
