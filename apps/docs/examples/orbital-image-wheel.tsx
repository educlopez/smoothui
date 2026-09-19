"use client";

import type { OrbitalImageWheelItem } from "@repo/smoothui/components/orbital-image-wheel";
import OrbitalImageWheel from "@repo/smoothui/components/orbital-image-wheel";
import { approvedAbstracts } from "@smoothui/data/scenes";

const items: OrbitalImageWheelItem[] = approvedAbstracts
  .slice(0, 8)
  .map((scene) => ({
    alt: scene.alt,
    id: scene.id,
    image: `${scene.src}?tr=w-160,h-160,f-auto`,
    label: scene.id.split("-").join(" "),
  }));

export default function OrbitalImageWheelDemo() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-4 px-4 py-8">
      <OrbitalImageWheel autoRotate autoRotateSpeed={10} items={items} snap />
      <p className="text-muted-foreground text-xs">
        Drag to spin, or focus an item and use Arrow Left / Right.
      </p>
    </div>
  );
}
