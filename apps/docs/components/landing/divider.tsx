interface DividerProps {
  className?: string;
  orientation?: "horizontal" | "vertical";
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
      } z-1 border-smooth-300 bg-white transition dark:bg-black ${
        orientation === "horizontal" ? "border-t" : "border-r"
      } ${className}`}
    />
  );
}
