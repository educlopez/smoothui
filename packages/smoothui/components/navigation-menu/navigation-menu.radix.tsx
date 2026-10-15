"use client";

import { cn } from "@repo/smoothui-utils";
import { NavigationMenu as NavPrimitive } from "radix-ui";
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
  "group inline-flex h-9 select-none items-center gap-1 rounded-md px-3 font-medium text-sm outline-none transition-colors hover:bg-muted focus:bg-muted data-[state=open]:bg-muted";

const LINK_CLASS =
  "block select-none rounded-md p-3 text-sm outline-none transition-colors hover:bg-muted focus:bg-muted";

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
  children,
  ...props
}: NavigationMenuRootProps) => (
  <NavPrimitive.Root
    className={cn("relative flex max-w-max flex-1 items-center", className)}
    data-slot="navigation-menu"
    {...props}
  >
    {children}
    <div className="absolute top-full left-0 flex w-full justify-center">
      <NavPrimitive.Viewport
        className="data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 relative mt-2 h-[var(--radix-navigation-menu-viewport-height)] w-full origin-top overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-md transition-[width,height] duration-200 data-[state=closed]:animate-out data-[state=open]:animate-in motion-reduce:transition-none md:w-[var(--radix-navigation-menu-viewport-width)]"
        data-slot="navigation-menu-viewport"
      />
    </div>
  </NavPrimitive.Root>
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
    <CaretDownIcon className="relative top-px transition-transform duration-200 group-data-[state=open]:rotate-180 motion-reduce:transition-none" />
  </NavPrimitive.Trigger>
);

export const NavigationMenuContent = ({
  className,
  ...props
}: NavigationMenuContentProps) => (
  <NavPrimitive.Content
    className={cn(
      "data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out top-0 left-0 w-auto p-2 data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out md:absolute md:w-auto",
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

/** No-op on Radix — viewport is rendered inside NavigationMenuRoot. */
export const NavigationMenuViewport = (_props: NavigationMenuViewportProps) =>
  null;

/**
 * SmoothUI Navigation Menu — Radix twin.
 * Same public compounds as the Base UI twin.
 */
export default function NavigationMenu({
  children,
  className,
}: NavigationMenuProps) {
  return (
    <NavigationMenuRoot className={className}>{children}</NavigationMenuRoot>
  );
}
