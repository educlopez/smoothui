"use client";

import HoverImageList from "@repo/smoothui/components/hover-image-list";

const items = [
  {
    alt: "A mountainside catching low golden light",
    href: "#",
    id: "01",
    image:
      "https://ik.imagekit.io/16u211libb/smoothui/scenes/golden-ridge.webp?tr=w-640,h-480,f-auto",
    meta: "Interior — 2026",
    title: "Golden Ridge",
  },
  {
    alt: "A rust-red mountain against a pale sky",
    href: "#",
    id: "02",
    image:
      "https://ik.imagekit.io/16u211libb/smoothui/scenes/rust-peak.webp?tr=w-640,h-480,f-auto",
    meta: "Architecture — 2025",
    title: "Rust Peak",
  },
  {
    alt: "A watercolour grove fading into white",
    href: "#",
    id: "03",
    image:
      "https://ik.imagekit.io/16u211libb/smoothui/scenes/watercolor-grove.webp?tr=w-640,h-480,f-auto",
    meta: "Editorial — 2025",
    title: "Pale Grove",
  },
  {
    alt: "A pale dune crest in deep shadow",
    href: "#",
    id: "04",
    image:
      "https://ik.imagekit.io/16u211libb/smoothui/scenes/dune-shadow.webp?tr=w-640,h-480,f-auto",
    meta: "Product — 2024",
    title: "Dune Shadow",
  },
];

export default function HoverImageListDemo() {
  return (
    <div className="mx-auto w-full max-w-xl px-4 py-8">
      <HoverImageList imageSize={220} items={items} />
    </div>
  );
}
