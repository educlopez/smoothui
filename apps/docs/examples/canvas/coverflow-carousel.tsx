"use client";

import type { CoverflowCarouselItem } from "@repo/smoothui/components/coverflow-carousel";
import CoverflowCarousel from "@repo/smoothui/components/coverflow-carousel";

/** Autoplay pace. The component owns the timer; this only sets the tempo. */
const AUTOPLAY_MS = 2600;
/**
 * The covers are a fixed 280px and the fan needs room either side, so the
 * carousel is laid out at its natural width and the whole stage is scaled down
 * to the tile. Scaling keeps the perspective intact — clipping would not.
 */
const STAGE_WIDTH = 560;
const STAGE_SCALE = 0.6;

const items: CoverflowCarouselItem[] = [
  {
    alt: "A mountainside catching low golden light",
    id: "ridge",
    image:
      "https://ik.imagekit.io/16u211libb/smoothui/scenes/golden-ridge.webp?tr=w-600,h-500,f-auto",
  },
  {
    alt: "Blue ridges receding into the night",
    id: "coast",
    image:
      "https://ik.imagekit.io/16u211libb/smoothui/scenes/blue-ridge-night.webp?tr=w-600,h-500,f-auto",
  },
  {
    alt: "A pale dune crest in deep shadow",
    id: "dunes",
    image:
      "https://ik.imagekit.io/16u211libb/smoothui/scenes/dune-shadow.webp?tr=w-600,h-500,f-auto",
  },
];

/**
 * Three covers, not five: at tile size a longer deck collapses into a smear of
 * slivers, where three keep a readable centre with a shoulder either side.
 */
const CoverflowCarouselCanvasDemo = () => (
  <div className="h-[204px] w-[336px] overflow-hidden">
    <div
      className="origin-top-left"
      style={{
        transform: `scale(${STAGE_SCALE})`,
        width: STAGE_WIDTH,
      }}
    >
      <CoverflowCarousel
        autoplay
        autoplayDelay={AUTOPLAY_MS}
        // Prev/Next are controls, and nothing on this canvas is operable.
        className="[&_button]:hidden"
        depth={210}
        items={items}
        loop
        rotation={46}
        scaleStep={0.22}
        spacing={160}
      />
    </div>
  </div>
);

export default CoverflowCarouselCanvasDemo;
