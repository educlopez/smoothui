import { PricingCreative } from "@/components/smoothui/blocks/PricingCreative"
import { PricingModern } from "@/components/smoothui/blocks/PricingModern"
import { PricingSimple } from "@/components/smoothui/blocks/PricingSimple"

import type { BlocksProps } from "./typeBlock"

export const pricingBlocks: BlocksProps[] = [
  {
    title: "Simple Pricing",
    description:
      "A clean, single plan pricing section with smooth animations and gradient accents.",
    componentPath: "src/components/smoothui/blocks/PricingSimple.tsx",
    componentUi: PricingSimple,
  },
  {
    title: "Two Pricings",
    description:
      "A modern pricing section with two plans featuring glassmorphic design and vibrant gradients.",
    componentPath: "src/components/smoothui/blocks/PricingCreative.tsx",
    componentUi: PricingCreative,
  },
  {
    title: "Three Pricings",
    description:
      "A comprehensive pricing section with three tiers, featuring a highlighted popular plan and enterprise options.",
    componentPath: "src/components/smoothui/blocks/PricingModern.tsx",
    componentUi: PricingModern,
  },
]
