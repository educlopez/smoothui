"use client";

import type { HoverExpandItem } from "@repo/smoothui/components/hover-expand";
import HoverExpand from "@repo/smoothui/components/hover-expand";
import { castAnimals } from "@smoothui/data/cast";

const items: HoverExpandItem[] = [
  castAnimals[0],
  castAnimals[3],
  castAnimals[6],
  castAnimals[9],
  castAnimals[15],
].map((image) => ({
  alt: image.alt,
  description: image.role,
  id: image.id,
  image: `${image.src}?tr=w-500,h-700,f-auto`,
  title: image.name,
}));

export default function HoverExpandDemo() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12">
      <HoverExpand items={items} orientation="horizontal" />
    </div>
  );
}
