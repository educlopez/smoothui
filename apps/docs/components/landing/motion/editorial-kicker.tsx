import { cn } from "@repo/shadcn-ui/lib/utils";

interface EditorialKickerProps {
  className?: string;
  index: string;
  label: string;
}

export function EditorialKicker({
  className,
  index,
  label,
}: EditorialKickerProps) {
  return (
    <p
      className={cn(
        "flex items-center gap-3 font-medium font-meta text-[11px] text-white/70 uppercase tracking-[0.22em]",
        className
      )}
    >
      <span className="tabular-nums">{index}</span>
      <span aria-hidden className="h-px w-8 bg-current opacity-50" />
      <span>{label}</span>
    </p>
  );
}
