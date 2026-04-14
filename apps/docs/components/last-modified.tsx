import { cn } from "@repo/shadcn-ui/lib/utils";

export interface LastModifiedProps {
  className?: string;
  /**
   * The last modified timestamp in milliseconds
   */
  lastModified: number;
}

export function LastModified({ lastModified, className }: LastModifiedProps) {
  const date = new Date(lastModified);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <p className={cn("text-foreground/70 text-sm", className)}>
      Last updated: {formattedDate}
    </p>
  );
}
