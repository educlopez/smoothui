"use client";

import CursorImageTrail from "@repo/smoothui/components/cursor-image-trail";

const trailImages = [
  {
    alt: "A mountainside catching low golden light",
    src: "https://ik.imagekit.io/16u211libb/smoothui/scenes/golden-ridge.webp?tr=w-300,h-300,f-auto",
  },
  {
    alt: "A watercolour grove fading into white",
    src: "https://ik.imagekit.io/16u211libb/smoothui/scenes/watercolor-grove.webp?tr=w-300,h-300,f-auto",
  },
  {
    alt: "A wildflower meadow under towering cumulus",
    src: "https://ik.imagekit.io/16u211libb/smoothui/scenes/cloud-meadow.webp?tr=w-300,h-300,f-auto",
  },
  {
    alt: "Pale blue silk folding in slow waves",
    src: "https://ik.imagekit.io/16u211libb/smoothui/scenes/silk-waves.webp?tr=w-300,h-300,f-auto",
  },
  {
    alt: "A pale dune crest in deep shadow",
    src: "https://ik.imagekit.io/16u211libb/smoothui/scenes/dune-shadow.webp?tr=w-300,h-300,f-auto",
  },
  {
    alt: "A vast moon rising over a wooded valley",
    src: "https://ik.imagekit.io/16u211libb/smoothui/scenes/moonrise-valley.webp?tr=w-300,h-300,f-auto",
  },
];

export default function CursorImageTrailDemo() {
  return (
    <CursorImageTrail
      className="flex h-80 w-full items-center justify-center rounded-2xl border border-foreground/10 bg-background"
      images={trailImages}
    >
      <div className="pointer-events-none flex flex-col items-center gap-2 px-6 text-center">
        <p className="font-semibold text-foreground text-xl">
          Move your cursor around
        </p>
        <p className="text-muted-foreground text-sm">
          Images spawn along the path and fade out behind it.
        </p>
      </div>
    </CursorImageTrail>
  );
}
