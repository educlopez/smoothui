import { cn } from "@/lib/utils"

export function BgLines({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-lines-page !max-w-content pointer-events-none absolute inset-0 z-0 mx-auto h-full w-full overflow-hidden object-none opacity-[0.04]",
        className
      )}
    ></div>
  )
}
