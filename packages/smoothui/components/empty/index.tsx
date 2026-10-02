"use client";

import { cn } from "@repo/smoothui-utils";
import type { ComponentProps, ReactNode } from "react";

export interface EmptyProps extends Omit<ComponentProps<"div">, "title"> {
  /** Optional action (button / link) below the copy */
  action?: ReactNode;
  /** Supporting sentence */
  description?: ReactNode;
  /** Optional illustration or icon above the title */
  icon?: ReactNode;
  /** Primary empty-state heading */
  title: ReactNode;
}

/**
 * SmoothUI Empty — first-run / no-results state. SmoothUI-owned.
 */
export default function Empty({
  action,
  className,
  description,
  icon,
  title,
  ...props
}: EmptyProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center gap-3 px-6 py-12 text-center",
        className
      )}
      data-slot="empty"
      {...props}
    >
      {icon ? (
        <div
          aria-hidden
          className="mb-1 flex size-12 items-center justify-center rounded-full bg-foreground/5 text-muted-foreground [&_svg]:size-5"
          data-slot="empty-icon"
        >
          {icon}
        </div>
      ) : null}
      <div className="flex max-w-sm flex-col gap-1.5">
        <h3
          className="font-medium text-base text-foreground leading-snug"
          data-slot="empty-title"
        >
          {title}
        </h3>
        {description ? (
          <p
            className="text-muted-foreground text-sm leading-relaxed"
            data-slot="empty-description"
          >
            {description}
          </p>
        ) : null}
      </div>
      {action ? (
        <div className="mt-1" data-slot="empty-action">
          {action}
        </div>
      ) : null}
    </div>
  );
}
