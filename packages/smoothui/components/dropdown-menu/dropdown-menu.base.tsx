"use client";

import { Menu } from "@base-ui/react/menu";
import { cn } from "@repo/smoothui-utils";
import { motion, useReducedMotion } from "motion/react";
import type React from "react";
import { isValidElement, useState } from "react";
import { SPRING_DEFAULT } from "../../lib/animation";

const ChevronRightIcon = () => (
  <svg
    aria-hidden="true"
    className="ml-auto size-4"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

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

const POPUP_CLASS =
  "max-h-[var(--available-height)] min-w-[8rem] origin-[var(--transform-origin)] overflow-x-hidden overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md";

const ITEM_CLASS =
  "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-accent data-highlighted:text-accent-foreground [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0";

const DESTRUCTIVE_ITEM_CLASS =
  "data-highlighted:bg-destructive/10 data-highlighted:text-destructive dark:data-highlighted:bg-destructive/20 [&_svg]:!text-destructive text-destructive";

const SUBTRIGGER_CLASS =
  "flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden data-highlighted:bg-accent data-highlighted:text-accent-foreground data-popup-open:bg-accent data-popup-open:text-accent-foreground [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0";

const Shortcut = ({ children }: { children: React.ReactNode }) => (
  <span
    className="ml-auto text-muted-foreground text-xs tracking-widest"
    data-slot="dropdown-menu-shortcut"
  >
    {children}
  </span>
);

/**
 * SmoothUI DropdownMenu — Base UI twin (default).
 * Same public props as the Radix twin; headless via `@base-ui/react/menu`.
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
      return (
        <Menu.Separator className="-mx-1 my-1 h-px bg-border" key={item.key} />
      );
    }

    if (item.groupLabel) {
      return (
        <Menu.Group key={item.key}>
          <Menu.GroupLabel className="px-2 py-1.5 font-medium text-sm">
            {item.groupLabel}
          </Menu.GroupLabel>
        </Menu.Group>
      );
    }

    if (item.children && item.children.length > 0) {
      return (
        <Menu.SubmenuRoot key={item.key}>
          <Menu.SubmenuTrigger
            className={SUBTRIGGER_CLASS}
            disabled={item.disabled}
          >
            {item.icon ? <span className="mr-2">{item.icon}</span> : null}
            {item.label}
            <ChevronRightIcon />
          </Menu.SubmenuTrigger>
          <Menu.Portal>
            <Menu.Positioner
              align="start"
              className="z-50 outline-none"
              data-slot="dropdown-menu-sub-positioner"
              side="right"
              sideOffset={2}
            >
              <Menu.Popup className={POPUP_CLASS}>
                {item.children.map((child, childIndex) =>
                  renderItem(child, childIndex)
                )}
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.SubmenuRoot>
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
        <Menu.Item
          className={cn(
            ITEM_CLASS,
            item.variant === "destructive" && DESTRUCTIVE_ITEM_CLASS
          )}
          data-variant={item.variant ?? "default"}
          disabled={item.disabled}
          onClick={() => {
            item.onSelect?.();
          }}
        >
          {item.icon ? <span className="mr-2">{item.icon}</span> : null}
          {item.label}
          {item.shortcut ? <Shortcut>{item.shortcut}</Shortcut> : null}
        </Menu.Item>
      </motion.div>
    );
  };

  const trigger = isValidElement(children) ? (
    <Menu.Trigger
      nativeButton={
        typeof children.type === "string" ? children.type === "button" : true
      }
      render={children}
    />
  ) : (
    <Menu.Trigger>{children}</Menu.Trigger>
  );

  return (
    <Menu.Root onOpenChange={handleOpenChange} open={controlledOpen}>
      {trigger}
      <Menu.Portal>
        <Menu.Positioner
          align={align}
          className="z-50 outline-none"
          data-slot="dropdown-menu-positioner"
          side="bottom"
          sideOffset={sideOffset}
        >
          <Menu.Popup
            className={cn("origin-top", POPUP_CLASS, className)}
            render={
              <motion.div
                animate={
                  shouldReduceMotion
                    ? { opacity: 1 }
                    : { opacity: 1, scale: 1, y: 0 }
                }
                initial={
                  shouldReduceMotion
                    ? { opacity: 1 }
                    : { opacity: 0, scale: 0.95, y: -4 }
                }
                transition={
                  shouldReduceMotion ? { duration: 0 } : SPRING_DEFAULT
                }
              />
            }
          >
            <Menu.Group>
              {items.map((item, index) => renderItem(item, index))}
            </Menu.Group>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
