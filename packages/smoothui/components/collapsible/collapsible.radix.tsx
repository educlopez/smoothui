"use client";

import { cn } from "@repo/smoothui-utils";
import { ChevronDown } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { Collapsible as CollapsiblePrimitive } from "radix-ui";
import type { ComponentProps, ReactNode } from "react";

export type CollapsibleRootProps = ComponentProps<
  typeof CollapsiblePrimitive.Root
> & {
  className?: string;
};

export type CollapsibleTriggerProps = ComponentProps<
  typeof CollapsiblePrimitive.Trigger
> & {
  className?: string;
  children?: ReactNode;
  hideChevron?: boolean;
};

export type CollapsiblePanelProps = ComponentProps<
  typeof CollapsiblePrimitive.Content
> & {
  className?: string;
  children?: ReactNode;
};

export type CollapsibleProps = CollapsibleRootProps;

const PANEL_EASE = "ease-[cubic-bezier(0.23,1,0.32,1)]";

/**
 * SmoothUI Collapsible — Radix twin.
 * Single bordered card: open/close never changes outer width.
 */
const CollapsibleRoot = ({ className, ...props }: CollapsibleRootProps) => (
  <CollapsiblePrimitive.Root
    className={cn(
      "flex w-full min-w-0 flex-col overflow-hidden rounded-lg border border-foreground/20 bg-background",
      className
    )}
    data-slot="collapsible"
    {...props}
  />
);

const CollapsibleTrigger = ({
  className,
  children,
  hideChevron = false,
  ...props
}: CollapsibleTriggerProps) => {
  const shouldReduceMotion = useReducedMotion();
  return (
    <CollapsiblePrimitive.Trigger
      className={cn(
        "group flex w-full min-w-0 select-none items-center justify-between gap-3 border-border border-transparent border-b bg-transparent px-4 py-3 text-left font-medium text-sm outline-none",
        "hover:bg-foreground/5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
        "disabled:pointer-events-none disabled:text-muted-foreground",
        "data-[state=open]:border-border",
        "data-[state=open]:[&_svg]:rotate-180",
        className
      )}
      data-slot="collapsible-trigger"
      {...props}
    >
      <span className="min-w-0 flex-1">{children}</span>
      {hideChevron ? null : (
        <ChevronDown
          aria-hidden
          className={cn(
            "size-4 shrink-0 text-muted-foreground",
            shouldReduceMotion
              ? "transition-none"
              : `transition-transform duration-200 ${PANEL_EASE}`
          )}
        />
      )}
    </CollapsiblePrimitive.Trigger>
  );
};

const CollapsiblePanel = ({
  className,
  children,
  ...props
}: CollapsiblePanelProps) => {
  const shouldReduceMotion = useReducedMotion();
  // Radix unmounts on close unless a CSS animation runs, so a height transition
  // never plays. forceMount keeps the panel in the tree; `invisible` (animated
  // through the transition) removes it from the a11y tree and tab order once
  // the close finishes.
  return (
    <CollapsiblePrimitive.Content
      className={cn(
        "overflow-hidden text-muted-foreground text-sm",
        shouldReduceMotion
          ? "data-[state=closed]:hidden"
          : cn(
              "data-[state=open]:h-[var(--radix-collapsible-content-height)]",
              `transition-[height,opacity,visibility] duration-200 ${PANEL_EASE}`,
              "data-[state=closed]:invisible data-[state=closed]:h-0 data-[state=closed]:opacity-0"
            ),
        className
      )}
      data-slot="collapsible-panel"
      forceMount
      {...props}
    >
      <div className="space-y-1 px-4 pt-1 pb-4 leading-relaxed">{children}</div>
    </CollapsiblePrimitive.Content>
  );
};

export { CollapsiblePanel, CollapsibleRoot, CollapsibleTrigger };

export default CollapsibleRoot;
