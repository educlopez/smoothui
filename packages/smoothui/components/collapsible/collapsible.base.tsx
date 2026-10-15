"use client";

import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";
import { cn } from "@repo/smoothui-utils";
import { ChevronDown } from "lucide-react";
import { useReducedMotion } from "motion/react";
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
  typeof CollapsiblePrimitive.Panel
> & {
  className?: string;
  children?: ReactNode;
};

/** Convenience alias for AutoTypeTable */
export type CollapsibleProps = CollapsibleRootProps;

const PANEL_EASE = "ease-[cubic-bezier(0.23,1,0.32,1)]";

/**
 * SmoothUI Collapsible — Base UI twin (default).
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
        "data-disabled:pointer-events-none data-disabled:text-muted-foreground",
        "data-panel-open:border-border",
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
              : `transition-transform duration-200 ${PANEL_EASE}`,
            "group-data-panel-open:rotate-180"
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
  return (
    <CollapsiblePrimitive.Panel
      className={cn(
        "h-[var(--collapsible-panel-height)] overflow-hidden text-muted-foreground text-sm",
        shouldReduceMotion
          ? "data-ending-style:h-0 data-starting-style:h-0 [&[hidden]:not([hidden='until-found'])]:hidden"
          : `transition-[height,opacity] duration-200 ${PANEL_EASE} data-ending-style:h-0 data-starting-style:h-0 data-ending-style:opacity-0 data-starting-style:opacity-0 [&[hidden]:not([hidden='until-found'])]:hidden`,
        className
      )}
      data-slot="collapsible-panel"
      {...props}
    >
      <div className="space-y-1 px-4 pt-1 pb-4 leading-relaxed">{children}</div>
    </CollapsiblePrimitive.Panel>
  );
};

export { CollapsiblePanel, CollapsibleRoot, CollapsibleTrigger };

export default CollapsibleRoot;
