import { AccordionDemo } from "@/app/doc/_components/smoothui/BasicAccordion"
import { DropdownDemo } from "@/app/doc/_components/smoothui/BasicDropdown"
import { ModalDemo } from "@/app/doc/_components/smoothui/BasicModal"
import { ToastDemo } from "@/app/doc/_components/smoothui/BasicToast"

export interface BasicComponentsProps {
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
  props?: {
    name: string
    type: string
    description: string
    required: boolean
    fields?: { name: string; type: string; description: string }[]
  }[]
}

export const basicComponents: BasicComponentsProps[] = [
  {
    id: 1,
    componentTitle: "Basic Toast",
    slug: "basic-toast",
    type: "component",
    isNew: true,
    tags: ["react", "tailwindcss", "motion"],
    href: "https://x.com/educalvolpz",
    info: "A versatile toast notification system with smooth animations for different alert types including success, error, warning, and info messages.",
    componentUi: ToastDemo,
    download: "motion lucide-react",
    cnFunction: false,
    isUpdated: false,
    collection: "notifications",
  },
  {
    id: 2,
    componentTitle: "Basic Dropdown",
    slug: "basic-dropdown",
    type: "component",
    isNew: true,
    tags: ["react", "tailwindcss", "motion"],
    href: "https://x.com/educalvolpz",
    info: "An elegant dropdown menu with smooth animations, hover effects, and proper keyboard accessibility for enhanced user interaction.",
    componentUi: DropdownDemo,
    download: "motion lucide-react",
    cnFunction: false,
    isUpdated: false,
    collection: "navigation",
  },
  {
    id: 3,
    componentTitle: "Basic Modal",
    slug: "basic-modal",
    type: "component",
    isNew: true,
    tags: ["react", "tailwindcss", "motion"],
    href: "https://x.com/educalvolpz",
    info: "A polished modal dialog with backdrop blur and dynamic entrance/exit animations that improves user experience for dialog interactions.",
    componentUi: ModalDemo,
    download: "motion lucide-react usehooks-ts",
    cnFunction: false,
    isUpdated: false,
    collection: "overlays",
  },

  {
    id: 4,
    componentTitle: "Basic Accordion",
    slug: "basic-accordion",
    type: "component",
    isNew: true,
    tags: ["react", "tailwindcss", "motion"],
    href: "https://x.com/educalvolpz",
    info: "An expandable accordion component with smooth animations that's perfect for organizing content into collapsible sections.",
    componentUi: AccordionDemo,
    download: "motion lucide-react",
    cnFunction: false,
    isUpdated: false,
    collection: "data-display",
  },
]
