"use client";

import { cn } from "@repo/smoothui-utils";
import { Menubar as MenubarPrimitive } from "radix-ui";
import type { ComponentProps, ReactNode } from "react";

export interface MenubarProps {
  children?: ReactNode;
  className?: string;
}

export type MenubarRootProps = Omit<
  ComponentProps<typeof MenubarPrimitive.Root>,
  "className"
> & { className?: string };
export type MenubarMenuProps = ComponentProps<typeof MenubarPrimitive.Menu>;
export type MenubarTriggerProps = Omit<
  ComponentProps<typeof MenubarPrimitive.Trigger>,
  "className"
> & { className?: string };
export type MenubarContentProps = Omit<
  ComponentProps<typeof MenubarPrimitive.Content>,
  "className"
> & { className?: string };
export type MenubarItemProps = Omit<
  ComponentProps<typeof MenubarPrimitive.Item>,
  "className"
> & { className?: string };
export type MenubarSeparatorProps = Omit<
  ComponentProps<typeof MenubarPrimitive.Separator>,
  "className"
> & { className?: string };

const TRIGGER_CLASS =
  "inline-flex h-8 select-none items-center rounded-md px-2.5 font-medium text-sm outline-none transition-colors hover:bg-muted focus:bg-muted data-[state=open]:bg-muted";

const POPUP_CLASS =
  "z-50 min-w-40 rounded-md border bg-popover p-1 text-popover-foreground shadow-md";

const ITEM_CLASS =
  "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground";

export const MenubarRoot = ({ className, ...props }: MenubarRootProps) => (
  <MenubarPrimitive.Root
    className={cn(
      "inline-flex h-10 items-center gap-0.5 rounded-xl border border-border bg-background/60 p-1 shadow-xs",
      className
    )}
    data-slot="menubar"
    {...props}
  />
);

export const MenubarMenu = ({ ...props }: MenubarMenuProps) => (
  <MenubarPrimitive.Menu data-slot="menubar-menu" {...props} />
);

export const MenubarTrigger = ({
  className,
  ...props
}: MenubarTriggerProps) => (
  <MenubarPrimitive.Trigger
    className={cn(TRIGGER_CLASS, className)}
    data-slot="menubar-trigger"
    {...props}
  />
);

export const MenubarContent = ({
  className,
  align = "start",
  sideOffset = 4,
  ...props
}: MenubarContentProps) => (
  <MenubarPrimitive.Portal>
    <MenubarPrimitive.Content
      align={align}
      className={cn(POPUP_CLASS, className)}
      data-slot="menubar-content"
      sideOffset={sideOffset}
      {...props}
    />
  </MenubarPrimitive.Portal>
);

export const MenubarItem = ({ className, ...props }: MenubarItemProps) => (
  <MenubarPrimitive.Item
    className={cn(ITEM_CLASS, className)}
    data-slot="menubar-item"
    {...props}
  />
);

export const MenubarSeparator = ({
  className,
  ...props
}: MenubarSeparatorProps) => (
  <MenubarPrimitive.Separator
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    data-slot="menubar-separator"
    {...props}
  />
);

/**
 * SmoothUI Menubar — Radix twin.
 * Same public compounds as the Base UI twin.
 */
export default function Menubar({ children, className }: MenubarProps) {
  return <MenubarRoot className={className}>{children}</MenubarRoot>;
}
