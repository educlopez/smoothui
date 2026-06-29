"use client";

import { useKit } from "@docs/lib/kit-context";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { track } from "@vercel/analytics";
import { IconCheckFill24 } from "nucleo-core-fill-24";

export interface AddToKitButtonProps {
  className?: string;
  iconOnly?: boolean;
  size?: "xs" | "sm";
  slug: string;
  title: string;
}

function BundleLayersIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M12 4.5 19.25 8.35 12 12.2 4.75 8.35 12 4.5Z"
        fill="var(--color-brand)"
        opacity="0.42"
      />
      <path
        d="M7 12.2 12 14.85l5-2.65v2.35L12 17.2l-5-2.65V12.2Z"
        fill="var(--color-brand)"
        opacity="0.24"
      />
      <path
        d="M4.75 8.35 12 4.5l7.25 3.85L12 12.2 4.75 8.35Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
      <path
        d="m7 12.2 5 2.65 5-2.65M7 15.45l5 2.65 5-2.65"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
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
        "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md border border-transparent bg-background font-medium shadow-black/15 shadow-sm ring-1 ring-foreground/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:ring-foreground/15",
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
      {inKit ? <IconCheckFill24 aria-hidden="true" /> : <BundleLayersIcon />}
      {!iconOnly && (inKit ? "Added" : "Add")}
    </button>
  );
}
