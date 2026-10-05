"use client";

import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";
import { cn } from "@repo/smoothui-utils";

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
 * SmoothUI Separator — Base UI twin (default).
 * Thin 1px line; vertical separators stretch to the height of their flex row.
 */
export default function Separator({
  className,
  decorative = false,
  orientation = "horizontal",
}: SeparatorProps) {
  const a11yProps = decorative
    ? ({
        "aria-hidden": true,
        "aria-orientation": undefined,
        role: "none",
      } as const)
    : {};

  return (
    <SeparatorPrimitive
      {...a11yProps}
      className={cn(
        "shrink-0 bg-foreground/40",
        orientation === "horizontal" ? "h-px w-full" : "h-full min-h-4 w-px",
        className
      )}
      data-slot="separator"
      orientation={orientation}
    />
  );
}
