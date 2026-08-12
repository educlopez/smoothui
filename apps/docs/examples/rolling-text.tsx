"use client";

import RollingText from "@repo/smoothui/components/rolling-text";
import { useState } from "react";

export default function RollingTextDemo() {
  const [runId, setRunId] = useState(0);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-8 px-4 py-8">
      <div className="flex flex-col items-center gap-4">
        <RollingText
          className="font-bold text-4xl tabular-nums tracking-tight"
          key={runId}
          rampLength={6}
          text="042,918"
        />
        <button
          className="rounded-full border border-foreground/15 bg-background px-4 py-2 text-foreground text-sm transition-colors hover:bg-foreground/5"
          onClick={() => setRunId((id) => id + 1)}
          type="button"
        >
          Replay
        </button>
      </div>

      <div className="flex flex-col items-center gap-2 text-center">
        <RollingText
          className="font-semibold text-2xl"
          key={`hover-${runId}`}
          trigger="hover"
          text="Hover to roll"
        />
        <p className="text-muted-foreground text-xs">
          Hover-capable devices only — try it with a mouse
        </p>
      </div>
    </div>
  );
}
