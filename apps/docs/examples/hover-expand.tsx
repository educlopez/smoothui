"use client";

import type { HoverExpandItem } from "@repo/smoothui/components/hover-expand";
import HoverExpand from "@repo/smoothui/components/hover-expand";

const items: HoverExpandItem[] = [
  {
    alt: "Snow-capped peak against a blue sky",
    description: "High-altitude trails for experienced hikers.",
    id: "mountains",
    image: "https://picsum.photos/seed/hover-expand-1/500/700",
    title: "Mountains",
  },
  {
    alt: "Calm turquoise ocean water",
    description: "Sandy beaches and warm coastal breeze.",
    id: "ocean",
    image: "https://picsum.photos/seed/hover-expand-2/500/700",
    title: "Ocean",
  },
  {
    alt: "Tall trees in a quiet forest",
    description: "Shaded paths through old-growth woodland.",
    id: "forest",
    image: "https://picsum.photos/seed/hover-expand-3/500/700",
    title: "Forest",
  },
  {
    alt: "Golden desert dunes",
    description: "Wide open dunes under a clear horizon.",
    id: "desert",
    image: "https://picsum.photos/seed/hover-expand-4/500/700",
    title: "Desert",
  },
  {
    alt: "City skyline lit up at night",
    description: "Bright streets and busy skylines after dark.",
    id: "city",
    image: "https://picsum.photos/seed/hover-expand-5/500/700",
    title: "City",
  },
];

export default function HoverExpandDemo() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12">
      <HoverExpand items={items} orientation="horizontal" />
    </div>
  );
}
