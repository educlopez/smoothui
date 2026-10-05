"use client";

import { cn } from "@repo/smoothui-utils";
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import type {
  ToggleGroupItemProps,
  ToggleGroupRootProps,
} from "./toggle-group.base";

export type {
  ToggleGroupItemProps,
  ToggleGroupProps,
  ToggleGroupRootProps,
} from "./toggle-group.base";

type RadixRootProps = ComponentProps<typeof ToggleGroupPrimitive.Root>;

/**
 * SmoothUI Toggle Group — Radix twin.
 * Same public props as the Base UI twin (`type` + string[] value).
 *
 * Items are styled directly on `ToggleGroup.Item` (no `asChild` → Toggle Slot)
 * so `role`, `aria-pressed` / `data-state`, and keyboard roving focus stay on
 * the focusable control.
 */
const ToggleGroupRoot = ({
  className,
  children,
  type = "single",
  value,
  defaultValue,
  onValueChange,
  ...props
}: ToggleGroupRootProps) => {
  if (type === "multiple") {
    return (
      <ToggleGroupPrimitive.Root
        className={cn(
          "inline-flex items-center justify-center gap-0.5 rounded-lg bg-foreground/10 p-1",
          "data-[orientation=vertical]:flex-col",
          className
        )}
        data-slot="toggle-group"
        defaultValue={defaultValue as string[] | undefined}
        onValueChange={(next) => {
          (onValueChange as ((groupValue: string[]) => void) | undefined)?.(
            next
          );
        }}
        type="multiple"
        value={value as string[] | undefined}
        {...(props as Omit<
          RadixRootProps,
          "type" | "value" | "defaultValue" | "onValueChange"
        >)}
      >
        {children}
      </ToggleGroupPrimitive.Root>
    );
  }

  const singleValue = value?.[0];
  const singleDefault = defaultValue?.[0];

  return (
    <ToggleGroupPrimitive.Root
      className={cn(
        "inline-flex items-center justify-center gap-0.5 rounded-lg bg-foreground/10 p-1",
        "data-[orientation=vertical]:flex-col",
        className
      )}
      data-slot="toggle-group"
      defaultValue={singleDefault}
      onValueChange={(next) => {
        (onValueChange as ((groupValue: string[]) => void) | undefined)?.(
          next ? [next] : []
        );
      }}
      type="single"
      value={singleValue}
      {...(props as Omit<
        RadixRootProps,
        "type" | "value" | "defaultValue" | "onValueChange"
      >)}
    >
      {children}
    </ToggleGroupPrimitive.Root>
  );
};

const ToggleGroupItem = ({
  className,
  children,
  value,
  disabled,
  "aria-label": ariaLabel,
}: ToggleGroupItemProps) => (
  <ToggleGroupPrimitive.Item
    aria-label={ariaLabel}
    className={cn(
      "inline-flex h-8 shrink-0 select-none items-center justify-center gap-2 rounded-md border border-transparent px-2.5 font-medium text-sm outline-none",
      "bg-transparent text-muted-foreground shadow-none",
      "hover:bg-muted/80 focus-visible:ring-[3px] focus-visible:ring-ring/50",
      "data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm dark:data-[state=on]:bg-foreground/15",
      "disabled:pointer-events-none disabled:border-foreground/25 disabled:bg-foreground/10 disabled:text-muted-foreground",
      className
    )}
    data-slot="toggle-group-item"
    disabled={disabled}
    value={value}
  >
    {children}
  </ToggleGroupPrimitive.Item>
);

export { ToggleGroupItem, ToggleGroupRoot };

export default ToggleGroupRoot;
