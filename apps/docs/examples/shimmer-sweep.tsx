"use client";

import ShimmerSweep from "@repo/smoothui/components/shimmer-sweep";

const ShimmerSweepDemo = () => (
  <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 text-center">
    <ShimmerSweep className="font-bold text-4xl tracking-tight">
      Motion is meaning.
    </ShimmerSweep>
    <ShimmerSweep className="text-lg text-muted-foreground" delay={400}>
      A subtle sweep across a clean headline.
    </ShimmerSweep>
  </div>
);

export default ShimmerSweepDemo;
