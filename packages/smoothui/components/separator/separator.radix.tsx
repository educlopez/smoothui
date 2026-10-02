"use client";

import { cn } from "@repo/smoothui-utils";
import { Separator as SeparatorPrimitive } from "radix-ui";

export type SeparatorOrientation = "horizontal" | "vertical";

export interface SeparatorProps {
  /** Optional CSS class names */
  className?: string;
  /**
   * Purely visual divider. Hidden from assistive tech (`role="none"`).
   * Leave `false` when the line separates meaningful content groups.
   */
  decorative?: boolean;
  /** Layout direction of the line */
  orientation?: SeparatorOrientation;
}

/**
 * SmoothUI Separator — Radix twin.
 * Same public props as the Base UI twin; headless via `radix-ui` Separator.
 */
export default function Separator({
  className,
  decorative = false,
  orientation = "horizontal",
}: SeparatorProps) {
  return (
    <SeparatorPrimitive.Root
      className={cn(
        "shrink-0 bg-foreground/40",
        orientation === "horizontal" ? "h-px w-full" : "h-full min-h-4 w-px",
        className
      )}
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
    />
  );
}
