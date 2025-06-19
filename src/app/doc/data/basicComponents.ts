import AccordionDemo from "@/components/smoothui/examples/BasicAccordionDemo"
import DropdownDemo from "@/components/smoothui/examples/BasicDropdownDemo"
import ModalDemo from "@/components/smoothui/examples/BasicModalDemo"
import ToastDemo from "@/components/smoothui/examples/BasicToastDemo"

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
    props: [
      {
        name: "message",
        type: "string",
        description: "The toast message.",
        required: true,
      },
      {
        name: "type",
        type: '"success" | "error" | "info" | "warning"',
        description: "Toast type (default: 'info').",
        required: false,
      },
      {
        name: "duration",
        type: "number",
        description: "How long to show the toast (ms, default: 3000).",
        required: false,
      },
      {
        name: "onClose",
        type: "() => void",
        description: "Callback when toast closes.",
        required: false,
      },
      {
        name: "isVisible",
        type: "boolean",
        description: "Controlled visibility (default: true).",
        required: false,
      },
      {
        name: "className",
        type: "string",
        description: "Optional additional class names for the toast container.",
        required: false,
      },
    ],
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
    props: [
      {
        name: "label",
        type: "string",
        description: "The label to display on the dropdown button.",
        required: true,
      },
      {
        name: "items",
        type: "{ id: string | number; label: string; icon?: React.ReactNode }[]",
        description:
          "Array of dropdown items. Each item: { id, label, icon? }.",
        required: true,
        fields: [
          {
            name: "id",
            type: "string | number",
            description: "Unique item identifier.",
          },
          { name: "label", type: "string", description: "Item label." },
          {
            name: "icon",
            type: "React.ReactNode",
            description: "Optional icon for the item.",
          },
        ],
      },
      {
        name: "onChange",
        type: "(item: DropdownItem) => void",
        description: "Callback fired when an item is selected.",
        required: false,
      },
      {
        name: "className",
        type: "string",
        description:
          "Optional additional class names for the dropdown container.",
        required: false,
      },
    ],
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
    props: [
      {
        name: "isOpen",
        type: "boolean",
        description: "Controls whether the modal is open.",
        required: true,
      },
      {
        name: "onClose",
        type: "() => void",
        description:
          "Callback fired when the modal is requested to close (e.g. overlay click, ESC key, close button).",
        required: true,
      },
      {
        name: "title",
        type: "string",
        description: "Optional modal title displayed in the header.",
        required: false,
      },
      {
        name: "children",
        type: "React.ReactNode",
        description: "Content to display inside the modal.",
        required: true,
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg" | "xl" | "full"',
        description: "Modal size (default: 'md').",
        required: false,
      },
    ],
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
    props: [
      {
        name: "items",
        type: "{ id: string | number; title: string; content: React.ReactNode }[]",
        description:
          "Array of accordion items. Each item: { id, title, content }.",
        required: true,
        fields: [
          {
            name: "id",
            type: "string | number",
            description: "Unique item identifier.",
          },
          {
            name: "title",
            type: "string",
            description: "Accordion item title.",
          },
          {
            name: "content",
            type: "React.ReactNode",
            description: "Content to display when expanded.",
          },
        ],
      },
      {
        name: "allowMultiple",
        type: "boolean",
        description:
          "If true, multiple items can be expanded at once (default: false).",
        required: false,
      },
      {
        name: "className",
        type: "string",
        description:
          "Optional additional class names for the accordion container.",
        required: false,
      },
      {
        name: "defaultExpandedIds",
        type: "Array<string | number>",
        description: "Array of item ids to be expanded by default.",
        required: false,
      },
    ],
  },
]
