import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

interface InlineCodeProps {
  children: ReactNode
  className?: string
}

export function InlineCode({ children, className }: InlineCodeProps) {
  return (
    <code
      className={cn(
        "frame-box relative rounded px-1.5 py-0.5 font-mono text-sm",
        className
      )}
    >
      {children}
    </code>
  )
}
