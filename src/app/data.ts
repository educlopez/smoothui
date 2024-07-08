import { AppleList } from "@/app/components/ui/appleList"
import { ArenaOpenCard } from "@/app/components/ui/arenaOpenCard"
import { TagsVanish } from "@/app/components/ui/tagsVanish"

export interface ComponentsProps {
  id: number
  componentTitle: string
  tags: string[]
  href: string
  info: string
  componentUi?: React.ElementType
}

export const components: ComponentsProps[] = [
  {
    id: 1,
    componentTitle: "Job Listing Component",
    tags: ["react", "framer-motion", "tailwindcss"],
    href: "https://x.com/educlopez93",
    info: "Job listing component with animation when showing more information",
    componentUi: AppleList,
  },
  {
    id: 2,
    componentTitle: "Image Metadata Preview",
    tags: ["react", "framer-motion", "tailwindcss"],
    href: "https://x.com/educlopez93",
    info: "Component that displays the metadata information of an image, uses useMeasure to get the size of the information box and move the image on the Y axis",
    componentUi: ArenaOpenCard,
  },
  {
    id: 3,
    componentTitle: "Animated Tags",
    tags: ["react", "tailwindcss", "framer-motion"],
    href: "https://x.com/educlopez93",
    info: "Component that displays tags with an animation when they are added or removed from the list of selected tags",
    componentUi: TagsVanish,
  },
]
