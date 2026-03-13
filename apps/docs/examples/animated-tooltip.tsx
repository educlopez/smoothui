"use client";

import SmoothButton from "@repo/smoothui/components/smooth-button";
import AnimatedTooltip from "@repo/smoothui/components/animated-tooltip";

export default function AnimatedTooltipDemo() {
  return (
    <div className="flex flex-col items-center gap-12 py-8">
      <div className="flex flex-wrap items-center justify-center gap-8">
        <AnimatedTooltip content="Tooltip on top" placement="top">
          <SmoothButton size="sm">Top</SmoothButton>
        </AnimatedTooltip>

        <AnimatedTooltip content="Tooltip on bottom" placement="bottom">
          <SmoothButton size="sm">Bottom</SmoothButton>
        </AnimatedTooltip>

        <AnimatedTooltip content="Tooltip on left" placement="left">
          <SmoothButton size="sm">Left</SmoothButton>
        </AnimatedTooltip>

        <AnimatedTooltip content="Tooltip on right" placement="right">
          <SmoothButton size="sm">Right</SmoothButton>
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
          <SmoothButton size="sm" variant="outline">Rich Content</SmoothButton>
        </AnimatedTooltip>

        <AnimatedTooltip
          content="I appear after 500ms"
          delay={500}
          placement="bottom"
        >
          <SmoothButton size="sm" variant="outline">With Delay</SmoothButton>
        </AnimatedTooltip>
      </div>
    </div>
  );
}
