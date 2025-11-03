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
          "select-none text-center font-bold font-title text-foreground text-lg uppercase transition",
          className
        )}
      >
        Smooth<span className="text-brand">UI</span>
      </span>
    </>
  );
}
