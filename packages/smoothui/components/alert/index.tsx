"use client";

import { cn } from "@repo/smoothui-utils";
import type { ComponentProps, ReactNode } from "react";

export type AlertVariant = "info" | "success" | "warning" | "destructive";

export interface AlertProps extends Omit<ComponentProps<"div">, "title"> {
  /** Body copy under the title */
  children?: ReactNode;
  /** Optional leading icon */
  icon?: ReactNode;
  /** Bold heading line */
  title?: ReactNode;
  /** Semantic tone */
  variant?: AlertVariant;
}

const VARIANT_CLASS: Record<AlertVariant, string> = {
  destructive:
    "border-destructive/30 bg-destructive/10 text-destructive dark:border-destructive/40",
  info: "border-foreground/15 bg-foreground/5 text-foreground",
  success:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300",
  warning:
    "border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-300",
};

/**
 * SmoothUI Alert — inline page/form notice (not a dialog). SmoothUI-owned.
 */
export default function Alert({
  children,
  className,
  icon,
  title,
  variant = "info",
  ...props
}: AlertProps) {
  return (
    <div
      className={cn(
        "relative flex w-full gap-3 rounded-lg border px-4 py-3 text-sm",
        VARIANT_CLASS[variant],
        className
      )}
      data-slot="alert"
      data-variant={variant}
      role="alert"
      {...props}
    >
      {icon ? (
        <span
          aria-hidden
          className="mt-0.5 shrink-0 [&_svg]:size-4"
          data-slot="alert-icon"
        >
          {icon}
        </span>
      ) : null}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {title ? (
          <div className="font-medium leading-none" data-slot="alert-title">
            {title}
          </div>
        ) : null}
        {children ? (
          <div
            className="text-current/80 leading-relaxed [&_a]:underline"
            data-slot="alert-description"
          >
            {children}
          </div>
        ) : null}
      </div>
    </div>
  );
}
