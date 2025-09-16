import { TestimonialsGrid } from "@/components/smoothui/blocks/TestimonialsGrid"
import { TestimonialsSimple } from "@/components/smoothui/blocks/TestimonialsSimple"
import { TestimonialsStars } from "@/components/smoothui/blocks/TestimonialsStars"

import type { BlocksProps } from "./typeBlock"

export const testimonialBlocks: BlocksProps[] = [
  {
    title: "Simple Testimonials",
    description:
      "A clean testimonials section with two user quotes and entry animation.",
    componentPath: "src/components/smoothui/blocks/TestimonialsSimple.tsx",
    componentUi: TestimonialsSimple,
  },
  {
    title: "Carousel Testimonials",
    description:
      "A modern carousel layout testimonials section featuring SmoothUI community feedback with hover animations and staggered entrance effects.",
    componentPath: "src/components/smoothui/blocks/TestimonialsGrid.tsx",
    componentUi: TestimonialsGrid,
  },
  {
    title: "Star Ratings Testimonials",
    description:
      "Testimonials with animated star ratings from the SmoothUI community, featuring bouncy star animations and smooth transitions.",
    componentPath: "src/components/smoothui/blocks/TestimonialsStars.tsx",
    componentUi: TestimonialsStars,
  },
]
