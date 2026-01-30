"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";

interface RecentIndicatorProps {
  className?: string;
  tooltip?: string;
}

/**
 * A minimalist pulsing dot indicator for recently modified items
 */
export function RecentIndicator({ className, tooltip }: RecentIndicatorProps) {
  return (
    <output
      className={cn("relative ml-auto flex h-2 w-2", className)}
      title={tooltip}
    >
      {/* Pulsing ring */}
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-light opacity-75 duration-1000" />
      {/* Solid dot */}
      <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
    </output>
  );
}
