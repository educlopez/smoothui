"use client";

import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { cn } from "@repo/smoothui-utils";
import { ChevronDown } from "lucide-react";
import { useReducedMotion } from "motion/react";
import type { ComponentProps, ReactNode } from "react";

export type AccordionRootProps = ComponentProps<
  typeof AccordionPrimitive.Root
> & {
  className?: string;
};

export type AccordionItemProps = ComponentProps<
  typeof AccordionPrimitive.Item
> & {
  className?: string;
};

export type AccordionHeaderProps = ComponentProps<
  typeof AccordionPrimitive.Header
> & {
  className?: string;
};

export type AccordionTriggerProps = ComponentProps<
  typeof AccordionPrimitive.Trigger
> & {
  className?: string;
  children?: ReactNode;
  /** Hide the chevron icon */
  hideChevron?: boolean;
};

export type AccordionPanelProps = ComponentProps<
  typeof AccordionPrimitive.Panel
> & {
  className?: string;
  children?: ReactNode;
};

/** Convenience alias for AutoTypeTable */
export type AccordionProps = AccordionRootProps;

const PANEL_EASE = "ease-[cubic-bezier(0.23,1,0.32,1)]";

/**
 * SmoothUI Accordion — Base UI twin (default).
 * Root keeps a stable width (`overflow-hidden`); panel height via CSS vars.
 */
const AccordionRoot = ({ className, ...props }: AccordionRootProps) => (
  <AccordionPrimitive.Root
    className={cn(
      "flex w-full min-w-0 flex-col divide-y divide-foreground/15 overflow-hidden rounded-lg border border-foreground/20",
      className
    )}
    data-slot="accordion"
    {...props}
  />
);

const AccordionItem = ({ className, ...props }: AccordionItemProps) => (
  <AccordionPrimitive.Item
    className={cn("group min-w-0 overflow-hidden", className)}
    data-slot="accordion-item"
    {...props}
  />
);

const AccordionHeader = ({ className, ...props }: AccordionHeaderProps) => (
  <AccordionPrimitive.Header
    className={cn("m-0 flex w-full min-w-0", className)}
    data-slot="accordion-header"
    {...props}
  />
);

const AccordionTrigger = ({
  className,
  children,
  hideChevron = false,
  ...props
}: AccordionTriggerProps) => {
  const shouldReduceMotion = useReducedMotion();
  return (
    <AccordionPrimitive.Trigger
      className={cn(
        "group flex w-full min-w-0 select-none items-center justify-between gap-3 bg-transparent px-4 py-3.5 text-left font-medium text-sm outline-none",
        "hover:bg-foreground/5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
        "data-disabled:pointer-events-none data-disabled:text-muted-foreground",
        className
      )}
      data-slot="accordion-trigger"
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
    </AccordionPrimitive.Trigger>
  );
};

const AccordionPanel = ({
  className,
  children,
  ...props
}: AccordionPanelProps) => {
  const shouldReduceMotion = useReducedMotion();
  return (
    <AccordionPrimitive.Panel
      className={cn(
        "h-[var(--accordion-panel-height)] overflow-hidden text-muted-foreground text-sm",
        shouldReduceMotion
          ? "data-ending-style:h-0 data-starting-style:h-0"
          : `transition-[height,opacity] duration-200 ${PANEL_EASE} data-ending-style:h-0 data-starting-style:h-0 data-ending-style:opacity-0 data-starting-style:opacity-0`,
        className
      )}
      data-slot="accordion-panel"
      {...props}
    >
      <div className="px-4 pt-0 pb-4 leading-relaxed">{children}</div>
    </AccordionPrimitive.Panel>
  );
};

export {
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionRoot,
  AccordionTrigger,
};

export default AccordionRoot;
