"use client"

import { cn } from "@/lib/utils"
import { Icon } from "@/components/icon"

export default function Logo({
  classNameIcon,
  className,
}: {
  classNameIcon?: string
  className?: string
}) {
  return (
    <>
      <Icon className={cn("h-8 w-8", classNameIcon)} />
      <span
        className={cn(
          "font-title text-foreground text-center text-3xl font-bold transition",
          className
        )}
      >
        Smooth<span className="text-brand">UI</span>
      </span>
    </>
  )
}
