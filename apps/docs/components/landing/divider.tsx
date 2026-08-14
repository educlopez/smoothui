import { cn } from "@repo/shadcn-ui/lib/utils";

interface DividerProps {
  className?: string;
  orientation?: "horizontal" | "vertical";
}

export default function Divider({
  orientation = "horizontal",
  className,
}: DividerProps) {
  const isHorizontal = orientation === "horizontal";

  return (
    <div
      className={cn(
        "absolute z-1",
        isHorizontal
          ? // Capped and centred: sections are full-bleed now, and a divider
            // that runs to the viewport edge stops reading as the end of the
            // content column.
            "right-0 bottom-0 left-0 mx-auto h-px max-w-7xl bg-gradient-to-r from-transparent via-border to-transparent"
          : "top-0 right-0 h-full w-px bg-gradient-to-b from-transparent via-border to-transparent",
        className
      )}
    />
  );
}
