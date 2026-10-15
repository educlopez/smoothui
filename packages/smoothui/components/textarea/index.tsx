"use client";

import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "@repo/smoothui-utils";
import type { ComponentProps } from "react";

export type TextareaProps = Omit<
  ComponentProps<typeof InputPrimitive>,
  "className" | "type" | "size"
> & {
  /** Optional CSS class names */
  className?: string;
  /** Visible rows hint (maps to rows attribute) */
  rows?: number;
};

/** Same surface language as Input / FieldControl. */
const TEXTAREA_CLASS =
  "flex min-h-20 w-full min-w-0 resize-y rounded-md border border-foreground/25 bg-background px-3 py-2 text-sm shadow-xs outline-none state-transition placeholder:text-muted-foreground/60 focus-visible:border-ring focus-ring disabled:cursor-not-allowed disabled:border-foreground/20 disabled:bg-muted disabled:text-muted-foreground disabled:placeholder:text-muted-foreground/70 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40";

/**
 * SmoothUI Textarea — Base UI Input rendered as multiline. No Radix twin.
 */
const Textarea = ({ className, rows = 4, ...props }: TextareaProps) => (
  <InputPrimitive
    className={cn(TEXTAREA_CLASS, className)}
    data-slot="textarea"
    render={<textarea rows={rows} />}
    {...props}
  />
);

export default Textarea;
