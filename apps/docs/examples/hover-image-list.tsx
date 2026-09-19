"use client";

import HoverImageList from "@repo/smoothui/components/hover-image-list";

import { castPeople } from "@smoothui/data/cast";

const items = castPeople.slice(0, 4).map((image, index) => ({
  alt: image.alt,
  href: "#",
  id: image.id,
  image: `${image.src}?tr=w-640,h-480,f-auto`,
  meta: image.role,
  title: `${String(index + 1).padStart(2, "0")} — ${image.name}`,
}));

export default function HoverImageListDemo() {
  return (
    <div className="mx-auto w-full max-w-xl px-4 py-8">
      <HoverImageList imageSize={220} items={items} />
    </div>
  );
}
