"use client";

import LiquidMetal from "@repo/smoothui/components/liquid-metal";

/**
 * A poured slab of the material and nothing else. The shader is the argument,
 * so the tile is the shader — no caption, no frame, no text to read.
 *
 * Chrome over the colour variants on purpose: it is the material the component
 * is named for, and it is the one whose CSS fallback still reads as metal when
 * WebGL2 is unavailable. `oil` degrades into a generic rainbow.
 */
const LiquidMetalCanvasDemo = () => (
  <LiquidMetal
    className="h-[190px] w-[300px] rounded-2xl"
    distortion={1.3}
    speed={0.85}
    variant="chrome"
  />
);

export default LiquidMetalCanvasDemo;
