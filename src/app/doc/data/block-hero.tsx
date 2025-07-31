import { HeroGrid } from "@/components/smoothui/blocks/HeroGrid/HeroGrid"
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
]
