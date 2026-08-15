"use client";

import AuroraCurtain from "@repo/smoothui/components/aurora-curtain";

/**
 * A night sky and the light in it. The panel keeps its own dark surface in both
 * themes on purpose — an aurora only exists against a night sky.
 */
const BOREAL = [
  "oklch(0.78 0.16 148)",
  "oklch(0.79 0.11 196)",
  "oklch(0.70 0.17 318)",
];

const AuroraCurtainCanvasDemo = () => (
  <AuroraCurtain
    bands={3}
    blur={0.25}
    className="h-[150px] w-[320px] rounded-2xl bg-[oklch(0.15_0.02_265)] ring-1 ring-[oklch(1_0_0_/_0.08)]"
    colors={BOREAL}
    direction="down"
    intensity={1}
    noise={0.6}
    speed={0.95}
  />
);

export default AuroraCurtainCanvasDemo;
