"use client";

import { cn } from "@repo/smoothui-utils";
import type { ComponentProps } from "react";

export type KbdProps = ComponentProps<"kbd">;

/**
 * SmoothUI Kbd — keyboard key affordance. SmoothUI-owned.
 */
export default function Kbd({ children, className, ...props }: KbdProps) {
  return (
    <kbd
      className={cn(
        "pointer-events-none inline-flex h-5 min-w-5 select-none items-center justify-center rounded-md border border-foreground/20 bg-foreground/5 px-1.5 font-medium font-sans text-[10px] text-muted-foreground tracking-wide",
        className
      )}
      data-slot="kbd"
      {...props}
    >
      {children}
    </kbd>
  );
}
