"use client";

import type { OrbitalImageWheelItem } from "@repo/smoothui/components/orbital-image-wheel";
import OrbitalImageWheel from "@repo/smoothui/components/orbital-image-wheel";
import { sceneById } from "@smoothui/data/scenes";

// The labels were already the names of colours and landforms, so each one gets
// the image it is actually naming — a wheel of eight identical thumbnails
// defeats the point of a wheel.
const ENTRIES = [
  { label: "Aurora", scene: "cyan-aurora" },
  { label: "Basalt", scene: "blue-ridge-night" },
  { label: "Cobalt", scene: "cobalt-fade" },
  { label: "Dune", scene: "dune-shadow" },
  { label: "Ember", scene: "ember-drift" },
  { label: "Frost", scene: "silk-waves" },
  { label: "Glacier", scene: "pale-iridescence" },
  { label: "Horizon", scene: "golden-ridge" },
] as const;

const items: OrbitalImageWheelItem[] = ENTRIES.map((entry, index) => {
  const scene = sceneById(entry.scene);
  return {
    alt: scene?.alt ?? entry.label,
    id: `orbit-${index}`,
    image: `${scene?.src}?tr=w-160,h-160,f-auto`,
    label: entry.label,
  };
});

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
