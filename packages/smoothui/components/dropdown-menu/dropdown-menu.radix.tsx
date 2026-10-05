"use client";

import { cn } from "@repo/smoothui-utils";
import { ChevronRightIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import type React from "react";
import { type ComponentProps, useState } from "react";
import { SPRING_DEFAULT } from "../../lib/animation";

export interface DropdownMenuProps {
  /** Alignment of the dropdown relative to the trigger */
  align?: "start" | "center" | "end";
  /** The trigger element that opens the menu */
  children: React.ReactNode;
  /** Optional CSS class for the content container */
  className?: string;
  /** Menu items to render */
  items: DropdownMenuItemConfig[];
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Controlled open state */
  open?: boolean;
  /** Side offset for the dropdown content */
  sideOffset?: number;
}

export interface DropdownMenuItemConfig {
  /** Nested submenu items */
  children?: DropdownMenuItemConfig[];
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

/* ------------------------------------------------------------------ */
/*  Thin radix wrappers (shadcn-parity, no @repo/shadcn-ui)            */
/* ------------------------------------------------------------------ */

const DropdownMenuRoot = ({
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Root>) => (
  <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />
);

const DropdownMenuTrigger = ({
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Trigger>) => (
  <DropdownMenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />
);

const DropdownMenuContent = ({
  className,
  sideOffset = 4,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Content>) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      className={cn(
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=closed]:animate-out data-[state=open]:animate-in",
        className
      )}
      data-slot="dropdown-menu-content"
      sideOffset={sideOffset}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
);

const DropdownMenuGroup = ({
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Group>) => (
  <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
);

const DropdownMenuItem = ({
  className,
  variant = "default",
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  variant?: "default" | "destructive";
}) => (
  <DropdownMenuPrimitive.Item
    className={cn(
      "data-[variant=destructive]:*:[svg]:!text-destructive relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[inset]:pl-8 data-[variant=destructive]:text-destructive data-[disabled]:opacity-50 data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0",
      className
    )}
    data-slot="dropdown-menu-item"
    data-variant={variant}
    {...props}
  />
);

const DropdownMenuLabel = ({
  className,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Label>) => (
  <DropdownMenuPrimitive.Label
    className={cn("px-2 py-1.5 font-medium text-sm", className)}
    data-slot="dropdown-menu-label"
    {...props}
  />
);

const DropdownMenuSeparator = ({
  className,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Separator>) => (
  <DropdownMenuPrimitive.Separator
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    data-slot="dropdown-menu-separator"
    {...props}
  />
);

const DropdownMenuShortcut = ({
  className,
  ...props
}: ComponentProps<"span">) => (
  <span
    className={cn(
      "ml-auto text-muted-foreground text-xs tracking-widest",
      className
    )}
    data-slot="dropdown-menu-shortcut"
    {...props}
  />
);

const DropdownMenuSub = ({
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Sub>) => (
  <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />
);

const DropdownMenuSubTrigger = ({
  className,
  children,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.SubTrigger>) => (
  <DropdownMenuPrimitive.SubTrigger
    className={cn(
      "flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[inset]:pl-8 data-[state=open]:text-accent-foreground [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0",
      className
    )}
    data-slot="dropdown-menu-sub-trigger"
    {...props}
  >
    {children}
    <ChevronRightIcon className="ml-auto size-4" />
  </DropdownMenuPrimitive.SubTrigger>
);

const DropdownMenuSubContent = ({
  className,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.SubContent>) => (
  <DropdownMenuPrimitive.SubContent
    className={cn(
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=closed]:animate-out data-[state=open]:animate-in",
      className
    )}
    data-slot="dropdown-menu-sub-content"
    {...props}
  />
);

/**
 * SmoothUI DropdownMenu — Radix twin.
 * Same public props as the Base UI twin; headless via `radix-ui` DropdownMenu.
 */
export default function DropdownMenu({
  children,
  items,
  className,
  open,
  onOpenChange,
  sideOffset = 4,
  align = "start",
}: DropdownMenuProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);

  const controlledOpen = open ?? isOpen;
  const handleOpenChange = (value: boolean) => {
    setIsOpen(value);
    onOpenChange?.(value);
  };

  const renderItem = (item: DropdownMenuItemConfig, index: number) => {
    if (item.separator) {
      return <DropdownMenuSeparator key={item.key} />;
    }

    if (item.groupLabel) {
      return (
        <DropdownMenuLabel key={item.key}>{item.groupLabel}</DropdownMenuLabel>
      );
    }

    if (item.children && item.children.length > 0) {
      return (
        <DropdownMenuSub key={item.key}>
          <DropdownMenuSubTrigger disabled={item.disabled}>
            {item.icon ? <span className="mr-2">{item.icon}</span> : null}
            {item.label}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {item.children.map((child, childIndex) =>
              renderItem(child, childIndex)
            )}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
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
        <DropdownMenuItem
          disabled={item.disabled}
          onSelect={item.onSelect}
          variant={item.variant}
        >
          {item.icon ? <span className="mr-2">{item.icon}</span> : null}
          {item.label}
          {item.shortcut ? (
            <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>
          ) : null}
        </DropdownMenuItem>
      </motion.div>
    );
  };

  return (
    <DropdownMenuRoot onOpenChange={handleOpenChange} open={controlledOpen}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        className={cn("origin-top", className)}
        sideOffset={sideOffset}
      >
        <motion.div
          animate={
            shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }
          }
          initial={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 0, scale: 0.95, y: -4 }
          }
          transition={shouldReduceMotion ? { duration: 0 } : SPRING_DEFAULT}
        >
          <DropdownMenuGroup>
            {items.map((item, index) => renderItem(item, index))}
          </DropdownMenuGroup>
        </motion.div>
      </DropdownMenuContent>
    </DropdownMenuRoot>
  );
}
