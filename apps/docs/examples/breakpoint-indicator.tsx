"use client";

import BreakpointIndicator from "@repo/smoothui/components/breakpoint-indicator";

export default function BreakpointIndicatorDemo() {
  return (
    <div className="relative mx-auto h-64 w-full max-w-2xl overflow-hidden rounded-xl border border-foreground/10 bg-foreground/[0.02] px-4 py-8">
      <p className="text-center text-muted-foreground text-sm">
        Resize your browser window to see the badge update — it always measures
        the full page viewport, not this preview box.
      </p>
      <BreakpointIndicator enabled fixed={false} showRuler />
    </div>
  );
}
