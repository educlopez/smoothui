import { HeroGrid } from "@/components/smoothui/blocks/HeroGrid/HeroGrid"
import { HeroProduct } from "@/components/smoothui/blocks/HeroProduct"
import { HeroShowcase } from "@/components/smoothui/blocks/HeroShowcase"

import type { BlocksProps } from "./typeBlock"

export const heroBlocks: BlocksProps[] = [
  {
    title: "Showcase Hero",
    description:
      "A beautiful, UX-friendly hero with animated headline, buttons, logos, and image.",
    componentPath: "src/components/smoothui/blocks/HeroShowcase.tsx",
    componentUi: HeroShowcase,
    stylePath: undefined, // No CSS extra para este block
  },
  {
    title: "Smoothui Animated Hero",
    description:
      "A modern hero section with Smoothui-style entrance animations, animated text, buttons, and logos.",
    componentPath: "src/components/smoothui/blocks/HeroGrid/HeroGrid.tsx",
    componentUi: HeroGrid,
    stylePath: "src/components/smoothui/blocks/HeroGrid/HeroGrid.module.css", // Asociar CSS extra
  },
  {
    title: "Product Hero",
    description:
      "A modern product hero section with smooth entrance animations, rotating sparkle icon, and interactive elements perfect for showcasing applications.",
    componentPath: "src/components/smoothui/blocks/HeroProduct.tsx",
    componentUi: HeroProduct,
    stylePath: undefined, // No CSS extra para este block
  },
]
