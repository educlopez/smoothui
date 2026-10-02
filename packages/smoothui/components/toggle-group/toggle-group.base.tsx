"use client";

import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import { cn } from "@repo/smoothui-utils";
import type { ComponentProps, ReactNode } from "react";
import Toggle from "../toggle";

export type ToggleGroupRootProps = ComponentProps<
  typeof ToggleGroupPrimitive
> & {
  className?: string;
  children?: ReactNode;
  /**
   * When `"single"`, only one item can be pressed (maps to `multiple={false}`).
   * When `"multiple"`, many items can be pressed.
   */
  type?: "single" | "multiple";
};

export type ToggleGroupItemProps = {
  "aria-label"?: string;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  value: string;
};

/** Convenience alias for AutoTypeTable */
export type ToggleGroupProps = ToggleGroupRootProps;

/**
 * SmoothUI Toggle Group — Base UI twin (default).
 * Segmented-control look; nest Toggle / ToggleGroupItem children.
 */
const ToggleGroupRoot = ({
  className,
  children,
  multiple,
  type,
  ...props
}: ToggleGroupRootProps) => {
  const isMultiple = multiple ?? type === "multiple";
  return (
    <ToggleGroupPrimitive
      className={cn(
        "inline-flex items-center justify-center gap-0.5 rounded-lg bg-foreground/10 p-1",
        "data-orientation-vertical:flex-col",
        className
      )}
      data-slot="toggle-group"
      multiple={isMultiple}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive>
  );
};

const ToggleGroupItem = ({
  className,
  children,
  ...props
}: ToggleGroupItemProps) => (
  <Toggle
    className={cn(
      "h-8 shrink-0 rounded-md border-transparent bg-transparent px-2.5 shadow-none",
      "hover:bg-muted/80",
      // Dark: lift the chip with foreground tint; `bg-background`/`bg-input` look sunken on stage
      "data-pressed:bg-background data-pressed:text-foreground data-pressed:shadow-sm dark:data-pressed:bg-foreground/15",
      className
    )}
    {...props}
  >
    {children}
  </Toggle>
);

export { ToggleGroupItem, ToggleGroupRoot };

export default ToggleGroupRoot;
