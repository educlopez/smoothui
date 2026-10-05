"use client";

import { Field as FieldPrimitive } from "@base-ui/react/field";
import { cn } from "@repo/smoothui-utils";
import type { ComponentProps } from "react";

export type FieldProps = ComponentProps<typeof FieldPrimitive.Root>;
export type FieldLabelProps = ComponentProps<typeof FieldPrimitive.Label>;
export type FieldDescriptionProps = ComponentProps<
  typeof FieldPrimitive.Description
>;
export type FieldErrorProps = ComponentProps<typeof FieldPrimitive.Error>;
export type FieldControlProps = ComponentProps<typeof FieldPrimitive.Control>;

/**
 * SmoothUI Field — Base UI compound (no Radix twin).
 * Groups label, description, control, and error for accessible forms.
 */
const Field = ({ className, ...props }: FieldProps) => (
  <FieldPrimitive.Root
    className={cn("flex w-full flex-col gap-1.5", className)}
    data-slot="field"
    {...props}
  />
);

const FieldLabel = ({ className, ...props }: FieldLabelProps) => (
  <FieldPrimitive.Label
    className={cn(
      "font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:text-muted-foreground",
      className
    )}
    data-slot="field-label"
    {...props}
  />
);

const FieldDescription = ({ className, ...props }: FieldDescriptionProps) => (
  <FieldPrimitive.Description
    className={cn("text-muted-foreground text-sm", className)}
    data-slot="field-description"
    {...props}
  />
);

const FieldError = ({ className, ...props }: FieldErrorProps) => (
  <FieldPrimitive.Error
    className={cn("text-destructive text-sm", className)}
    data-slot="field-error"
    {...props}
  />
);

const FieldControl = ({ className, ...props }: FieldControlProps) => (
  <FieldPrimitive.Control
    className={cn(
      "flex h-9 w-full rounded-md border border-foreground/25 bg-background px-3 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground/60 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:border-foreground/20 disabled:bg-muted disabled:text-muted-foreground disabled:placeholder:text-muted-foreground/70 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
      className
    )}
    data-slot="field-control"
    {...props}
  />
);

export { FieldControl, FieldDescription, FieldError, FieldLabel };

export default Field;
