interface DividerProps {
  orientation?: "horizontal" | "vertical"
  className?: string
}

export default function Divider({
  orientation = "horizontal",
  className,
}: DividerProps) {
  return (
    <div
      className={`absolute ${
        orientation === "horizontal"
          ? "bottom-0 left-0 h-[2px] w-full"
          : "top-0 right-0 h-full w-[2px]"
      } border-smooth-300 z-1 bg-white transition dark:bg-black ${
        orientation === "horizontal" ? "border-t" : "border-r"
      } ${className}`}
    />
  )
}
