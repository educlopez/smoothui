"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import {
  ContextMenu as ContextMenuRoot,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@repo/shadcn-ui/components/ui/context-menu";
import { motion, useReducedMotion } from "motion/react";
import type React from "react";
import { SPRING_DEFAULT } from "../../lib/animation";

export interface ContextMenuProps {
  /** The trigger element that opens the context menu on right-click */
  children: React.ReactNode;
  /** Menu items to render */
  items: ContextMenuItemConfig[];
  /** Optional CSS class for the content container */
  className?: string;
}

export interface ContextMenuItemConfig {
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
  children?: ContextMenuItemConfig[];
  /** Renders a separator instead of an item */
  separator?: boolean;
  /** Renders a group label instead of an item */
  groupLabel?: string;
}

export default function ContextMenu({
  children,
  items,
  className,
}: ContextMenuProps) {
  const shouldReduceMotion = useReducedMotion();

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
            {item.icon && <span className="mr-2">{item.icon}</span>}
            {item.label}
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            {item.children.map((child, childIndex) =>
              renderItem(child, childIndex),
            )}
          </ContextMenuSubContent>
        </ContextMenuSub>
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
        <ContextMenuItem
          disabled={item.disabled}
          onSelect={item.onSelect}
          variant={item.variant}
        >
          {item.icon && <span className="mr-2">{item.icon}</span>}
          {item.label}
          {item.shortcut && (
            <ContextMenuShortcut>{item.shortcut}</ContextMenuShortcut>
          )}
        </ContextMenuItem>
      </motion.div>
    );
  };

  return (
    <ContextMenuRoot>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className={cn("origin-top", className)}>
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
          <ContextMenuGroup>
            {items.map((item, index) => renderItem(item, index))}
          </ContextMenuGroup>
        </motion.div>
      </ContextMenuContent>
    </ContextMenuRoot>
  );
}
