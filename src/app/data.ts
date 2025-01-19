import fs from "fs"
import path from "path"

import { AnimatedTags } from "@/app/components/ui/AnimatedTags"
import AppDownloadStack from "@/app/components/ui/AppDownloadStack"
import ButtonCopy from "@/app/components/ui/ButtonCopy"
import DynamicIsland from "@/app/components/ui/DynamicIsland"
import FluidMorph from "@/app/components/ui/FluidMorph"
import { ImageMetadataPreview } from "@/app/components/ui/ImageMetadataPreview"
import InteractiveImageSelector from "@/app/components/ui/InteractiveImageSelector"
import { JobListingComponent } from "@/app/components/ui/JobListingComponent"
import MatrixCard from "@/app/components/ui/MatrixCard"
import NumberFlow from "@/app/components/ui/NumberFlow"
import PowerOffSlide from "@/app/components/ui/PowerOffSlide"
import SocialSelector from "@/app/components/ui/SocialSelector"
import UserAccountAvatar from "@/app/components/ui/UserAccountAvatar"

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
  slug?: string
  type?: string
  isNew?: boolean
  tags: string[]
  href: string
  info: string
  componentUi?: React.ElementType
  code?: string
  download?: string
  cnFunction?: boolean
  isUpdated?: boolean
}

export const components: ComponentsProps[] = [
  {
    id: 1,
    componentTitle: "Job Listing Component",
    slug: "job-listing-component",
    type: "list",
    isNew: false,
    tags: ["react", "motion", "tailwindcss"],
    href: "https://x.com/educalvolpz",
    info: "Job listing component with animation when showing more information",
    componentUi: JobListingComponent,
    code: getComponentCode("JobListingComponent"),
    download: "npm i motion clsx tailwind-merge",
    cnFunction: true,
    isUpdated: false,
  },
  {
    id: 2,
    componentTitle: "Image Metadata Preview",
    slug: "image-metadata-preview",
    type: "image",
    isNew: false,
    tags: ["react", "motion", "tailwindcss"],
    href: "https://x.com/educalvolpz",
    info: "Component that displays the metadata information of an image, uses useMeasure to get the size of the information box and move the image on the Y axis",
    componentUi: ImageMetadataPreview,
    code: getComponentCode("ImageMetadataPreview"),
    download: "npm i motion clsx tailwind-merge",
    cnFunction: true,
    isUpdated: false,
  },
  {
    id: 3,
    componentTitle: "Animated Tags",
    slug: "animated-tags",
    type: "image",
    isNew: false,
    tags: ["react", "tailwindcss", "motion"],
    href: "https://x.com/educalvolpz",
    info: "Component that displays tags with an animation when they are added or removed from the list of selected tags",
    componentUi: AnimatedTags,
    code: getComponentCode("AnimatedTags"),
    download: "npm i motion clsx tailwind-merge",
    cnFunction: true,
    isUpdated: false,
  },
  {
    id: 4,
    componentTitle: "Fluid Morph",
    slug: "fluid-morph",
    type: "image",
    isNew: false,
    tags: ["react", "tailwindcss", "motion"],
    href: "https://x.com/educalvolpz",
    info: "Component that morphs a fluid shape into another fluid shape",
    componentUi: FluidMorph,
    code: getComponentCode("FluidMorph"),
    download: "npm i motion clsx tailwind-merge",
    cnFunction: true,
    isUpdated: false,
  },
  {
    id: 5,
    componentTitle: "Interactive Image Selector",
    slug: "interactive-image-selector",
    type: "image",
    isNew: false,
    tags: ["react", "tailwindcss", "motion"],
    href: "https://x.com/educalvolpz",
    info: "Select images by clicking on them, delete selected images using the trash icon, and reset the gallery with the refresh button. Inspired by the smooth and intuitive photo gallery experience of iPhones, this interface features seamless animations for an engaging user experience.",
    componentUi: InteractiveImageSelector,
    code: getComponentCode("InteractiveImageSelector"),
    download: "npm i motion clsx tailwind-merge",
    cnFunction: true,
    isUpdated: false,
  },
  {
    id: 6,
    componentTitle: "App Download Stack",
    slug: "app-download-stack",
    type: "image",
    isNew: false,
    tags: ["react", "tailwindcss", "motion"],
    href: "https://x.com/educalvolpz",
    info: "Inspired by Family.co and the example by Jenson Wong, this component presents a stack of apps, allowing users to open the stack, select the apps they want, and download them.",
    componentUi: AppDownloadStack,
    code: getComponentCode("AppDownloadStack"),
    download: "npm i motion clsx tailwind-merge",
    cnFunction: true,
    isUpdated: false,
  },
  {
    id: 7,
    componentTitle: "Power Off Slide",
    slug: "power-off-slide",
    type: "image",
    isNew: false,
    tags: ["react", "tailwindcss", "motion"],
    href: "https://x.com/educalvolpz",
    info: "Inspired by the power off animation of iPhones, this component allows the user to slide to power off the device.",
    componentUi: PowerOffSlide,
    code: getComponentCode("PowerOffSlide"),
    download: "npm i motion clsx tailwind-merge",
    cnFunction: true,
    isUpdated: true,
  },
  {
    id: 8,
    componentTitle: "User Account Avatar",
    slug: "user-account-avatar",
    type: "image",
    isNew: false,
    tags: ["react", "tailwindcss", "motion", "radix-ui"],
    href: "https://x.com/educalvolpz",
    info: "Component that displays a user's avatar and allows the user to edit their profile information and order history.",
    componentUi: UserAccountAvatar,
    code: getComponentCode("UserAccountAvatar"),
    download: "npm i motion clsx tailwind-merge",
    cnFunction: true,
    isUpdated: false,
  },
  {
    id: 9,
    componentTitle: "Button Copy",
    slug: "button-copy",
    type: "image",
    isNew: false,
    tags: ["react", "tailwindcss", "motion"],
    href: "https://x.com/educalvolpz",
    info: "This component is an interactive button that visually changes state when clicked. The states are 'idle', 'loading', and 'success', represented by animated icons. When clicked, the button transitions from idle to loading and then to success, using smooth animations.",
    componentUi: ButtonCopy,
    code: getComponentCode("ButtonCopy"),
    download: "npm i motion clsx tailwind-merge",
    cnFunction: true,
    isUpdated: false,
  },
  {
    id: 10,
    componentTitle: "Matrix Card",
    slug: "matrix-card",
    type: "image",
    isNew: false,
    tags: ["react", "tailwindcss", "motion"],
    href: "https://x.com/educalvolpz",
    info: "A reusable card component that displays a matrix rain effect on hover, combining smooth animations with canvas-based effects.",
    componentUi: MatrixCard,
    code: getComponentCode("MatrixCard"),
    download: "npm i motion clsx tailwind-merge",
    cnFunction: true,
    isUpdated: false,
  },
  {
    id: 11,
    componentTitle: "Dynamic Island",
    slug: "dynamic-island",
    type: "image",
    isNew: false,
    tags: ["react", "motion", "tailwindcss"],
    href: "https://x.com/educalvolpz",
    info: "A reusable Dynamic Island component inspired by Apple's design, featuring smooth state transitions and animations.",
    componentUi: DynamicIsland,
    code: getComponentCode("DynamicIsland"),
    download: "npm i motion clsx tailwind-merge",
    cnFunction: true,
    isUpdated: false,
  },
  {
    id: 12,
    componentTitle: "Number Flow",
    slug: "number-flow",
    type: "image",
    isNew: false,
    tags: ["react", "tailwindcss"],
    href: "https://x.com/educalvolpz",
    info: "A component that animates the transition of numbers, showcasing smooth animations for incrementing and decrementing values.",
    componentUi: NumberFlow,
    code: getComponentCode("NumberFlow"),
    download: "npm i motion clsx tailwind-merge",
    cnFunction: true,
    isUpdated: true,
  },
  {
    id: 13,
    componentTitle: "Social selector",
    slug: "social-selector",
    type: "image",
    isNew: true,
    tags: ["react", "tailwindcss", "motion"],
    href: "https://x.com/educalvolpz",
    info: "A social media selector component that displays usernames across different platforms with elegant blur animations. Users can interact with each social network option, triggering smooth transitions and blur effects that enhance the visual feedback. Perfect for profile pages or social media dashboards.",
    componentUi: SocialSelector,
    code: getComponentCode("SocialSelector"),
    download: "npm i motion clsx tailwind-merge",
    cnFunction: true,
    isUpdated: false,
  },
]
