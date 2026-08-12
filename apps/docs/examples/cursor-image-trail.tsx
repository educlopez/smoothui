"use client";

import CursorImageTrail from "@repo/smoothui/components/cursor-image-trail";

const trailImages = [
  {
    alt: "Mountain landscape at sunset",
    src: "https://picsum.photos/seed/trail-1/300/300",
  },
  {
    alt: "Close-up of a leaf",
    src: "https://picsum.photos/seed/trail-2/300/300",
  },
  {
    alt: "City skyline at night",
    src: "https://picsum.photos/seed/trail-3/300/300",
  },
  {
    alt: "Ocean waves from above",
    src: "https://picsum.photos/seed/trail-4/300/300",
  },
  {
    alt: "Desert dunes texture",
    src: "https://picsum.photos/seed/trail-5/300/300",
  },
  {
    alt: "Forest path in autumn",
    src: "https://picsum.photos/seed/trail-6/300/300",
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
