"use client";

import PerspectiveText3D from "@repo/smoothui/components/perspective-text-3d";
import { useState } from "react";

export default function PerspectiveText3DDemo() {
  const [runId, setRunId] = useState(0);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6 px-4 py-8">
      <div className="flex h-56 w-full items-center justify-center rounded-2xl border border-foreground/15 bg-muted">
        <PerspectiveText3D
          className="text-center font-bold text-3xl leading-tight"
          depth={36}
          driver="pointer"
          key={runId}
          split="lines"
          text={"Depth on\nevery line"}
        />
      </div>
      <button
        className="rounded-full border border-foreground/15 bg-background px-4 py-2 text-foreground text-sm transition-colors hover:bg-foreground/5"
        onClick={() => setRunId((id) => id + 1)}
        type="button"
      >
        Replay
      </button>
      <p className="text-center text-muted-foreground text-xs">
        Move your pointer over the box — each line tilts on its own Z plane.
      </p>
    </div>
  );
}
