"use client";

import RansomNote from "@repo/smoothui/components/ransom-note";
import { useState } from "react";

export default function RansomNoteDemo() {
  const [seed, setSeed] = useState(1);
  const [runId, setRunId] = useState(0);

  const reseed = () => {
    setSeed((current) => current + 1);
    setRunId((id) => id + 1);
  };

  const replay = () => {
    setRunId((id) => id + 1);
  };

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-10 px-4 py-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <RansomNote
          animate="assemble"
          className="text-3xl"
          key={`assemble-${seed}-${runId}`}
          seed={seed}
          stagger={0.04}
          text="WE HAVE YOUR CAT"
        />
        <p className="text-muted-foreground text-xs">
          Scraps fly in from seeded offsets and settle into place.
        </p>
      </div>

      <div className="flex flex-col items-center gap-4 text-center">
        <RansomNote
          animate="jitter"
          className="text-3xl"
          key={`jitter-${seed}-${runId}`}
          seed={seed}
          stagger={0.05}
          text="DO NOT FOLLOW US"
        />
        <p className="text-muted-foreground text-xs">
          Scraps stay put and idly wobble, like loose paper cut-outs.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          className="rounded-full border border-foreground/15 bg-background px-4 py-2 text-foreground text-sm transition-colors hover:bg-foreground/5"
          onClick={reseed}
          type="button"
        >
          Re-seed
        </button>
        <button
          className="rounded-full border border-foreground/15 bg-background px-4 py-2 text-foreground text-sm transition-colors hover:bg-foreground/5"
          onClick={replay}
          type="button"
        >
          Replay
        </button>
      </div>
    </div>
  );
}
