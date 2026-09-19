"use client";

import type { CoverflowCarouselItem } from "@repo/smoothui/components/coverflow-carousel";
import CoverflowCarousel from "@repo/smoothui/components/coverflow-carousel";

const items: CoverflowCarouselItem[] = [
  {
    alt: "Amber and violet abstract color fields",
    id: "amber-violet",
    image:
      "https://ik.imagekit.io/16u211libb/smoothui/scenes/amber-violet.webp?tr=w-600,h-500,f-auto",
  },
  {
    alt: "Cobalt blue and pink abstract color fields",
    id: "cobalt-pink",
    image:
      "https://ik.imagekit.io/16u211libb/smoothui/scenes/cobalt-pink.webp?tr=w-600,h-500,f-auto",
  },
  {
    alt: "Coral and lavender abstract color fields",
    id: "coral-lavender",
    image:
      "https://ik.imagekit.io/16u211libb/smoothui/scenes/coral-lavender.webp?tr=w-600,h-500,f-auto",
  },
  {
    alt: "Cyan and tangerine abstract color fields",
    id: "cyan-tangerine",
    image:
      "https://ik.imagekit.io/16u211libb/smoothui/scenes/cyan-tangerine.webp?tr=w-600,h-500,f-auto",
  },
];

export default function CoverflowCarouselDemo() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12">
      <CoverflowCarousel autoplay autoplayDelay={4000} items={items} loop />
    </div>
  );
}
