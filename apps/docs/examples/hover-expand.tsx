"use client";

import type { HoverExpandItem } from "@repo/smoothui/components/hover-expand";
import HoverExpand from "@repo/smoothui/components/hover-expand";
import { sceneById } from "@smoothui/data/scenes";

// Built from the scene dictionary so the alt text can never drift from the
// picture — which is exactly what happened when the two were maintained apart.
const ENTRIES = [
  {
    description: "High-altitude trails for experienced hikers.",
    scene: "rust-peak",
    title: "Mountains",
  },
  {
    description: "Still water, and a fire worth the walk in.",
    scene: "lake-camp",
    title: "Lake",
  },
  {
    description: "Shaded paths through old-growth woodland.",
    scene: "watercolor-grove",
    title: "Forest",
  },
  {
    description: "Wide open dunes under a clear horizon.",
    scene: "dune-shadow",
    title: "Desert",
  },
  {
    description: "A moon big enough to read by.",
    scene: "moonrise-valley",
    title: "Night",
  },
] as const;

const items: HoverExpandItem[] = ENTRIES.map((entry) => {
  const scene = sceneById(entry.scene);
  return {
    alt: scene?.alt ?? entry.title,
    description: entry.description,
    id: entry.scene,
    image: `${scene?.src}?tr=w-500,h-700,f-auto`,
    title: entry.title,
  };
});

export default function HoverExpandDemo() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12">
      <HoverExpand items={items} orientation="horizontal" />
    </div>
  );
}
