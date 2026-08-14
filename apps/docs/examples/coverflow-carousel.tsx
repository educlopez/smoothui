"use client";

import type { CoverflowCarouselItem } from "@repo/smoothui/components/coverflow-carousel";
import CoverflowCarousel from "@repo/smoothui/components/coverflow-carousel";

const items: CoverflowCarouselItem[] = [
  {
    alt: "A mountainside catching low golden light",
    id: "slide-1",
    image:
      "https://ik.imagekit.io/16u211libb/smoothui/scenes/golden-ridge.webp?tr=w-600,h-500,f-auto",
  },
  {
    alt: "Blue ridges receding into the night",
    id: "slide-2",
    image:
      "https://ik.imagekit.io/16u211libb/smoothui/scenes/blue-ridge-night.webp?tr=w-600,h-500,f-auto",
  },
  {
    alt: "A watercolour grove fading into white",
    id: "slide-3",
    image:
      "https://ik.imagekit.io/16u211libb/smoothui/scenes/watercolor-grove.webp?tr=w-600,h-500,f-auto",
  },
  {
    alt: "A canyon under a churning violet sky",
    id: "slide-4",
    image:
      "https://ik.imagekit.io/16u211libb/smoothui/scenes/nebula-canyon.webp?tr=w-600,h-500,f-auto",
  },
  {
    alt: "A pale dune crest in deep shadow",
    id: "slide-5",
    image:
      "https://ik.imagekit.io/16u211libb/smoothui/scenes/dune-shadow.webp?tr=w-600,h-500,f-auto",
  },
];

export default function CoverflowCarouselDemo() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12">
      <CoverflowCarousel autoplay autoplayDelay={4000} items={items} loop />
    </div>
  );
}
