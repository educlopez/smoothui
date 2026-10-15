"use client";

import { Toolbar as ToolbarPrimitive } from "@base-ui/react/toolbar";
import { cn } from "@repo/smoothui-utils";
import type { ComponentProps, ReactNode } from "react";

export type ToolbarOrientation = "horizontal" | "vertical";

export interface ToolbarProps {
  /** Toolbar content */
  children?: ReactNode;
  /** Optional CSS class names */
  className?: string;
  /** Disable all items */
  disabled?: boolean;
  /** Layout direction */
  orientation?: ToolbarOrientation;
}

export type ToolbarRootProps = Omit<
  ComponentProps<typeof ToolbarPrimitive.Root>,
  "className"
> & { className?: string };
export type ToolbarGroupProps = Omit<
  ComponentProps<typeof ToolbarPrimitive.Group>,
  "className"
> & { className?: string };
export type ToolbarButtonProps = Omit<
  ComponentProps<typeof ToolbarPrimitive.Button>,
  "className"
> & { className?: string };
export type ToolbarLinkProps = Omit<
  ComponentProps<typeof ToolbarPrimitive.Link>,
  "className"
> & { className?: string };
export type ToolbarSeparatorProps = Omit<
  ComponentProps<typeof ToolbarPrimitive.Separator>,
  "className"
> & { className?: string };
export type ToolbarInputProps = Omit<
  ComponentProps<typeof ToolbarPrimitive.Input>,
  "className"
> & { className?: string };

const BUTTON_CLASS =
  "inline-flex h-8 shrink-0 select-none items-center justify-center gap-1.5 rounded-md px-2.5 font-medium text-sm outline-none transition-colors hover:bg-muted focus-ring data-disabled:pointer-events-none data-disabled:opacity-50 data-pressed:bg-background data-pressed:shadow-sm dark:data-pressed:bg-foreground/15";

export const ToolbarRoot = ({ className, ...props }: ToolbarRootProps) => (
  <ToolbarPrimitive.Root
    className={cn(
      "inline-flex items-center gap-1 rounded-xl border border-border bg-background/60 p-1 shadow-xs",
      "data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch",
      className
    )}
    data-slot="toolbar"
    {...props}
  />
);

export const ToolbarGroup = ({ className, ...props }: ToolbarGroupProps) => (
  <ToolbarPrimitive.Group
    className={cn("flex items-center gap-0.5", className)}
    data-slot="toolbar-group"
    {...props}
  />
);

export const ToolbarButton = ({ className, ...props }: ToolbarButtonProps) => (
  <ToolbarPrimitive.Button
    className={cn(BUTTON_CLASS, className)}
    data-slot="toolbar-button"
    {...props}
  />
);

export const ToolbarLink = ({ className, ...props }: ToolbarLinkProps) => (
  <ToolbarPrimitive.Link
    className={cn(
      "focus-ring px-2.5 font-medium text-muted-foreground text-xs outline-none transition-colors hover:text-foreground",
      className
    )}
    data-slot="toolbar-link"
    {...props}
  />
);

export const ToolbarSeparator = ({
  className,
  ...props
}: ToolbarSeparatorProps) => (
  <ToolbarPrimitive.Separator
    className={cn(
      "mx-0.5 w-px self-stretch bg-foreground/25 data-[orientation=horizontal]:my-0.5 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full",
      className
    )}
    data-slot="toolbar-separator"
    {...props}
  />
);

export const ToolbarInput = ({ className, ...props }: ToolbarInputProps) => (
  <ToolbarPrimitive.Input
    className={cn(
      "focus-ring h-8 min-w-24 rounded-md border border-foreground/25 bg-background px-2 text-sm outline-none focus-visible:border-ring disabled:opacity-50",
      className
    )}
    data-slot="toolbar-input"
    {...props}
  />
);

/**
 * SmoothUI Toolbar — Base UI twin (default).
 * Convenience root; use compounds for groups, buttons, links, separators.
 */
export default function Toolbar({
  children,
  className,
  disabled,
  orientation = "horizontal",
}: ToolbarProps) {
  return (
    <ToolbarRoot
      className={className}
      disabled={disabled}
      orientation={orientation}
    >
      {children}
    </ToolbarRoot>
  );
}
