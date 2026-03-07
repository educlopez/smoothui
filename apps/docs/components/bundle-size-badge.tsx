import { formatSize, getBundleSize } from "@docs/lib/bundle-size";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { Package } from "lucide-react";

export type BundleSizeBadgeProps = {
  slug: string;
  className?: string;
};

/**
 * Server Component that displays the gzipped bundle size for a component.
 * Shows a subtle pill/badge with a Package icon and size in kB.
 */
export const BundleSizeBadge = ({ slug, className }: BundleSizeBadgeProps) => {
  const size = getBundleSize(slug);

  if (!size) {
    return null;
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 font-medium text-muted-foreground text-xs",
        className
      )}
      title={`Minified: ${formatSize(size.minified)} / Gzipped: ${formatSize(size.gzipped)}`}
    >
      <Package aria-hidden="true" className="h-3 w-3" />
      {formatSize(size.gzipped)}
    </span>
  );
};
