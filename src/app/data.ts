import fs from "fs"
import path from "path"

import AppDownloader from "@/app/components/ui/appDownloader"
import { AppleList } from "@/app/components/ui/appleList"
import { ArenaOpenCard } from "@/app/components/ui/arenaOpenCard"
import AvatarDrop from "@/app/components/ui/avatarDrop"
import ButtonCopyStates from "@/app/components/ui/buttonCopyStates"
import DynamicIsland from "@/app/components/ui/dynamicIsland"
import FluidMorph from "@/app/components/ui/fluidMorph"
import ImageSelector from "@/app/components/ui/imageSelector"
import IosPoweroff from "@/app/components/ui/iosPoweroff"
import MatrixCard from "@/app/components/ui/matrixCard"
import NumberFlow from "@/app/components/ui/numberFlow"
import { TagsVanish } from "@/app/components/ui/tagsVanish"

function getComponentCode(componentName: string): string {
  if (typeof window === "undefined") {
    const filePath = path.join(
      process.cwd(),
      "src",
      "app",
      "components",
      "ui",
      `${componentName}.tsx`
    )
    try {
      return fs.readFileSync(filePath, "utf8")
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error)
      return "// Code not available"
    }
  }
  return "// Code not available in browser"
}
export interface ComponentsProps {
  id: number
  componentTitle: string
  tags: string[]
  href: string
  info: string
  componentUi?: React.ElementType
  code?: string
}

export const components: ComponentsProps[] = [
  {
    id: 1,
    componentTitle: "Job Listing Component",
    tags: ["react", "motion", "tailwindcss"],
    href: "https://x.com/educalvolpz",
    info: "Job listing component with animation when showing more information",
    componentUi: AppleList,
    code: getComponentCode("appleList"),
  },
  {
    id: 2,
    componentTitle: "Image Metadata Preview",
    tags: ["react", "motion", "tailwindcss"],
    href: "https://x.com/educalvolpz",
    info: "Component that displays the metadata information of an image, uses useMeasure to get the size of the information box and move the image on the Y axis",
    componentUi: ArenaOpenCard,
    code: getComponentCode("arenaOpenCard"),
  },
  {
    id: 3,
    componentTitle: "Animated Tags",
    tags: ["react", "tailwindcss", "motion"],
    href: "https://x.com/educalvolpz",
    info: "Component that displays tags with an animation when they are added or removed from the list of selected tags",
    componentUi: TagsVanish,
    code: getComponentCode("tagsVanish"),
  },
  {
    id: 4,
    componentTitle: "Fluid Morph",
    tags: ["react", "tailwindcss", "motion"],
    href: "https://x.com/educalvolpz",
    info: "Component that morphs a fluid shape into another fluid shape",
    componentUi: FluidMorph,
    code: getComponentCode("fluidMorph"),
  },
  {
    id: 5,
    componentTitle: "Interactive Image Selector",
    tags: ["react", "tailwindcss", "motion"],
    href: "https://x.com/educalvolpz",
    info: "Select images by clicking on them, delete selected images using the trash icon, and reset the gallery with the refresh button. Inspired by the smooth and intuitive photo gallery experience of iPhones, this interface features seamless animations for an engaging user experience.",
    componentUi: ImageSelector,
    code: getComponentCode("imageSelector"),
  },
  {
    id: 6,
    componentTitle: "App Download Stack",
    tags: ["react", "tailwindcss", "motion"],
    href: "https://x.com/educalvolpz",
    info: "Inspired by Family.co and the example by Jenson Wong, this component presents a stack of apps, allowing users to open the stack, select the apps they want, and download them.",
    componentUi: AppDownloader,
    code: getComponentCode("appDownloader"),
  },
  {
    id: 7,
    componentTitle: "iOS Power off",
    tags: ["react", "tailwindcss", "motion"],
    href: "https://x.com/educalvolpz",
    info: "Inspired by the power off animation of iPhones, this component allows the user to slide to power off the device.",
    componentUi: IosPoweroff,
    code: getComponentCode("iosPoweroff"),
  },
  {
    id: 8,
    componentTitle: "User Account Avatar",
    tags: ["react", "tailwindcss", "motion", "radix-ui"],
    href: "https://x.com/educalvolpz",
    info: "Component that displays a user's avatar and allows the user to edit their profile information and order history.",
    componentUi: AvatarDrop,
    code: getComponentCode("avatarDrop"),
  },
  {
    id: 9,
    componentTitle: "Button Copy",
    tags: ["react", "tailwindcss", "motion"],
    href: "https://x.com/educalvolpz",
    info: "This component is an interactive button that visually changes state when clicked. The states are 'idle', 'loading', and 'success', represented by animated icons. When clicked, the button transitions from idle to loading and then to success, using smooth animations.",
    componentUi: ButtonCopyStates,
    code: getComponentCode("buttonCopyStates"),
  },
  {
    id: 10,
    componentTitle: "Matrix Card",
    tags: ["react", "tailwindcss", "motion"],
    href: "https://x.com/educalvolpz",
    info: "A reusable card component that displays a matrix rain effect on hover, combining smooth animations with canvas-based effects.",
    componentUi: MatrixCard,
    code: getComponentCode("matrixCard"),
  },
  {
    id: 11,
    componentTitle: "Dynamic Island",
    tags: ["react", "motion", "tailwindcss"],
    href: "https://x.com/educalvolpz",
    info: "A reusable Dynamic Island component inspired by Apple's design, featuring smooth state transitions and animations.",
    componentUi: DynamicIsland,
    code: getComponentCode("dynamicIsland"),
  },
  {
    id: 12,
    componentTitle: "Number Flow",
    tags: ["react", "tailwindcss"],
    href: "https://x.com/educalvolpz",
    info: "A component that animates the transition of numbers, showcasing smooth animations for incrementing and decrementing values.",
    componentUi: NumberFlow,
    code: getComponentCode("numberFlow"),
  },
]
