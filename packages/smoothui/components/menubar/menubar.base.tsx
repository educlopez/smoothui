"use client";

import { Menu } from "@base-ui/react/menu";
import { Menubar as MenubarPrimitive } from "@base-ui/react/menubar";
import { cn } from "@repo/smoothui-utils";
import type { ComponentProps, ReactNode } from "react";

export interface MenubarProps {
  children?: ReactNode;
  className?: string;
}

export type MenubarRootProps = Omit<
  ComponentProps<typeof MenubarPrimitive>,
  "className"
> & { className?: string };
export type MenubarMenuProps = Omit<
  ComponentProps<typeof Menu.Root>,
  "className"
> & { className?: string };
export type MenubarTriggerProps = Omit<
  ComponentProps<typeof Menu.Trigger>,
  "className"
> & { className?: string };
export type MenubarContentProps = Omit<
  ComponentProps<typeof Menu.Popup>,
  "className"
> & {
  align?: "start" | "center" | "end";
  className?: string;
  sideOffset?: number;
};
export type MenubarItemProps = Omit<
  ComponentProps<typeof Menu.Item>,
  "className"
> & { className?: string };
export type MenubarSeparatorProps = Omit<
  ComponentProps<typeof Menu.Separator>,
  "className"
> & { className?: string };

const TRIGGER_CLASS =
  "inline-flex h-8 select-none items-center rounded-md px-2.5 font-medium text-sm outline-none transition-colors hover:bg-muted focus-visible:bg-muted data-popup-open:bg-muted";

const POPUP_CLASS =
  "z-50 min-w-40 origin-[var(--transform-origin)] rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-none transition-[scale,opacity] duration-150 ease-out data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:scale-[0.98] data-starting-style:opacity-0 motion-reduce:transition-none";

const ITEM_CLASS =
  "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-accent data-highlighted:text-accent-foreground";

export const MenubarRoot = ({ className, ...props }: MenubarRootProps) => (
  <MenubarPrimitive
    className={cn(
      "inline-flex h-10 items-center gap-0.5 rounded-xl border border-border bg-background/60 p-1 shadow-xs",
      className
    )}
    data-slot="menubar"
    {...props}
  />
);

export const MenubarMenu = ({ className, ...props }: MenubarMenuProps) => (
  <Menu.Root data-slot="menubar-menu" {...props} />
);

export const MenubarTrigger = ({
  className,
  ...props
}: MenubarTriggerProps) => (
  <Menu.Trigger
    className={cn(TRIGGER_CLASS, className)}
    data-slot="menubar-trigger"
    {...props}
  />
);

export const MenubarContent = ({
  align = "start",
  className,
  sideOffset = 4,
  ...props
}: MenubarContentProps) => (
  <Menu.Portal>
    <Menu.Positioner
      align={align}
      className="outline-none"
      sideOffset={sideOffset}
    >
      <Menu.Popup
        className={cn(POPUP_CLASS, className)}
        data-slot="menubar-content"
        {...props}
      />
    </Menu.Positioner>
  </Menu.Portal>
);

export const MenubarItem = ({ className, ...props }: MenubarItemProps) => (
  <Menu.Item
    className={cn(ITEM_CLASS, className)}
    data-slot="menubar-item"
    {...props}
  />
);

export const MenubarSeparator = ({
  className,
  ...props
}: MenubarSeparatorProps) => (
  <Menu.Separator
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    data-slot="menubar-separator"
    {...props}
  />
);

/**
 * SmoothUI Menubar — Base UI twin (default).
 * Convenience root; nest MenubarMenu / Trigger / Content / Item.
 */
export default function Menubar({ children, className }: MenubarProps) {
  return <MenubarRoot className={className}>{children}</MenubarRoot>;
}
