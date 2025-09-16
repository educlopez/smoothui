import { FooterComplex } from "@/components/smoothui/blocks/FooterComplex"
import { FooterSimple } from "@/components/smoothui/blocks/FooterSimple"

import type { BlocksProps } from "./typeBlock"

export const footerBlocks: BlocksProps[] = [
  {
    title: "Simple Footer",
    description:
      "A clean and minimal footer with company info, social links, and organized navigation sections.",
    componentPath: "src/components/smoothui/blocks/FooterSimple.tsx",
    componentUi: FooterSimple,
    stylePath: undefined,
  },
  {
    title: "Complex Footer",
    description:
      "A comprehensive footer with newsletter signup, multiple link sections, social media, and detailed company information.",
    componentPath: "src/components/smoothui/blocks/FooterComplex.tsx",
    componentUi: FooterComplex,
    stylePath: undefined,
  },
]
