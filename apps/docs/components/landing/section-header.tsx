"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import type { ReactNode } from "react";

export interface SectionHeaderProps {
  align?: "center" | "left";
  className?: string;
  description?: ReactNode;
  title: ReactNode;
}

export function SectionHeader({
  title,
  description,
  className,
  align = "center",
}: SectionHeaderProps) {
  const isCenter = align === "center";

  return (
    <div
      className={cn("max-w-2xl", isCenter && "mx-auto text-center", className)}
    >
      {/* Static on purpose: fading headings in on scroll delays the content
          people scrolled to read. */}
      <h2
        className={cn(
          "text-balance font-semibold font-title text-3xl text-foreground md:text-4xl",
          isCenter && "text-center"
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-4 text-balance text-muted-foreground",
            isCenter && "text-center"
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
