"use client";

import { cn } from "@repo/smoothui-utils";
import { motion, useReducedMotion } from "motion/react";
import { Tabs as TabsPrimitive } from "radix-ui";
import {
  type ComponentProps,
  createContext,
  type ReactNode,
  useContext,
  useId,
  useState,
} from "react";
import { DURATION, EASE_OUT, SPRING_DEFAULT } from "../../lib/animation";
import type { TabsVariant } from "./tabs.base";

export type { TabsVariant } from "./tabs.base";

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

export type TabsIndicatorProps = {
  className?: string;
};

export type TabsProps = TabsRootProps;

const TabsVariantContext = createContext<TabsVariant>("underline");
const TabsValueContext = createContext<string>("");
const TabsLayoutIdContext = createContext<string>("tabs-indicator");

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

const indicatorStyles = (variant: TabsVariant) =>
  cn(
    "absolute z-0",
    variant === "underline" && "right-0 -bottom-px left-0 h-0.5 bg-brand",
    variant === "pill" &&
      "inset-0 rounded-full border border-foreground/15 bg-background shadow-sm dark:bg-foreground/15",
    variant === "segment" &&
      "inset-0 rounded-md border border-foreground/15 bg-background shadow-sm dark:bg-foreground/15"
  );

/**
 * SmoothUI Tabs — Radix twin.
 * Same public API as Base; indicator uses Motion layoutId (Radix has no Indicator).
 */
const TabsRoot = ({
  className,
  value,
  defaultValue,
  onValueChange,
  children,
  ...props
}: TabsRootProps) => {
  const layoutId = useId();
  const [uncontrolled, setUncontrolled] = useState(() => defaultValue ?? "");
  const current = value ?? uncontrolled;

  return (
    <TabsLayoutIdContext.Provider value={`tabs-ind-${layoutId}`}>
      <TabsValueContext.Provider value={String(current)}>
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
        >
          {children}
        </TabsPrimitive.Root>
      </TabsValueContext.Provider>
    </TabsLayoutIdContext.Provider>
  );
};

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

const TabsTab = ({ className, children, value, ...props }: TabsTabProps) => {
  const variant = useContext(TabsVariantContext);
  const active = useContext(TabsValueContext);
  const layoutId = useContext(TabsLayoutIdContext);
  const shouldReduceMotion = useReducedMotion();
  const isActive = String(value) === active;

  return (
    <TabsPrimitive.Trigger
      className={cn(tabStyles(variant), className)}
      data-slot="tabs-tab"
      value={value}
      {...props}
    >
      {isActive ? (
        <motion.span
          className={indicatorStyles(variant)}
          layoutId={layoutId}
          style={{ position: "absolute" }}
          transition={shouldReduceMotion ? { duration: 0 } : SPRING_DEFAULT}
        />
      ) : null}
      <span className="relative z-10">{children}</span>
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

/** No-op on Radix — indicator is rendered inside active TabsTab via layoutId. */
const TabsIndicator = (_props: TabsIndicatorProps) => null;

export { TabsIndicator, TabsList, TabsPanel, TabsRoot, TabsTab };

export default TabsRoot;
