"use client";

import type { CoverflowCarouselItem } from "@repo/smoothui/components/coverflow-carousel";
import CoverflowCarousel from "@repo/smoothui/components/coverflow-carousel";

const items: CoverflowCarouselItem[] = [
  {
    alt: "Misty mountain range at sunrise",
    id: "slide-1",
    image: "https://picsum.photos/seed/coverflow-1/600/500",
  },
  {
    alt: "Winding coastal road along cliffs",
    id: "slide-2",
    image: "https://picsum.photos/seed/coverflow-2/600/500",
  },
  {
    alt: "Dense green forest canopy",
    id: "slide-3",
    image: "https://picsum.photos/seed/coverflow-3/600/500",
  },
  {
    alt: "City skyline at dusk",
    id: "slide-4",
    image: "https://picsum.photos/seed/coverflow-4/600/500",
  },
  {
    alt: "Desert dunes under a clear sky",
    id: "slide-5",
    image: "https://picsum.photos/seed/coverflow-5/600/500",
  },
];

export default function CoverflowCarouselDemo() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12">
      <CoverflowCarousel autoplay autoplayDelay={4000} items={items} loop />
    </div>
  );
}
