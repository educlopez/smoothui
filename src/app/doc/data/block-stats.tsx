import { StatsCards } from "@/components/smoothui/blocks/StatsCards"
import { StatsGrid } from "@/components/smoothui/blocks/StatsGrid"

import type { BlocksProps } from "./typeBlock"

export const statsBlocks: BlocksProps[] = [
  {
    title: "Stats Grid",
    description:
      "A clean grid layout for displaying key statistics and metrics with smooth entrance animations and hover effects.",
    componentPath: "src/components/smoothui/blocks/StatsGrid.tsx",
    componentUi: StatsGrid,
    stylePath: undefined,
  },
  {
    title: "Stats Cards",
    description:
      "Beautiful stat cards with icons, trend indicators, and animated counters for showcasing business metrics and achievements.",
    componentPath: "src/components/smoothui/blocks/StatsCards.tsx",
    componentUi: StatsCards,
    stylePath: undefined,
  },
]
