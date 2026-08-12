"use client";

import type { OrbitalImageWheelItem } from "@repo/smoothui/components/orbital-image-wheel";
import OrbitalImageWheel from "@repo/smoothui/components/orbital-image-wheel";

const LABELS = [
  "Aurora",
  "Basalt",
  "Cobalt",
  "Dune",
  "Ember",
  "Frost",
  "Glacier",
  "Horizon",
] as const;

const items: OrbitalImageWheelItem[] = LABELS.map((label, index) => ({
  alt: `${label} preview photo`,
  id: `orbit-${index}`,
  image: `https://picsum.photos/seed/orbital-${label}/160/160`,
  label,
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
