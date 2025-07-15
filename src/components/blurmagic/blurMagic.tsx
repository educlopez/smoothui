import { cn } from "@/lib/utils"

import styles from "./blurMagic.module.css"

export function BlurMagic({
  stop,
  blur,
  side = "top",
  className,
  background,
  style,
  ref,
  debug,
}: {
  stop?: string
  blur?: string
  side: "top" | "bottom" | "left" | "right"
  className?: string
  background: string
  debug?: boolean
  style?: React.CSSProperties
  ref?: React.Ref<HTMLDivElement>
}) {
  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(styles.root, className)}
      data-side={side}
      style={
        {
          "--stop": stop,
          "--blur": blur,
          "--background": background,
          ...(debug && {
            outline: "2px solid var(--color-orange)",
          }),
          ...style,
        } as React.CSSProperties
      }
    />
  )
}
