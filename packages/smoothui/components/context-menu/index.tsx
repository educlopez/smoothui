"use client";

import { cn } from "@repo/smoothui-utils";
import { ChevronRightIcon } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ContextMenu as ContextMenuPrimitive } from "radix-ui";
import type React from "react";
import {
  type ComponentProps,
  createContext,
  useContext,
  useState,
} from "react";
import { DURATION, EASE_OUT, SPRING_DEFAULT } from "../../lib/animation";

export interface ContextMenuProps {
  /** The trigger element that opens the context menu on right-click */
  children: React.ReactNode;
  /** Optional CSS class for the content container */
  className?: string;
  /** Menu items to render */
  items: ContextMenuItemConfig[];
}

export interface ContextMenuItemConfig {
  /** Nested submenu items */
  children?: ContextMenuItemConfig[];
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Renders a group label instead of an item */
  groupLabel?: string;
  /** Optional icon to display before the label */
  icon?: React.ReactNode;
  /** Unique key for the item */
  key: string;
  /** Display label */
  label: string;
  /** Callback when item is selected */
  onSelect?: () => void;
  /** Renders a separator instead of an item */
  separator?: boolean;
  /** Optional keyboard shortcut text to display */
  shortcut?: string;
  /** Destructive variant styling */
  variant?: "default" | "destructive";
}

/**
 * Surface motion: the bordered Content element itself fades and scales, so the
 * border and fill appear together with the items. Exit runs through
 * AnimatePresence because Radix only waits for CSS animations before unmounting.
 */
const surfaceMotion = (shouldReduceMotion: boolean | null) =>
  shouldReduceMotion
    ? {
        animate: { opacity: 1 },
        exit: { opacity: 0, transition: { duration: 0 } },
        initial: { opacity: 1 },
        transition: { duration: 0 },
      }
    : {
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: {
          opacity: 0,
          scale: 0.95,
          transition: { duration: DURATION.fast, ease: EASE_OUT },
        },
        initial: { opacity: 0, scale: 0.95, y: -4 },
        transition: SPRING_DEFAULT,
      };

const SubOpenContext = createContext(false);

/* ------------------------------------------------------------------ */
/*  Thin radix wrappers (shadcn-parity, no @repo/shadcn-ui)            */
/* ------------------------------------------------------------------ */

const ContextMenuRoot = ({
  ...props
}: ComponentProps<typeof ContextMenuPrimitive.Root>) => (
  <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />
);

const ContextMenuTrigger = ({
  ...props
}: ComponentProps<typeof ContextMenuPrimitive.Trigger>) => (
  <ContextMenuPrimitive.Trigger data-slot="context-menu-trigger" {...props} />
);

const ContextMenuGroup = ({
  ...props
}: ComponentProps<typeof ContextMenuPrimitive.Group>) => (
  <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />
);

const ContextMenuSub = ({
  defaultOpen = false,
  onOpenChange,
  open: openProp,
  ...props
}: ComponentProps<typeof ContextMenuPrimitive.Sub>) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = openProp ?? internalOpen;

  return (
    <SubOpenContext.Provider value={isOpen}>
      <ContextMenuPrimitive.Sub
        data-slot="context-menu-sub"
        onOpenChange={(value) => {
          setInternalOpen(value);
          onOpenChange?.(value);
        }}
        open={isOpen}
        {...props}
      />
    </SubOpenContext.Provider>
  );
};

const ContextMenuSubTrigger = ({
  className,
  children,
  ...props
}: ComponentProps<typeof ContextMenuPrimitive.SubTrigger>) => (
  <ContextMenuPrimitive.SubTrigger
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-hidden focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[inset]:pl-8 data-[state=open]:text-accent-foreground [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0",
      className
    )}
    data-slot="context-menu-sub-trigger"
    {...props}
  >
    {children}
    <ChevronRightIcon className="ml-auto size-4" />
  </ContextMenuPrimitive.SubTrigger>
);

const ContextMenuSubContent = ({
  className,
  children,
  ...props
}: ComponentProps<typeof ContextMenuPrimitive.SubContent>) => {
  const shouldReduceMotion = useReducedMotion();
  const motionProps = surfaceMotion(shouldReduceMotion);
  const isOpen = useContext(SubOpenContext);

  return (
    <AnimatePresence>
      {isOpen ? (
        <ContextMenuPrimitive.SubContent
          asChild
          data-slot="context-menu-sub-content"
          forceMount
          key="sub-content"
          {...props}
        >
          <motion.div
            animate={motionProps.animate}
            className={cn(
              "z-50 min-w-[8rem] origin-(--radix-context-menu-content-transform-origin) overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg",
              className
            )}
            exit={motionProps.exit}
            initial={motionProps.initial}
            transition={motionProps.transition}
          >
            {children}
          </motion.div>
        </ContextMenuPrimitive.SubContent>
      ) : null}
    </AnimatePresence>
  );
};

const ContextMenuContent = ({
  className,
  children,
  ...props
}: ComponentProps<typeof ContextMenuPrimitive.Content>) => {
  const shouldReduceMotion = useReducedMotion();
  const motionProps = surfaceMotion(shouldReduceMotion);

  return (
    <ContextMenuPrimitive.Portal forceMount>
      <ContextMenuPrimitive.Content
        asChild
        data-slot="context-menu-content"
        forceMount
        {...props}
      >
        <motion.div
          animate={motionProps.animate}
          className={cn(
            "z-50 max-h-(--radix-context-menu-content-available-height) min-w-[8rem] origin-(--radix-context-menu-content-transform-origin) overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
            className
          )}
          exit={motionProps.exit}
          initial={motionProps.initial}
          transition={motionProps.transition}
        >
          {children}
        </motion.div>
      </ContextMenuPrimitive.Content>
    </ContextMenuPrimitive.Portal>
  );
};

const ContextMenuItem = ({
  className,
  variant = "default",
  ...props
}: ComponentProps<typeof ContextMenuPrimitive.Item> & {
  variant?: "default" | "destructive";
}) => (
  <ContextMenuPrimitive.Item
    className={cn(
      "data-[variant=destructive]:*:[svg]:!text-destructive relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[inset]:pl-8 data-[variant=destructive]:text-destructive data-[disabled]:opacity-50 data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0",
      className
    )}
    data-slot="context-menu-item"
    data-variant={variant}
    {...props}
  />
);

const ContextMenuLabel = ({
  className,
  ...props
}: ComponentProps<typeof ContextMenuPrimitive.Label>) => (
  <ContextMenuPrimitive.Label
    className={cn("px-2 py-1.5 font-medium text-foreground text-sm", className)}
    data-slot="context-menu-label"
    {...props}
  />
);

const ContextMenuSeparator = ({
  className,
  ...props
}: ComponentProps<typeof ContextMenuPrimitive.Separator>) => (
  <ContextMenuPrimitive.Separator
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    data-slot="context-menu-separator"
    {...props}
  />
);

const ContextMenuShortcut = ({
  className,
  ...props
}: ComponentProps<"span">) => (
  <span
    className={cn(
      "ml-auto text-muted-foreground text-xs tracking-widest",
      className
    )}
    data-slot="context-menu-shortcut"
    {...props}
  />
);

export default function ContextMenu({
  children,
  items,
  className,
}: ContextMenuProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);

  const renderItem = (item: ContextMenuItemConfig, index: number) => {
    if (item.separator) {
      return <ContextMenuSeparator key={item.key} />;
    }

    if (item.groupLabel) {
      return (
        <ContextMenuLabel key={item.key}>{item.groupLabel}</ContextMenuLabel>
      );
    }

    if (item.children && item.children.length > 0) {
      return (
        <ContextMenuSub key={item.key}>
          <ContextMenuSubTrigger disabled={item.disabled}>
            {item.icon ? <span className="mr-2">{item.icon}</span> : null}
            {item.label}
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            {item.children.map((child, childIndex) =>
              renderItem(child, childIndex)
            )}
          </ContextMenuSubContent>
        </ContextMenuSub>
      );
    }

    return (
      <motion.div
        animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -4 }}
        key={item.key}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { ...SPRING_DEFAULT, delay: index * 0.02 }
        }
      >
        <ContextMenuItem
          disabled={item.disabled}
          onSelect={item.onSelect}
          variant={item.variant}
        >
          {item.icon ? <span className="mr-2">{item.icon}</span> : null}
          {item.label}
          {item.shortcut ? (
            <ContextMenuShortcut>{item.shortcut}</ContextMenuShortcut>
          ) : null}
        </ContextMenuItem>
      </motion.div>
    );
  };

  return (
    <ContextMenuRoot onOpenChange={setIsOpen}>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <AnimatePresence>
        {isOpen ? (
          <ContextMenuContent
            className={cn("origin-top", className)}
            key="content"
          >
            <ContextMenuGroup>
              {items.map((item, index) => renderItem(item, index))}
            </ContextMenuGroup>
          </ContextMenuContent>
        ) : null}
      </AnimatePresence>
    </ContextMenuRoot>
  );
}
