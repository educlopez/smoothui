"use client";

import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "@repo/smoothui-utils";
import type { ComponentProps } from "react";

export type InputProps = Omit<
  ComponentProps<typeof InputPrimitive>,
  "className"
> & {
  /** Optional CSS class names */
  className?: string;
};

/** Same surface as `FieldControl` so the two are visually interchangeable. */
const INPUT_CLASS =
  "flex h-9 w-full min-w-0 rounded-md border border-foreground/25 bg-background px-3 text-sm shadow-xs outline-none transition-[color,box-shadow] file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground/60 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:border-foreground/20 disabled:bg-muted disabled:text-muted-foreground disabled:placeholder:text-muted-foreground/70 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40";

/**
 * SmoothUI Input — Base UI primitive (no Radix twin; Radix has no Input).
 * Works standalone and automatically inside `Field` (label, description, error).
 */
const Input = ({ className, type = "text", ...props }: InputProps) => (
  <InputPrimitive
    className={cn(INPUT_CLASS, className)}
    data-slot="input"
    type={type}
    {...props}
  />
);

export default Input;
