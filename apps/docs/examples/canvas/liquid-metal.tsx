"use client";

import LiquidMetal from "@repo/smoothui/components/liquid-metal";

/**
 * The material clipped to type, not poured into a rectangle.
 *
 * This tile used to be a bare 300x190 chrome slab. A shader with nothing in it
 * reads as a swatch — worse, a slow swatch looks frozen at a glance, which is
 * the opposite of the claim. `maskText` clips the same surface to letterforms,
 * so the thing that moves is a word you can read, and the flow shows up in the
 * counters and along the stems where it is easiest to see.
 */
const LiquidMetalCanvasDemo = () => (
  <div className="flex w-[320px] flex-col items-center gap-3">
    <LiquidMetal
      className="font-bold text-[76px] leading-none tracking-[-0.04em]"
      distortion={1.3}
      maskText
      speed={0.85}
      variant="chrome"
    >
      CHROME
    </LiquidMetal>
    <LiquidMetal
      className="font-bold text-[76px] leading-none tracking-[-0.04em]"
      distortion={1.15}
      maskText
      speed={0.7}
      variant="gold"
    >
      GOLD
    </LiquidMetal>
  </div>
);

export default LiquidMetalCanvasDemo;
