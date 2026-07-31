"use client";

import { useKit } from "@docs/lib/kit-context";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { track } from "@vercel/analytics";
import { PackagePlus } from "lucide-react";
import { IconCheckFill24 } from "nucleo-core-fill-24";

export interface AddToKitButtonProps {
  className?: string;
  iconOnly?: boolean;
  size?: "xs" | "sm";
  slug: string;
  title: string;
}

/**
 * Toggle a component in/out of the install kit. Stop event propagation so it
 * works inside linked cards without triggering navigation.
 */
export function AddToKitButton({
  slug,
  title,
  className,
  iconOnly = false,
  size = "sm",
}: AddToKitButtonProps) {
  const { has, toggle } = useKit();
  const inKit = has(slug);

  return (
    <button
      aria-label={
        inKit ? `Remove ${title} from bundle` : `Add ${title} to bundle`
      }
      aria-pressed={inKit}
      className={cn(
        "inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-transparent bg-background font-medium shadow-black/15 shadow-sm ring-1 ring-foreground/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:ring-foreground/15",
        size === "sm" && "h-9 px-3 text-sm [&_svg]:size-4",
        size === "xs" && "h-7 px-2.5 text-xs [&_svg]:size-3.5",
        iconOnly && size === "sm" && "w-9 px-0",
        iconOnly && size === "xs" && "w-7 px-0",
        inKit
          ? "border-brand/30 bg-brand/10 text-brand hover:bg-brand/15"
          : "text-foreground hover:bg-primary",
        className
      )}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!inKit) {
          track("bundle_add", { slug });
        }
        toggle({ slug, title });
      }}
      title={inKit ? "Remove from bundle" : "Add to bundle"}
      type="button"
    >
      {/* A box with a plus says "add this to the pile I am installing".
          The stacked-diamonds mark it replaced read as a generic logo. */}
      {inKit ? (
        <IconCheckFill24 aria-hidden="true" />
      ) : (
        <PackagePlus aria-hidden="true" />
      )}
      {!iconOnly && (inKit ? "Added" : "Add")}
    </button>
  );
}
