"use client";

import GravityStars from "@repo/smoothui/components/gravity-stars";

/**
 * The field with a horizon under it, so it reads as a sky.
 *
 * On its own the starfield is a rectangle of dots — there is nothing in frame
 * to give it distance, so the eye takes it for texture. A ridge along the
 * bottom and a moon near the top establish scale, and the same particles
 * suddenly read as depth.
 */
const RIDGE =
  "polygon(0% 100%, 0% 70%, 12% 58%, 22% 72%, 33% 48%, 44% 66%, 55% 40%, 67% 62%, 78% 50%, 88% 66%, 100% 56%, 100% 100%)";

const GravityStarsCanvasDemo = () => (
  <div className="relative h-[210px] w-[320px] overflow-hidden rounded-2xl bg-[oklch(0.145_0.014_264)]">
    <GravityStars
      className="absolute inset-0"
      connect
      connectDistance={135}
      count={320}
      glow={4}
      starSize={1.1}
      tint={0.85}
      twinkle={0.75}
    />

    {/* A waning moon, low chroma so it sits behind the constellation lines
        rather than competing with them. */}
    <div
      aria-hidden="true"
      className="absolute top-6 right-8 size-9 rounded-full bg-[oklch(0.92_0.03_95)] opacity-90 shadow-[0_0_28px_10px_oklch(0.92_0.03_95/0.16)]"
    />

    <div
      aria-hidden="true"
      className="absolute inset-x-0 bottom-0 h-[34%] bg-[oklch(0.09_0.012_264)]"
      style={{ clipPath: RIDGE }}
    />
  </div>
);

export default GravityStarsCanvasDemo;
