"use client";

import { cn } from "@repo/smoothui-utils";
import { motion, useReducedMotion } from "motion/react";
import { Tabs as TabsPrimitive } from "radix-ui";
import {
  type ComponentProps,
  createContext,
  type ReactNode,
  useContext,
  useLayoutEffect,
  useState,
} from "react";
import { DURATION, EASE_OUT } from "../../lib/animation";
import {
  activeTabIndicatorStyle,
  TabsMeasureValueContext,
  useActiveTabIndicatorBox,
} from "./use-active-tab-indicator";

export type TabsVariant = "underline" | "pill" | "segment";

export type TabsRootProps = Omit<
  ComponentProps<typeof TabsPrimitive.Root>,
  "orientation"
> & {
  className?: string;
  children?: ReactNode;
};

export type TabsListProps = ComponentProps<typeof TabsPrimitive.List> & {
  variant?: TabsVariant;
  className?: string;
  children?: ReactNode;
  /** Maps to Radix Root `activationMode`. Not forwarded to the DOM. */
  activateOnFocus?: boolean;
};

export type TabsTabProps = ComponentProps<typeof TabsPrimitive.Trigger> & {
  className?: string;
  children?: ReactNode;
};

export type TabsPanelProps = ComponentProps<typeof TabsPrimitive.Content> & {
  animated?: boolean;
  className?: string;
  children?: ReactNode;
};

export type TabsIndicatorProps = ComponentProps<"span">;

export type TabsProps = TabsRootProps;

const TabsVariantContext = createContext<TabsVariant>("underline");
const TabsActivationContext = createContext<
  ((mode: "automatic" | "manual") => void) | null
>(null);

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
    "data-[disabled]:pointer-events-none data-[disabled]:text-muted-foreground data-[state=active]:text-foreground",
    variant === "underline" && "rounded-t-md",
    variant === "pill" && "rounded-full",
    variant === "segment" && "min-w-0 flex-1 rounded-md"
  );

const indicatorStyles = (variant: TabsVariant, reduceMotion: boolean) =>
  cn(
    "pointer-events-none absolute top-0 left-0 z-0",
    reduceMotion
      ? "transition-none"
      : "transition-[transform,width,height] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]",
    variant === "underline" && "bg-brand",
    variant === "pill" &&
      "rounded-full border border-foreground/15 bg-background shadow-sm dark:bg-foreground/15",
    variant === "segment" &&
      "rounded-md border border-foreground/15 bg-background shadow-sm dark:bg-foreground/15"
  );

/**
 * SmoothUI Tabs — Radix twin.
 * Same public API as Base. Indicator is a sibling measured from the active tab.
 */
const TabsRoot = ({
  className,
  value,
  defaultValue,
  onValueChange,
  children,
  activationMode: activationModeProp,
  ...props
}: TabsRootProps) => {
  const [listActivationMode, setListActivationMode] = useState<
    "automatic" | "manual"
  >("manual");
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const current = value === undefined ? uncontrolled : value;
  const activationMode = activationModeProp ?? listActivationMode;

  return (
    <TabsMeasureValueContext.Provider value={current}>
      <TabsActivationContext.Provider value={setListActivationMode}>
        <TabsPrimitive.Root
          className={cn("flex w-full min-w-0 flex-col", className)}
          data-slot="tabs"
          defaultValue={defaultValue}
          onValueChange={(next) => {
            if (value === undefined) {
              setUncontrolled(next);
            }
            onValueChange?.(next);
          }}
          value={value}
          {...props}
          activationMode={activationMode}
        >
          {children}
        </TabsPrimitive.Root>
      </TabsActivationContext.Provider>
    </TabsMeasureValueContext.Provider>
  );
};

const TabsList = ({
  className,
  variant = "underline",
  children,
  activateOnFocus = false,
  ...props
}: TabsListProps) => {
  const setActivationMode = useContext(TabsActivationContext);
  const mode = activateOnFocus ? "automatic" : "manual";

  useLayoutEffect(() => {
    setActivationMode?.(mode);
  }, [mode, setActivationMode]);

  return (
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
};

const TabsTab = ({ className, children, value, ...props }: TabsTabProps) => {
  const variant = useContext(TabsVariantContext);

  return (
    <TabsPrimitive.Trigger
      className={cn(tabStyles(variant), className)}
      data-slot="tabs-tab"
      value={value}
      {...props}
    >
      {children}
    </TabsPrimitive.Trigger>
  );
};

const TabsPanel = ({
  className,
  animated = false,
  children,
  ...props
}: TabsPanelProps) => {
  const shouldReduceMotion = useReducedMotion();
  const panelClassName = cn(
    "min-w-0 pt-4 text-muted-foreground text-sm leading-relaxed outline-none",
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    className
  );

  if (!animated || shouldReduceMotion) {
    return (
      <TabsPrimitive.Content
        className={panelClassName}
        data-slot="tabs-panel"
        {...props}
      >
        {children}
      </TabsPrimitive.Content>
    );
  }

  // Radix unmounts the inactive panel, so only the incoming one needs a fade.
  // It is done with Motion because the registry ships no CSS keyframes (the
  // old `animate-in` utilities were never defined, so nothing animated).
  return (
    <TabsPrimitive.Content asChild data-slot="tabs-panel" {...props}>
      <motion.div
        animate={{ opacity: 1 }}
        className={panelClassName}
        initial={{ opacity: 0 }}
        transition={{ duration: DURATION.default, ease: EASE_OUT }}
      >
        {children}
      </motion.div>
    </TabsPrimitive.Content>
  );
};

const TabsIndicator = ({ className, style, ...props }: TabsIndicatorProps) => {
  const variant = useContext(TabsVariantContext);
  const shouldReduceMotion = useReducedMotion();
  const { box, ref } = useActiveTabIndicatorBox();

  return (
    <span
      aria-hidden="true"
      className={cn(indicatorStyles(variant, !!shouldReduceMotion), className)}
      data-slot="tabs-indicator"
      ref={ref}
      role="presentation"
      style={{ ...activeTabIndicatorStyle(variant, box), ...style }}
      {...props}
    />
  );
};

export { TabsIndicator, TabsList, TabsPanel, TabsRoot, TabsTab };

export default TabsRoot;
