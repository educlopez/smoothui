"use client";

import { cn } from "@repo/smoothui-utils";
import { Toolbar as ToolbarPrimitive } from "radix-ui";
import {
  type ComponentProps,
  createContext,
  type ReactNode,
  useContext,
} from "react";

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
> & {
  className?: string;
  /** Disable every button and the input in the toolbar */
  disabled?: boolean;
};
export type ToolbarGroupProps = ComponentProps<"div">;
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
export type ToolbarInputProps = ComponentProps<"input">;

const BUTTON_CLASS =
  "inline-flex h-8 shrink-0 select-none items-center justify-center gap-1.5 rounded-md px-2.5 font-medium text-sm outline-none transition-colors hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-background data-[state=on]:shadow-sm dark:data-[state=on]:bg-foreground/15";

/** Radix Toolbar has no `disabled`; the root shares it with its controls. */
const ToolbarDisabledContext = createContext(false);

export const ToolbarRoot = ({
  className,
  disabled = false,
  ...props
}: ToolbarRootProps) => (
  <ToolbarDisabledContext.Provider value={disabled}>
    <ToolbarPrimitive.Root
      className={cn(
        "inline-flex items-center gap-1 rounded-xl border border-border bg-background/60 p-1 shadow-xs",
        "data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch",
        className
      )}
      data-disabled={disabled ? "" : undefined}
      data-slot="toolbar"
      {...props}
    />
  </ToolbarDisabledContext.Provider>
);

/** Plain group wrapper — Radix has no Group; kept for API parity with Base. */
export const ToolbarGroup = ({ className, ...props }: ToolbarGroupProps) => (
  <div
    className={cn("flex items-center gap-0.5", className)}
    data-slot="toolbar-group"
    role="group"
    {...props}
  />
);

export const ToolbarButton = ({
  className,
  disabled,
  ...props
}: ToolbarButtonProps) => {
  const rootDisabled = useContext(ToolbarDisabledContext);

  return (
    <ToolbarPrimitive.Button
      className={cn(BUTTON_CLASS, className)}
      data-slot="toolbar-button"
      disabled={disabled ?? rootDisabled}
      {...props}
    />
  );
};

export const ToolbarLink = ({ className, ...props }: ToolbarLinkProps) => (
  <ToolbarPrimitive.Link
    className={cn(
      "px-2.5 font-medium text-muted-foreground text-xs outline-none transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50",
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

/**
 * Native input — Radix has no Toolbar.Input; kept for API parity with Base.
 * It stays outside the toolbar's roving focus (reachable with Tab, not with
 * the arrow keys) so ArrowLeft / ArrowRight keep moving the caret.
 */
export const ToolbarInput = ({
  className,
  disabled,
  ...props
}: ToolbarInputProps) => {
  const rootDisabled = useContext(ToolbarDisabledContext);

  return (
    <input
      className={cn(
        "h-8 min-w-24 rounded-md border border-foreground/25 bg-background px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-50",
        className
      )}
      data-slot="toolbar-input"
      disabled={disabled ?? rootDisabled}
      {...props}
    />
  );
};

/**
 * SmoothUI Toolbar — Radix twin.
 * Same public props as the Base UI twin.
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
