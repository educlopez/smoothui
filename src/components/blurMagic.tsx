import { cn } from "@/lib/utils";





export default function BlurMagic({
  side,
  stop = "50%",
  blur = "4px",
  className,
  height,
  ref,
  style,
}: {
  side: "top" | "bottom" | "left" | "right"
  stop?: string
  blur?: string
  className?: string
  height?: string
  style?: React.CSSProperties
  ref?: React.Ref<HTMLDivElement>
}) {
  return (
    <div
      ref={ref}
      data-smooth-scroll-fader
      aria-hidden
      className={cn("blur-magic", className)}
      data-side={side}
      style={
        {
          "--stop": stop,
          "--blur": blur,
          "--height": `${height}`,
          ...style,
        } as React.CSSProperties
      }
    />
  )
}