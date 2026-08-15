import { cn } from "@repo/shadcn-ui/lib/utils";

export interface EditorialRailItem {
  body: string;
  index: string;
  title: string;
}

interface EditorialRailProps {
  className?: string;
  heading: string;
  items: readonly EditorialRailItem[];
  tone?: "on-dark" | "on-paper";
}

export function EditorialRail({
  className,
  heading,
  items,
  tone = "on-dark",
}: EditorialRailProps) {
  const onDark = tone === "on-dark";

  return (
    <aside
      className={cn(
        "border-t pt-8 md:border-t-0 md:border-l md:pt-0 md:pl-10",
        onDark ? "border-white/20" : "border-border",
        className
      )}
    >
      <p
        className={cn(
          "font-meta text-[10px] uppercase tracking-[0.2em]",
          onDark ? "text-white/50" : "text-muted-foreground"
        )}
      >
        {heading}
      </p>
      <ul className="mt-6 space-y-7">
        {items.map((item) => (
          <li key={item.index}>
            <p
              className={cn(
                "font-meta text-[11px] uppercase tracking-[0.18em]",
                onDark ? "text-white/55" : "text-muted-foreground"
              )}
            >
              {item.index}
              <span
                className={cn("mx-2", onDark ? "text-white/30" : "text-border")}
              >
                /
              </span>
              {item.title}
            </p>
            <p
              className={cn(
                "mt-2 max-w-sm text-sm leading-relaxed",
                onDark ? "text-white/80" : "text-foreground/70"
              )}
            >
              {item.body}
            </p>
          </li>
        ))}
      </ul>
    </aside>
  );
}
