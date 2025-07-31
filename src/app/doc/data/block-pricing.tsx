import { PricingCreative } from "@/components/smoothui/blocks/PricingCreative"
import { PricingModern } from "@/components/smoothui/blocks/PricingModern"
import { PricingSimple } from "@/components/smoothui/blocks/PricingSimple"

import type { BlocksProps } from "./typeBlock"

export const pricingBlocks: BlocksProps[] = [
  {
    title: "Simple Pricing",
    description: "A single plan pricing section with entry animation.",
    componentPath: "src/components/smoothui/blocks/PricingSimple.tsx",
    componentUi: PricingSimple,
  },
  {
    title: "Modern Pricing",
    description:
      "A modern, glassmorphic pricing section with gradients and a featured plan.",
    componentPath: "src/components/smoothui/blocks/PricingModern.tsx",
    componentUi: PricingModern,
  },
  {
    title: "Creative Pricing",
    description:
      "A playful, card-overlap pricing section with vibrant colors and floating animation.",
    componentPath: "src/components/smoothui/blocks/PricingCreative.tsx",
    componentUi: PricingCreative,
  },
]
