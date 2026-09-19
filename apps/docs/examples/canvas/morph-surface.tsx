"use client";

import MorphSurface from "@repo/smoothui/components/morph-surface";

/**
 * MorphSurface reserves a 360x200 stage so the dock has room to expand into the
 * feedback panel. On a tile that stage is mostly empty air, so the window below
 * trims it to the dock itself — nothing is cropped except the transparent space
 * the panel would have grown into. The orb inside keeps turning on its own.
 */
const STAGE_OFFSET_X = -70;
const STAGE_OFFSET_Y = -30;

const MorphSurfaceCanvasDemo = () => (
  <div className="relative h-[72px] w-[220px] overflow-hidden">
    <div
      className="absolute"
      style={{ left: STAGE_OFFSET_X, top: STAGE_OFFSET_Y }}
    >
      <MorphSurface />
    </div>
  </div>
);

export default MorphSurfaceCanvasDemo;
