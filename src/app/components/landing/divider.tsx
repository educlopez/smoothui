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
          : "right-0 top-0 h-full w-[2px]"
      } z-1 border-light4 bg-white transition dark:border-dark4 dark:bg-black ${
        orientation === "horizontal" ? "border-t" : "border-r"
      } ${className}`}
    />
  )
}
