"use client";

import { useKit } from "@docs/lib/kit-context";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { IconBag24Fill24, IconCheckFill24 } from "nucleo-core-fill-24";

export interface AddToKitButtonProps {
  className?: string;
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
        "inline-flex items-center gap-1 rounded-md border px-2 py-1 font-medium text-[10px] transition-colors",
        inKit
          ? "border-brand/30 bg-brand/10 text-brand"
          : "border-border text-muted-foreground hover:text-foreground",
        className
      )}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle({ slug, title });
      }}
      type="button"
    >
      {inKit ? (
        <IconCheckFill24 aria-hidden="true" className="h-3 w-3" />
      ) : (
        <IconBag24Fill24 aria-hidden="true" className="h-3 w-3" />
      )}
      {inKit ? "Added" : "Add"}
    </button>
  );
}
