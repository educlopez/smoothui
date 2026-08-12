"use client";

import HoverImageList from "@repo/smoothui/components/hover-image-list";

const items = [
  {
    alt: "Modern living room with warm lighting",
    href: "#",
    id: "01",
    image: "https://picsum.photos/seed/hover-list-1/640/480",
    meta: "Interior — 2026",
    title: "Quiet House",
  },
  {
    alt: "Minimal concrete architecture",
    href: "#",
    id: "02",
    image: "https://picsum.photos/seed/hover-list-2/640/480",
    meta: "Architecture — 2025",
    title: "Grey Block",
  },
  {
    alt: "Editorial fashion photography",
    href: "#",
    id: "03",
    image: "https://picsum.photos/seed/hover-list-3/640/480",
    meta: "Editorial — 2025",
    title: "Soft Focus",
  },
  {
    alt: "Product photography on a plain backdrop",
    href: "#",
    id: "04",
    image: "https://picsum.photos/seed/hover-list-4/640/480",
    meta: "Product — 2024",
    title: "Still Life",
  },
];

export default function HoverImageListDemo() {
  return (
    <div className="mx-auto w-full max-w-xl px-4 py-8">
      <HoverImageList imageSize={220} items={items} />
    </div>
  );
}
