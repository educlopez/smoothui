import React from "react"

import { PricingCard } from "@/components/smoothui/blocks/PricingCard"
import { PricingCreative } from "@/components/smoothui/blocks/PricingCreative"
import { PricingModern } from "@/components/smoothui/blocks/PricingModern"
import { PricingMulti } from "@/components/smoothui/blocks/PricingMulti"
import { PricingSimple } from "@/components/smoothui/blocks/PricingSimple"

export const pricingBlocks = [
  {
    title: "Simple Pricing",
    description: "A single plan pricing section with entry animation.",
    component: () => <PricingSimple />,
    componentPath: "src/components/smoothui/blocks/PricingSimple.tsx",
    componentUi: PricingSimple,
  },
  {
    title: "Multi-Plan Pricing",
    description: "Three plans with highlight and staggered animation.",
    component: () => <PricingMulti />,
    componentPath: "src/components/smoothui/blocks/PricingMulti.tsx",
    componentUi: PricingMulti,
  },
  {
    title: "Card Pricing",
    description: "A centered card with badge and animated entry.",
    component: () => <PricingCard />,
    componentPath: "src/components/smoothui/blocks/PricingCard.tsx",
    componentUi: PricingCard,
  },
  {
    title: "Modern Pricing",
    description:
      "A modern, glassmorphic pricing section with gradients and a featured plan.",
    component: () => <PricingModern />,
    componentPath: "src/components/smoothui/blocks/PricingModern.tsx",
    componentUi: PricingModern,
  },
  {
    title: "Creative Pricing",
    description:
      "A playful, card-overlap pricing section with vibrant colors and floating animation.",
    component: () => <PricingCreative />,
    componentPath: "src/components/smoothui/blocks/PricingCreative.tsx",
    componentUi: PricingCreative,
  },
]
