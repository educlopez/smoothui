"use client";

import PerWordCrossfade from "@repo/smoothui/components/per-word-crossfade";

const PerWordCrossfadeDemo = () => (
  <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 text-center">
    <PerWordCrossfade className="font-bold text-4xl tracking-tight">
      Think different.
    </PerWordCrossfade>
    <PerWordCrossfade className="text-lg text-muted-foreground" delay={400}>
      Per-word crossfade reveal.
    </PerWordCrossfade>
  </div>
);

export default PerWordCrossfadeDemo;
