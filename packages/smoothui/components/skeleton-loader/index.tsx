"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import type { ReactNode } from "react";

export type SkeletonProps = {
  /** When true, shows skeleton effect. When false, shows children */
  loading?: boolean;
  /** Content to wrap - skeleton will match its dimensions */
  children?: ReactNode;
  /** Additional classes */
  className?: string;
};

const Skeleton = ({
  loading = true,
  children,
  className,
}: SkeletonProps) => {
  // If not loading and has children, just render children
  if (!loading && children) {
    return <>{children}</>;
  }

  // If loading with children, wrap them and apply skeleton effect
  if (loading && children) {
    return (
      <div
        aria-busy="true"
        aria-live="polite"
        className={cn("relative", className)}
      >
        {/* Children are invisible but maintain layout */}
        <div className="invisible">{children}</div>
        {/* Skeleton overlay that matches children's dimensions */}
        <div
          className="absolute inset-0 animate-pulse rounded-[inherit] bg-muted-foreground/20"
          aria-hidden="true"
        />
      </div>
    );
  }

  // Basic skeleton block (no children)
  return (
    <div
      aria-busy="true"
      className={cn(
        "animate-pulse rounded-md bg-muted-foreground/20",
        className
      )}
    />
  );
};

export default Skeleton;
