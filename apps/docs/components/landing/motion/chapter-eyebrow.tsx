import { cn } from "@repo/shadcn-ui/lib/utils";

export interface ChapterEyebrowProps {
  align?: "center" | "left";
  className?: string;
  index: string;
  label: string;
  tone?: "default" | "on-dark";
}

export function ChapterEyebrow({
  align = "center",
  className,
  index,
  label,
  tone = "default",
}: ChapterEyebrowProps) {
  return (
    <p
      className={cn(
        "mb-4 flex items-center gap-3 font-medium text-[11px] uppercase tracking-[0.18em]",
        align === "center" && "justify-center",
        tone === "on-dark" ? "text-white/70" : "text-muted-foreground",
        className
      )}
    >
      <span className="font-mono tabular-nums">{index}</span>
      <span aria-hidden className="h-px w-6 bg-current opacity-40" />
      <span>{label}</span>
    </p>
  );
}
