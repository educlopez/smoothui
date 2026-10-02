"use client";

import { cn } from "@repo/smoothui-utils";
import { ChevronDown } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import type { ComponentProps, ReactNode } from "react";

export type AccordionRootProps = ComponentProps<
  typeof AccordionPrimitive.Root
> & {
  className?: string;
  /** Maps to Radix `type="multiple"` when true */
  multiple?: boolean;
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
  hideChevron?: boolean;
};

export type AccordionPanelProps = ComponentProps<
  typeof AccordionPrimitive.Content
> & {
  className?: string;
  children?: ReactNode;
};

export type AccordionProps = AccordionRootProps;

const PANEL_EASE = "ease-[cubic-bezier(0.23,1,0.32,1)]";

/**
 * SmoothUI Accordion — Radix twin.
 * Same public API as Base; panel uses `--radix-accordion-content-height`.
 */
const AccordionRoot = ({
  className,
  multiple = false,
  type,
  ...props
}: AccordionRootProps) => (
  <AccordionPrimitive.Root
    className={cn(
      "flex w-full min-w-0 flex-col divide-y divide-foreground/15 overflow-hidden rounded-lg border border-foreground/20",
      className
    )}
    data-slot="accordion"
    type={type ?? (multiple ? "multiple" : "single")}
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
        "disabled:pointer-events-none disabled:text-muted-foreground",
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
            "group-data-[state=open]:rotate-180 [[data-state=open]_&]:rotate-180"
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
    <AccordionPrimitive.Content
      className={cn(
        "overflow-hidden text-muted-foreground text-sm",
        shouldReduceMotion
          ? "data-[state=closed]:hidden"
          : cn(
              "data-[state=open]:h-[var(--radix-accordion-content-height)]",
              `transition-[height,opacity] duration-200 ${PANEL_EASE}`,
              "data-[state=closed]:h-0 data-[state=closed]:opacity-0"
            ),
        className
      )}
      data-slot="accordion-panel"
      {...props}
    >
      <div className="px-4 pt-0 pb-4 leading-relaxed">{children}</div>
    </AccordionPrimitive.Content>
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
