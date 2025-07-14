import { HeroShowcase } from "@/components/smoothui/blocks/HeroShowcase"

import { BlocksProps } from "./typeBlock"

export const heroBlocks: BlocksProps[] = [
  {
    title: "Showcase Hero",
    description:
      "A beautiful, UX-friendly hero with animated headline, buttons, logos, and image.",
    componentPath: "src/components/smoothui/blocks/HeroShowcase.tsx",
    componentUi: HeroShowcase,
  },
]
