"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { Icon } from "./icon";

export default function Logo({
  classNameIcon,
  className,
}: {
  classNameIcon?: string;
  className?: string;
}) {
  return (
    <>
      <Icon className={cn("h-6 w-auto cursor-grabbing", classNameIcon)} />
      <span
        className={cn(
          "mt-0.5 select-none text-center font-medium font-title text-foreground text-xl transition",
          className
        )}
      >
        Smooth<span className="text-brand">UI</span>
      </span>
    </>
  );
}
