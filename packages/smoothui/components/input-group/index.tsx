"use client";

import { cn } from "@repo/smoothui-utils";
import type { ComponentProps, ReactNode } from "react";

export interface InputGroupProps extends ComponentProps<"div"> {
  children?: ReactNode;
}

export interface InputGroupAddonProps extends ComponentProps<"div"> {
  /** Align to start (leading) or end (trailing) */
  align?: "start" | "end";
  children?: ReactNode;
}

export type InputGroupTextProps = ComponentProps<"span">;

/**
 * SmoothUI Input Group — wraps Input with leading/trailing addons.
 * SmoothUI-owned compound; styles the nested `[data-slot=input]`.
 */
export default function InputGroup({
  children,
  className,
  ...props
}: InputGroupProps) {
  return (
    <div
      className={cn(
        "flex h-9 w-full min-w-0 items-center overflow-hidden rounded-md border border-foreground/25 bg-background shadow-xs transition-[color,box-shadow] has-[[data-slot=input]:disabled]:cursor-not-allowed has-[[data-slot=input]:focus-visible]:border-ring has-[[data-slot=input][aria-invalid=true]]:border-destructive has-[[data-slot=input]:disabled]:bg-muted has-[[data-slot=input]:focus-visible]:ring-[3px] has-[[data-slot=input]:focus-visible]:ring-ring/50 has-[[data-slot=input][aria-invalid=true]]:ring-destructive/20 dark:has-[[data-slot=input][aria-invalid=true]]:ring-destructive/40",
        "[&_[data-slot=input]]:h-full [&_[data-slot=input]]:flex-1 [&_[data-slot=input]]:rounded-none [&_[data-slot=input]]:border-0 [&_[data-slot=input]]:bg-transparent [&_[data-slot=input]]:shadow-none [&_[data-slot=input]]:focus-visible:ring-0",
        className
      )}
      data-slot="input-group"
      {...props}
    >
      {children}
    </div>
  );
}

export const InputGroupAddon = ({
  align = "start",
  children,
  className,
  ...props
}: InputGroupAddonProps) => (
  <div
    className={cn(
      "flex shrink-0 items-center gap-1 text-muted-foreground",
      align === "start" ? "pl-3" : "pr-3",
      className
    )}
    data-align={align}
    data-slot="input-group-addon"
    {...props}
  >
    {children}
  </div>
);

export const InputGroupText = ({
  children,
  className,
  ...props
}: InputGroupTextProps) => (
  <span
    className={cn("select-none text-sm", className)}
    data-slot="input-group-text"
    {...props}
  >
    {children}
  </span>
);
