import { LogoCloudAnimated } from "@/components/smoothui/blocks/LogoCloudAnimated"
import { LogoCloudSimple } from "@/components/smoothui/blocks/LogoCloudSimple"

import type { BlocksProps } from "./typeBlock"

export const logoCloudBlocks: BlocksProps[] = [
  {
    title: "Simple Logos",
    description:
      "A clean and simple logos section to showcase trusted partners and clients with hover effects.",
    componentPath: "src/components/smoothui/blocks/LogoCloudSimple.tsx",
    componentUi: LogoCloudSimple,
    stylePath: undefined,
  },
  {
    title: "Animated Logos",
    description:
      "An eye-catching logos section with infinite scrolling animation and interactive hover effects for dynamic brand showcases.",
    componentPath: "src/components/smoothui/blocks/LogoCloudAnimated.tsx",
    componentUi: LogoCloudAnimated,
    stylePath: undefined,
  },
]
