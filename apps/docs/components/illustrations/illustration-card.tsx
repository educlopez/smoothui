import { cn } from "@repo/shadcn-ui/lib/utils";
import type { ReactNode } from "react";

/** Lead pillar: vivid artwork stage + floating drawing, caption below. */
export const VividLeadCard = ({
  children,
  caption,
  className,
  background,
  pattern,
  stage,
  onHoverStart,
  onHoverEnd,
}: {
  children: ReactNode;
  caption: ReactNode;
  className?: string;
  background: ReactNode;
  pattern: ReactNode;
  stage?: string;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
}) => (
  <div
    className={cn(
      "group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-primary/40 transition-colors hover:bg-primary",
      className
    )}
    data-vivid-stage={stage}
    onBlurCapture={onHoverEnd}
    onFocusCapture={onHoverStart}
    onMouseEnter={onHoverStart}
    onMouseLeave={onHoverEnd}
  >
    <div className="relative flex min-h-72 flex-1 items-center justify-center overflow-hidden">
      {background}
      {pattern}
      <div className="relative z-10 flex w-full items-center justify-center p-6">
        {children}
      </div>
    </div>
    <div
      className="relative border-t bg-background p-6 text-foreground"
      data-lead-caption
    >
      {caption}
    </div>
  </div>
);
