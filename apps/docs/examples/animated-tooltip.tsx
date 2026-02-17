"use client";

import AnimatedTooltip from "@repo/smoothui/components/animated-tooltip";

export default function AnimatedTooltipDemo() {
  return (
    <div className="flex flex-col items-center gap-12 py-8">
      <div className="flex flex-wrap items-center justify-center gap-8">
        <AnimatedTooltip content="Tooltip on top" placement="top">
          <button
            className="rounded-lg bg-foreground px-4 py-2 font-medium text-background text-sm transition-opacity hover:opacity-90"
            type="button"
          >
            Top
          </button>
        </AnimatedTooltip>

        <AnimatedTooltip content="Tooltip on bottom" placement="bottom">
          <button
            className="rounded-lg bg-foreground px-4 py-2 font-medium text-background text-sm transition-opacity hover:opacity-90"
            type="button"
          >
            Bottom
          </button>
        </AnimatedTooltip>

        <AnimatedTooltip content="Tooltip on left" placement="left">
          <button
            className="rounded-lg bg-foreground px-4 py-2 font-medium text-background text-sm transition-opacity hover:opacity-90"
            type="button"
          >
            Left
          </button>
        </AnimatedTooltip>

        <AnimatedTooltip content="Tooltip on right" placement="right">
          <button
            className="rounded-lg bg-foreground px-4 py-2 font-medium text-background text-sm transition-opacity hover:opacity-90"
            type="button"
          >
            Right
          </button>
        </AnimatedTooltip>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-8">
        <AnimatedTooltip
          content={
            <span className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
              Rich content supported
            </span>
          }
          placement="top"
        >
          <button
            className="rounded-lg border border-border bg-background px-4 py-2 font-medium text-foreground text-sm transition-colors hover:bg-muted"
            type="button"
          >
            Rich Content
          </button>
        </AnimatedTooltip>

        <AnimatedTooltip
          content="I appear after 500ms"
          delay={500}
          placement="bottom"
        >
          <button
            className="rounded-lg border border-border bg-background px-4 py-2 font-medium text-foreground text-sm transition-colors hover:bg-muted"
            type="button"
          >
            With Delay
          </button>
        </AnimatedTooltip>
      </div>
    </div>
  );
}
