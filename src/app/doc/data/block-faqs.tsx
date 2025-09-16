import { FaqsAccordion } from "@/components/smoothui/blocks/FaqsAccordion"
import { FaqsGrid } from "@/components/smoothui/blocks/FaqsGrid"

import type { BlocksProps } from "./typeBlock"

export const faqsBlocks: BlocksProps[] = [
  {
    title: "FAQs Accordion",
    description:
      "A clean accordion-style FAQ section with smooth expand/collapse animations and organized question categories.",
    componentPath: "src/components/smoothui/blocks/FaqsAccordion.tsx",
    componentUi: FaqsAccordion,
    stylePath: undefined,
  },
  {
    title: "FAQs Grid",
    description:
      "A categorized FAQ grid layout with multiple sections, making it easy to organize and find specific information.",
    componentPath: "src/components/smoothui/blocks/FaqsGrid.tsx",
    componentUi: FaqsGrid,
    stylePath: undefined,
  },
]
