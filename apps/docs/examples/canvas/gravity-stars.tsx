"use client";

import GravityStars from "@repo/smoothui/components/gravity-stars";

/**
 * The dense, linked configuration: enough stars that the constellation lines
 * keep forming and breaking on their own, so the field is alive before anyone
 * touches it. Dark surface in both themes — a starfield needs a night.
 */
const GravityStarsCanvasDemo = () => (
  <GravityStars
    className="h-[200px] w-[300px] rounded-2xl bg-[oklch(0.145_0.014_264)]"
    connect
    connectDistance={135}
    count={320}
    glow={4}
    starSize={1.1}
    tint={0.85}
    twinkle={0.75}
  />
);

export default GravityStarsCanvasDemo;
