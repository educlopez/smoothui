"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import {
  DropdownMenu as DropdownMenuRoot,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@repo/shadcn-ui/components/ui/dropdown-menu";
import { motion, useReducedMotion } from "motion/react";
import type React from "react";
import { useState } from "react";
import { SPRING_DEFAULT } from "../../lib/animation";

export interface DropdownMenuProps {
  /** The trigger element that opens the menu */
  children: React.ReactNode;
  /** Menu items to render */
  items: DropdownMenuItemConfig[];
  /** Optional CSS class for the content container */
  className?: string;
  /** Controlled open state */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Side offset for the dropdown content */
  sideOffset?: number;
  /** Alignment of the dropdown relative to the trigger */
  align?: "start" | "center" | "end";
}

export interface DropdownMenuItemConfig {
  /** Unique key for the item */
  key: string;
  /** Display label */
  label: string;
  /** Optional icon to display before the label */
  icon?: React.ReactNode;
  /** Callback when item is selected */
  onSelect?: () => void;
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Destructive variant styling */
  variant?: "default" | "destructive";
  /** Optional keyboard shortcut text to display */
  shortcut?: string;
  /** Nested submenu items */
  children?: DropdownMenuItemConfig[];
  /** Renders a separator instead of an item */
  separator?: boolean;
  /** Renders a group label instead of an item */
  groupLabel?: string;
}

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
        <DropdownMenuLabel key={item.key}>
          {item.groupLabel}
        </DropdownMenuLabel>
      );
    }

    if (item.children && item.children.length > 0) {
      return (
        <DropdownMenuSub key={item.key}>
          <DropdownMenuSubTrigger disabled={item.disabled}>
            {item.icon && <span className="mr-2">{item.icon}</span>}
            {item.label}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {item.children.map((child, childIndex) =>
              renderItem(child, childIndex),
            )}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      );
    }

    return (
      <motion.div
        animate={
          shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }
        }
        initial={
          shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -4 }
        }
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
          {item.icon && <span className="mr-2">{item.icon}</span>}
          {item.label}
          {item.shortcut && (
            <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>
          )}
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
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 1, scale: 1, y: 0 }
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
