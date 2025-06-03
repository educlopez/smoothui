import { cn } from "@/lib/utils"

export default function BlurMagic({
  side,
  stop = "50%",
  blur = "4px",
  className,
}: {
  side: "top" | "bottom" | "left" | "right"
  stop?: string
  blur?: string
  className?: string
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("blur-magic", className)}
      data-side={side}
      style={{ "--stop": stop, "--blur": blur } as React.CSSProperties}
    />
  )
}
