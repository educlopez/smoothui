import { TeamCarousel } from "@/components/smoothui/blocks/TeamCarousel"
import { TeamGrid } from "@/components/smoothui/blocks/TeamGrid"

import type { BlocksProps } from "./typeBlock"

export const teamBlocks: BlocksProps[] = [
  {
    title: "Team Grid",
    description:
      "A responsive grid layout for showcasing team members with avatars, social links, and smooth hover animations.",
    componentPath: "src/components/smoothui/blocks/TeamGrid.tsx",
    componentUi: TeamGrid,
    stylePath: undefined,
  },
  {
    title: "Team Carousel",
    description:
      "An interactive carousel for team members with navigation controls, auto-play functionality, and smooth transitions.",
    componentPath: "src/components/smoothui/blocks/TeamCarousel.tsx",
    componentUi: TeamCarousel,
    stylePath: undefined,
  },
]
