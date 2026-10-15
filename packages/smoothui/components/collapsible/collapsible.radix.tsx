"use client";

import { cn } from "@repo/smoothui-utils";
import { ChevronDown } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Collapsible as CollapsiblePrimitive } from "radix-ui";
import type { ComponentProps, ReactNode } from "react";
import { DURATION, DURATION_INSTANT, EASE_OUT } from "../../lib/animation";

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

type CollapsibleSurfaceProps = ComponentProps<typeof motion.div> & {
  "data-state"?: string;
};

/**
 * Height surface. Radix hands `data-state` to the child through `asChild`, so
 * the open state needs no extra context. The surface animates height between
 * 0 and "auto" with Motion; the closed panel is also `inert` and `aria-hidden`
 * and turns `visibility: hidden` once the close finishes, so it leaves the
 * a11y tree and the tab order.
 */
const CollapsibleSurface = ({
  "data-state": state,
  ...props
}: CollapsibleSurfaceProps) => {
  const shouldReduceMotion = useReducedMotion();
  const isOpen = state === "open";
  return (
    <motion.div
      {...props}
      animate={{
        height: isOpen ? "auto" : 0,
        opacity: isOpen ? 1 : 0,
        visibility: isOpen ? "visible" : "hidden",
      }}
      aria-hidden={isOpen ? undefined : true}
      data-state={state}
      inert={!isOpen}
      initial={false}
      transition={
        shouldReduceMotion
          ? DURATION_INSTANT
          : { duration: DURATION.default, ease: EASE_OUT }
      }
    />
  );
};

const CollapsiblePanel = ({
  className,
  children,
  ...props
}: CollapsiblePanelProps) => (
  <CollapsiblePrimitive.Content
    asChild
    data-slot="collapsible-panel"
    forceMount
    {...props}
  >
    <CollapsibleSurface
      className={cn("overflow-hidden text-muted-foreground text-sm", className)}
    >
      <div className="space-y-1 px-4 pt-1 pb-4 leading-relaxed">{children}</div>
    </CollapsibleSurface>
  </CollapsiblePrimitive.Content>
);

export { CollapsiblePanel, CollapsibleRoot, CollapsibleTrigger };

export default CollapsibleRoot;
