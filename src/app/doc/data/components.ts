import AnimatedTags from "@/app/doc/_components/ui/AnimatedTags"
import AppDownloadStack from "@/app/doc/_components/ui/AppDownloadStack"
import AppleInvites from "@/app/doc/_components/ui/AppleInvites"
import ButtonCopy from "@/app/doc/_components/ui/ButtonCopy"
import DynamicIsland from "@/app/doc/_components/ui/DynamicIsland"
import ExpandableCards from "@/app/doc/_components/ui/ExpandableCards"
import FluidMorph from "@/app/doc/_components/ui/FluidMorph"
import ImageMetadataPreview from "@/app/doc/_components/ui/ImageMetadataPreview"
import InteractiveImageSelector from "@/app/doc/_components/ui/InteractiveImageSelector"
import JobListingComponent from "@/app/doc/_components/ui/JobListingComponent"
import MatrixCard from "@/app/doc/_components/ui/MatrixCard"
import NumberFlow from "@/app/doc/_components/ui/NumberFlow"
import PowerOffSlide from "@/app/doc/_components/ui/PowerOffSlide"
import SocialSelector from "@/app/doc/_components/ui/SocialSelector"
import UserAccountAvatar from "@/app/doc/_components/ui/UserAccountAvatar"

export interface ComponentsProps {
  id: number
  componentTitle: string
  slug?: string
  type?: "component" | "block"
  isNew?: boolean
  tags: string[]
  href: string
  info: string
  componentUi?: React.ElementType
  code?: string
  download?: string
  customCss?: string
  cnFunction?: boolean
  isUpdated?: boolean
  collection?: string
}

export const components: ComponentsProps[] = [
  {
    id: 1,
    componentTitle: "Job Listing Component",
    slug: "job-listing-component",
    type: "component",
    isNew: false,
    tags: ["react", "motion", "tailwindcss"],
    href: "https://x.com/educalvolpz",
    info: "Job listing component with animation when showing more information",
    componentUi: JobListingComponent,
    download: "motion usehooks-ts",
    cnFunction: false,
    isUpdated: false,
    collection: "dashboard",
  },
  {
    id: 2,
    componentTitle: "Image Metadata Preview",
    slug: "image-metadata-preview",
    type: "component",
    isNew: false,
    tags: ["react", "motion", "tailwindcss"],
    href: "https://x.com/educalvolpz",
    info: "Component that displays the metadata information of an image, uses useMeasure to get the size of the information box and move the image on the Y axis",
    componentUi: ImageMetadataPreview,
    download: "motion lucide-react react-use-measure",
    cnFunction: false,
    isUpdated: false,
    collection: "ecommerce",
  },
  {
    id: 3,
    componentTitle: "Animated Tags",
    slug: "animated-tags",
    type: "component",
    isNew: false,
    tags: ["react", "tailwindcss", "motion"],
    href: "https://x.com/educalvolpz",
    info: "Component that displays tags with an animation when they are added or removed from the list of selected tags",
    componentUi: AnimatedTags,
    download: "motion lucide-react",
    cnFunction: false,
    isUpdated: false,
    collection: "landing",
  },
  {
    id: 4,
    componentTitle: "Fluid Morph",
    slug: "fluid-morph",
    type: "block",
    isNew: false,
    tags: ["react", "tailwindcss", "motion"],
    href: "https://x.com/educalvolpz",
    info: "Component that morphs a fluid shape into another fluid shape",
    componentUi: FluidMorph,
    download: "motion",
    cnFunction: false,
    isUpdated: false,
    collection: "landing",
  },
  {
    id: 5,
    componentTitle: "Interactive Image Selector",
    slug: "interactive-image-selector",
    type: "block",
    isNew: false,
    tags: ["react", "tailwindcss", "motion"],
    href: "https://x.com/educalvolpz",
    info: "Select images by clicking on them, delete selected images using the trash icon, and reset the gallery with the refresh button. Inspired by the smooth and intuitive photo gallery experience of iPhones, this interface features seamless animations for an engaging user experience.",
    componentUi: InteractiveImageSelector,
    download: "motion lucide-react",
    cnFunction: false,
    isUpdated: false,
    collection: "gallery",
  },
  {
    id: 6,
    componentTitle: "App Download Stack",
    slug: "app-download-stack",
    type: "block",
    isNew: false,
    tags: ["react", "tailwindcss", "motion"],
    href: "https://x.com/educalvolpz",
    info: "Inspired by Family.co and the example by Jenson Wong, this component presents a stack of apps, allowing users to open the stack, select the apps they want, and download them.",
    componentUi: AppDownloadStack,
    download: "motion lucide-react",
    cnFunction: false,
    isUpdated: false,
    collection: "utility",
  },
  {
    id: 7,
    componentTitle: "Power Off Slide",
    slug: "power-off-slide",
    type: "component",
    isNew: false,
    tags: ["react", "tailwindcss", "motion"],
    href: "https://x.com/educalvolpz",
    info: "Inspired by the power off animation of iPhones, this component allows the user to slide to power off the device.",
    componentUi: PowerOffSlide,
    download: "motion lucide-react",
    cnFunction: false,
    isUpdated: true,
    collection: "utility",
  },
  {
    id: 8,
    componentTitle: "User Account Avatar",
    slug: "user-account-avatar",
    type: "component",
    isNew: false,
    tags: ["react", "tailwindcss", "motion", "radix-ui"],
    href: "https://x.com/educalvolpz",
    info: "Component that displays a user's avatar and allows the user to edit their profile information and order history.",
    componentUi: UserAccountAvatar,
    download: "motion lucide-react @radix-ui/react-popover",
    cnFunction: false,
    isUpdated: false,
    collection: "profile",
  },
  {
    id: 9,
    componentTitle: "Button Copy",
    slug: "button-copy",
    type: "component",
    isNew: false,
    tags: ["react", "tailwindcss", "motion"],
    href: "https://x.com/educalvolpz",
    info: "This component is an interactive button that visually changes state when clicked. The states are 'idle', 'loading', and 'success', represented by animated icons. When clicked, the button transitions from idle to loading and then to success, using smooth animations.",
    componentUi: ButtonCopy,
    download: "motion lucide-react",
    cnFunction: false,
    isUpdated: false,
    collection: "utility",
  },
  {
    id: 10,
    componentTitle: "Matrix Card",
    slug: "matrix-card",
    type: "component",
    isNew: false,
    tags: ["react", "tailwindcss", "motion"],
    href: "https://x.com/educalvolpz",
    info: "A reusable card component that displays a matrix rain effect on hover, combining smooth animations with canvas-based effects.",
    componentUi: MatrixCard,
    download: "motion",
    cnFunction: false,
    isUpdated: false,
    collection: "gallery",
  },
  {
    id: 11,
    componentTitle: "Dynamic Island",
    slug: "dynamic-island",
    type: "component",
    isNew: false,
    tags: ["react", "motion", "tailwindcss"],
    href: "https://x.com/educalvolpz",
    info: "A reusable Dynamic Island component inspired by Apple's design, featuring smooth state transitions and animations.",
    componentUi: DynamicIsland,
    download: "motion lucide-react",
    cnFunction: false,
    isUpdated: false,
    collection: "utility",
  },
  {
    id: 12,
    componentTitle: "Number Flow",
    slug: "number-flow",
    type: "block",
    isNew: false,
    tags: ["react", "tailwindcss"],
    href: "https://x.com/educalvolpz",
    info: "A component that animates the transition of numbers, showcasing smooth animations for incrementing and decrementing values.",
    componentUi: NumberFlow,
    download: "clsx tailwind-merge lucide-react",
    cnFunction: true,
    isUpdated: true,
    collection: "utility",
  },
  {
    id: 13,
    componentTitle: "Social Selector",
    slug: "social-selector",
    type: "block",
    isNew: false,
    tags: ["react", "tailwindcss", "motion"],
    href: "https://x.com/educalvolpz",
    info: "A social media selector component that displays usernames across different platforms with elegant blur animations. Users can interact with each social network option, triggering smooth transitions and blur effects that enhance the visual feedback. Perfect for profile pages or social media dashboards.",
    componentUi: SocialSelector,
    download: "motion",
    cnFunction: false,
    isUpdated: false,
    collection: "social",
  },
  {
    id: 14,
    componentTitle: "Expandable Cards",
    slug: "expandable-cards",
    type: "block",
    isNew: false,
    tags: ["react", "tailwindcss", "motion"],
    href: "https://x.com/educalvolpz",
    info: "This component allows users to interact with a set of cards that can be expanded to reveal more information. It features smooth animations and is designed to enhance user engagement through visual feedback.",
    componentUi: ExpandableCards,
    download: "motion lucide-react",
    cnFunction: false,
    isUpdated: true,
    collection: "gallery",
  },
  {
    id: 15,
    componentTitle: "Apple Invites",
    slug: "apple-invites",
    type: "block",
    isNew: true,
    tags: ["react", "tailwindcss", "motion"],
    href: "https://x.com/educalvolpz",
    info: "Inspired by Apple's design, this component showcases a collection of event invites with smooth animations and transitions.",
    componentUi: AppleInvites,
    download: "motion lucide-react popmotion",
    customCss: `//Progressive Blur
.gradient-mask-t-0 {
    -webkit-mask-image: linear-gradient(#0000, #000);
    mask-image: linear-gradient(#0000, #000);
}`,
    cnFunction: false,
    isUpdated: false,
    collection: "gallery",
  },
]
