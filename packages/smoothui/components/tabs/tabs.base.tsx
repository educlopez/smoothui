"use client";

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cn } from "@repo/smoothui-utils";
import { useReducedMotion } from "motion/react";
import { type ComponentProps, createContext, useContext } from "react";

export type TabsVariant = "underline" | "pill" | "segment";

export type TabsRootProps = ComponentProps<typeof TabsPrimitive.Root> & {
  className?: string;
};

export type TabsListProps = ComponentProps<typeof TabsPrimitive.List> & {
  /** Visual style for the list + indicator */
  variant?: TabsVariant;
  className?: string;
};

export type TabsTabProps = ComponentProps<typeof TabsPrimitive.Tab> & {
  className?: string;
};

export type TabsPanelProps = ComponentProps<typeof TabsPrimitive.Panel> & {
  /** Crossfade panels with opacity when true */
  animated?: boolean;
  className?: string;
};

export type TabsIndicatorProps = ComponentProps<
  typeof TabsPrimitive.Indicator
> & {
  className?: string;
};

/** Convenience alias for AutoTypeTable / default root */
export type TabsProps = TabsRootProps;

const TabsVariantContext = createContext<TabsVariant>("underline");

const listStyles = (variant: TabsVariant) =>
  cn(
    "relative flex min-w-0",
    variant === "underline" && "w-full gap-1 border-border border-b",
    variant === "pill" && "w-fit gap-1 rounded-full bg-foreground/10 p-1",
    variant === "segment" && "w-full gap-0 rounded-lg bg-foreground/10 p-1"
  );

const tabStyles = (variant: TabsVariant) =>
  cn(
    "relative z-10 inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-2 px-4 py-2.5 font-medium text-sm outline-none",
    "text-muted-foreground transition-colors hover:text-foreground",
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "data-disabled:pointer-events-none data-active:text-foreground data-disabled:text-muted-foreground",
    variant === "underline" && "rounded-t-md",
    variant === "pill" && "rounded-full",
    variant === "segment" && "min-w-0 flex-1 rounded-md"
  );

const indicatorStyles = (variant: TabsVariant, reduceMotion: boolean) =>
  cn(
    "absolute z-0",
    "w-[var(--active-tab-width)] translate-x-[var(--active-tab-left)]",
    reduceMotion
      ? "transition-none"
      : "transition-[translate,width,height,top] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]",
    variant === "underline" && "top-auto bottom-0 h-0.5 translate-y-0 bg-brand",
    variant === "pill" &&
      "top-[var(--active-tab-top)] h-[var(--active-tab-height)] rounded-full border border-foreground/15 bg-background shadow-sm dark:bg-foreground/15",
    variant === "segment" &&
      "top-[var(--active-tab-top)] h-[var(--active-tab-height)] rounded-md border border-foreground/15 bg-background shadow-sm dark:bg-foreground/15"
  );

/**
 * SmoothUI Tabs — Base UI twin (default).
 * Compound: TabsRoot, TabsList (variant), TabsTab, TabsPanel, TabsIndicator.
 */
const TabsRoot = ({ className, ...props }: TabsRootProps) => (
  <TabsPrimitive.Root
    className={cn("flex w-full min-w-0 flex-col", className)}
    data-slot="tabs"
    {...props}
  />
);

const TabsList = ({
  className,
  variant = "underline",
  children,
  ...props
}: TabsListProps) => (
  <TabsVariantContext.Provider value={variant}>
    <TabsPrimitive.List
      className={cn(listStyles(variant), className)}
      data-slot="tabs-list"
      {...props}
    >
      {children}
    </TabsPrimitive.List>
  </TabsVariantContext.Provider>
);

const TabsTab = ({ className, ...props }: TabsTabProps) => {
  const variant = useContext(TabsVariantContext);
  return (
    <TabsPrimitive.Tab
      className={cn(tabStyles(variant), className)}
      data-slot="tabs-tab"
      {...props}
    />
  );
};

const TabsPanel = ({
  className,
  animated = false,
  ...props
}: TabsPanelProps) => {
  const shouldReduceMotion = useReducedMotion();
  return (
    <TabsPrimitive.Panel
      className={cn(
        "min-w-0 pt-4 text-muted-foreground text-sm leading-relaxed outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        // The outgoing panel leaves the layout the moment it starts to exit;
        // until then it sits in the flow next to the incoming one for a frame.
        "data-ending-style:hidden",
        // Fade in only. Fading the outgoing panel out keeps it in the flow next
        // to the incoming one for the whole transition, so the pair stacks and
        // the tab list and everything below it jump by a panel's height.
        animated &&
          (shouldReduceMotion
            ? "data-starting-style:opacity-0"
            : "transition-opacity duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] data-starting-style:opacity-0"),
        className
      )}
      data-slot="tabs-panel"
      {...props}
    />
  );
};

const TabsIndicator = ({ className, ...props }: TabsIndicatorProps) => {
  const variant = useContext(TabsVariantContext);
  const shouldReduceMotion = useReducedMotion();
  return (
    <TabsPrimitive.Indicator
      className={cn(indicatorStyles(variant, !!shouldReduceMotion), className)}
      data-slot="tabs-indicator"
      renderBeforeHydration
      {...props}
    />
  );
};

export { TabsIndicator, TabsList, TabsPanel, TabsRoot, TabsTab };

export default TabsRoot;
