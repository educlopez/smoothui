"use client";

import CursorImageTrail from "@repo/smoothui/components/cursor-image-trail";

const trailImages = [
  {
    alt: "Amber and violet abstract color fields",
    src: "https://ik.imagekit.io/16u211libb/smoothui/scenes/amber-violet.webp?tr=w-300,h-300,f-auto",
  },
  {
    alt: "Cobalt blue and pink abstract color fields",
    src: "https://ik.imagekit.io/16u211libb/smoothui/scenes/cobalt-pink.webp?tr=w-300,h-300,f-auto",
  },
  {
    alt: "Coral and lavender abstract color fields",
    src: "https://ik.imagekit.io/16u211libb/smoothui/scenes/coral-lavender.webp?tr=w-300,h-300,f-auto",
  },
  {
    alt: "Cyan and tangerine abstract color fields",
    src: "https://ik.imagekit.io/16u211libb/smoothui/scenes/cyan-tangerine.webp?tr=w-300,h-300,f-auto",
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
