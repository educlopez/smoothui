"use client";

import { NavigationMenu as NavPrimitive } from "@base-ui/react/navigation-menu";
import { cn } from "@repo/smoothui-utils";
import type { ComponentProps, ReactNode, SVGProps } from "react";

export interface NavigationMenuProps {
  children?: ReactNode;
  className?: string;
}

export type NavigationMenuRootProps = Omit<
  ComponentProps<typeof NavPrimitive.Root>,
  "className"
> & { className?: string };
export type NavigationMenuListProps = Omit<
  ComponentProps<typeof NavPrimitive.List>,
  "className"
> & { className?: string };
export type NavigationMenuItemProps = Omit<
  ComponentProps<typeof NavPrimitive.Item>,
  "className"
> & { className?: string };
export type NavigationMenuTriggerProps = Omit<
  ComponentProps<typeof NavPrimitive.Trigger>,
  "className"
> & { className?: string };
export type NavigationMenuContentProps = Omit<
  ComponentProps<typeof NavPrimitive.Content>,
  "className"
> & { className?: string };
export type NavigationMenuLinkProps = Omit<
  ComponentProps<typeof NavPrimitive.Link>,
  "className"
> & { className?: string };
export type NavigationMenuViewportProps = Omit<
  ComponentProps<typeof NavPrimitive.Viewport>,
  "className"
> & { className?: string };

const TRIGGER_CLASS =
  "inline-flex h-9 select-none items-center gap-1 rounded-md px-3 font-medium text-sm outline-none transition-colors hover:bg-muted focus-visible:bg-muted data-popup-open:bg-muted";

const LINK_CLASS =
  "block select-none rounded-md p-3 text-sm outline-none transition-colors hover:bg-muted focus-visible:bg-muted";

const CaretDownIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    fill="currentColor"
    height="12"
    aria-hidden="true"
    focusable="false"
    viewBox="0 0 16 16"
    width="12"
    {...props}
  >
    <path d="M12 6H4l4 4.5z" />
  </svg>
);

export const NavigationMenuRoot = ({
  className,
  ...props
}: NavigationMenuRootProps) => (
  <NavPrimitive.Root
    className={cn("relative flex max-w-max flex-1 items-center", className)}
    data-slot="navigation-menu"
    {...props}
  />
);

export const NavigationMenuList = ({
  className,
  ...props
}: NavigationMenuListProps) => (
  <NavPrimitive.List
    className={cn(
      "group flex flex-1 list-none items-center justify-center gap-1",
      className
    )}
    data-slot="navigation-menu-list"
    {...props}
  />
);

export const NavigationMenuItem = ({
  className,
  ...props
}: NavigationMenuItemProps) => (
  <NavPrimitive.Item
    className={cn(className)}
    data-slot="navigation-menu-item"
    {...props}
  />
);

export const NavigationMenuTrigger = ({
  children,
  className,
  ...props
}: NavigationMenuTriggerProps) => (
  <NavPrimitive.Trigger
    className={cn(TRIGGER_CLASS, className)}
    data-slot="navigation-menu-trigger"
    {...props}
  >
    {children}
    <NavPrimitive.Icon className="relative top-px transition-transform duration-200 ease-out data-popup-open:rotate-180 motion-reduce:transition-none">
      <CaretDownIcon />
    </NavPrimitive.Icon>
  </NavPrimitive.Trigger>
);

export const NavigationMenuContent = ({
  className,
  ...props
}: NavigationMenuContentProps) => (
  <NavPrimitive.Content
    className={cn(
      "w-auto p-2 data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none",
      className
    )}
    data-slot="navigation-menu-content"
    {...props}
  />
);

export const NavigationMenuLink = ({
  className,
  ...props
}: NavigationMenuLinkProps) => (
  <NavPrimitive.Link
    className={cn(LINK_CLASS, className)}
    data-slot="navigation-menu-link"
    {...props}
  />
);

export const NavigationMenuViewport = ({
  className,
  ...props
}: NavigationMenuViewportProps) => (
  <NavPrimitive.Portal>
    <NavPrimitive.Positioner
      className="outline-none"
      sideOffset={8}
      collisionPadding={16}
    >
      <NavPrimitive.Popup className="origin-[var(--transform-origin)] overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-md transition-[scale,opacity] duration-150 ease-out data-ending-style:scale-[0.98] data-starting-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none">
        <NavPrimitive.Viewport
          className={cn(
            "relative h-[var(--popup-height)] w-[var(--popup-width)] overflow-hidden transition-[width,height] duration-200 ease-out motion-reduce:transition-none",
            className
          )}
          data-slot="navigation-menu-viewport"
          {...props}
        />
      </NavPrimitive.Popup>
    </NavPrimitive.Positioner>
  </NavPrimitive.Portal>
);

/**
 * SmoothUI Navigation Menu — Base UI twin (default).
 * Convenience root; nest List / Item / Trigger / Content / Viewport.
 */
export default function NavigationMenu({
  children,
  className,
}: NavigationMenuProps) {
  return (
    <NavigationMenuRoot className={className}>{children}</NavigationMenuRoot>
  );
}
