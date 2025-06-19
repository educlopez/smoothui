import AnimatedTagsDemo from "@/components/smoothui/examples/AnimatedTagsDemo"
import AppDownloadStackDemo from "@/components/smoothui/examples/AppDownloadStackDemo"
import AppleInvitesDemo from "@/components/smoothui/examples/AppleInvitesDemo"
import ButtonCopyDemo from "@/components/smoothui/examples/ButtonCopyDemo"
import DynamicIslandDemo from "@/components/smoothui/examples/DynamicIslandDemo"
import ExpandableCardsDemo from "@/components/smoothui/examples/ExpandableCardsDemo"
import FluidMorphDemo from "@/components/smoothui/examples/FluidMorphDemo"
import ImageMetadataPreviewDemo from "@/components/smoothui/examples/ImageMetadataPreviewDemo"
import InteractiveImageSelectorDemo from "@/components/smoothui/examples/InteractiveImageSelectorDemo"
import JobListingComponentDemo from "@/components/smoothui/examples/JobListingComponentDemo"
import MatrixCardDemo from "@/components/smoothui/examples/MatrixCardDemo"
import NumberFlowDemo from "@/components/smoothui/examples/NumberFlowDemo"
import PowerOffSlideDemo from "@/components/smoothui/examples/PowerOffSlideDemo"
import SocialSelectorDemo from "@/components/smoothui/examples/SocialSelectorDemo"
import UserAccountAvatarDemo from "@/components/smoothui/examples/UserAccountAvatarDemo"

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
  props?: {
    name: string
    type: string
    description: string
    required: boolean
    fields?: { name: string; type: string; description: string }[]
  }[]
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
    componentUi: JobListingComponentDemo,
    download: "motion usehooks-ts",
    cnFunction: false,
    isUpdated: false,
    collection: "data-display",
    props: [
      {
        name: "jobs",
        type: "Job[]",
        description: "Array of job objects to display in the listing.",
        required: true,
        fields: [
          { name: "company", type: "string", description: "Company name" },
          { name: "title", type: "string", description: "Job title" },
          {
            name: "logo",
            type: "React.ReactNode",
            description: "Logo element",
          },
          {
            name: "job_description",
            type: "string",
            description: "Job description",
          },
          { name: "salary", type: "string", description: "Salary range" },
          { name: "location", type: "string", description: "Job location" },
          {
            name: "remote",
            type: "string",
            description: "Remote type (Yes, No, Hybrid)",
          },
          {
            name: "job_time",
            type: "string",
            description: "Full-time, Part-time, etc.",
          },
        ],
      },
      {
        name: "className",
        type: "string",
        description: "Optional additional class names for the root container.",
        required: false,
      },
      {
        name: "onJobClick",
        type: "(job: Job) => void",
        description: "Optional callback fired when a job is clicked.",
        required: false,
      },
    ],
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
    componentUi: ImageMetadataPreviewDemo,
    download: "motion lucide-react react-use-measure",
    cnFunction: false,
    isUpdated: false,
    collection: "media",
    props: [
      {
        name: "imageSrc",
        type: "string",
        description: "The image URL to display.",
        required: true,
      },
      {
        name: "alt",
        type: "string",
        description: "Alternative text for the image.",
        required: false,
      },
      {
        name: "filename",
        type: "string",
        description: "The filename to display above the metadata.",
        required: false,
      },
      {
        name: "description",
        type: "string",
        description: "A description to display under the filename.",
        required: false,
      },
      {
        name: "metadata",
        type: "object",
        description: "Metadata information for the image.",
        required: true,
        fields: [
          {
            name: "created",
            type: "string",
            description: "Created date (e.g. '2 yrs ago')",
          },
          {
            name: "updated",
            type: "string",
            description: "Updated date (e.g. '2 yrs ago')",
          },
          { name: "by", type: "string", description: "Author or owner name" },
          {
            name: "source",
            type: "string",
            description: "Source identifier or hash",
          },
        ],
      },
      {
        name: "onShare",
        type: "() => void",
        description:
          "Optional callback fired when the share button is clicked.",
        required: false,
      },
    ],
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
    componentUi: AnimatedTagsDemo,
    download: "motion lucide-react",
    cnFunction: false,
    isUpdated: false,
    collection: "data-display",
    props: [
      {
        name: "initialTags",
        type: "string[]",
        description: "Initial list of available tags.",
        required: false,
      },
      {
        name: "selectedTags",
        type: "string[]",
        description: "Controlled selected tags array.",
        required: false,
      },
      {
        name: "onChange",
        type: "(selected: string[]) => void",
        description: "Callback fired when the selected tags change.",
        required: false,
      },
      {
        name: "className",
        type: "string",
        description: "Optional additional class names for the root container.",
        required: false,
      },
    ],
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
    componentUi: FluidMorphDemo,
    download: "motion",
    cnFunction: false,
    isUpdated: false,
    collection: "animations",
    props: [
      {
        name: "paths",
        type: "string[]",
        description: "Array of SVG path strings to morph between.",
        required: false,
        fields: [
          {
            name: "[index]",
            type: "string",
            description: "SVG path string (d attribute)",
          },
        ],
      },
      {
        name: "circleCount",
        type: "number",
        description: "Number of circles to animate.",
        required: false,
      },
      {
        name: "circleRadius",
        type: "number",
        description: "Radius of each circle.",
        required: false,
      },
      {
        name: "className",
        type: "string",
        description: "Optional additional class names for the root container.",
        required: false,
      },
      {
        name: "initialIndex",
        type: "number",
        description: "Which path to start on.",
        required: false,
      },
      {
        name: "onChange",
        type: "(index: number) => void",
        description: "Callback fired when the active shape index changes.",
        required: false,
      },
    ],
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
    componentUi: InteractiveImageSelectorDemo,
    download: "motion lucide-react",
    cnFunction: false,
    isUpdated: false,
    collection: "media",
    props: [
      {
        name: "images",
        type: "ImageData[]",
        description: "Array of images to display in the gallery.",
        required: false,
        fields: [
          {
            name: "id",
            type: "number",
            description: "Unique image identifier",
          },
          { name: "src", type: "string", description: "Image URL" },
        ],
      },
      {
        name: "selectedImages",
        type: "number[]",
        description: "Controlled selected image IDs.",
        required: false,
      },
      {
        name: "onChange",
        type: "(selected: number[]) => void",
        description: "Callback fired when the selected images change.",
        required: false,
      },
      {
        name: "onDelete",
        type: "(deleted: number[]) => void",
        description: "Callback fired when images are deleted.",
        required: false,
      },
      {
        name: "onShare",
        type: "(selected: number[]) => void",
        description: "Callback fired when the share button is clicked.",
        required: false,
      },
      {
        name: "className",
        type: "string",
        description: "Optional additional class names for the root container.",
        required: false,
      },
      {
        name: "title",
        type: "string",
        description: "Gallery title.",
        required: false,
      },
      {
        name: "selectable",
        type: "boolean",
        description: "Whether selection is enabled by default.",
        required: false,
      },
    ],
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
    componentUi: AppDownloadStackDemo,
    download: "motion lucide-react",
    cnFunction: false,
    isUpdated: false,
    collection: "navigation",
    props: [
      {
        name: "apps",
        type: "AppData[]",
        description: "Array of apps to display in the stack.",
        required: false,
        fields: [
          { name: "id", type: "number", description: "Unique app identifier" },
          { name: "name", type: "string", description: "App name" },
          { name: "icon", type: "string", description: "App icon URL" },
        ],
      },
      {
        name: "title",
        type: "string",
        description: "Title for the stack.",
        required: false,
      },
      {
        name: "selectedApps",
        type: "number[]",
        description: "Controlled selected app IDs.",
        required: false,
      },
      {
        name: "onChange",
        type: "(selected: number[]) => void",
        description: "Callback fired when the selected apps change.",
        required: false,
      },
      {
        name: "onDownload",
        type: "(selected: number[]) => void",
        description: "Callback fired when the download is triggered.",
        required: false,
      },
      {
        name: "isExpanded",
        type: "boolean",
        description: "Controlled expanded state.",
        required: false,
      },
      {
        name: "onExpandChange",
        type: "(expanded: boolean) => void",
        description: "Callback fired when expanded/collapsed.",
        required: false,
      },
      {
        name: "className",
        type: "string",
        description: "Optional additional class names for the root container.",
        required: false,
      },
    ],
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
    componentUi: PowerOffSlideDemo,
    download: "motion lucide-react",
    cnFunction: false,
    customCss: `@layer utilities {
  .loading-shimmer {
    text-fill-color: transparent;
    -webkit-text-fill-color: transparent;
    animation-delay: 0.5s;
    animation-duration: 3s;
    animation-iteration-count: infinite;
    animation-name: loading-shimmer;
    background: var(--text-quaternary)
      gradient(
        linear,
        100% 0,
        0 0,
        from(var(--text-quaternary)),
        color-stop(0.5, var(--text-primary)),
        to(var(--text-quaternary))
      );
    background: var(--text-quaternary) -webkit-gradient(
        linear,
        100% 0,
        0 0,
        from(var(--text-quaternary)),
        color-stop(0.5, var(--text-primary)),
        to(var(--text-quaternary))
      );
    background-clip: text;
    -webkit-background-clip: text;
    background-repeat: no-repeat;
    background-size: 50% 200%;
    display: inline-block;
  }

  .loading-shimmer {
    background-position: -100% top;
  }
  .loading-shimmer:hover {
    -webkit-text-fill-color: var(--text-quaternary);
    animation: none;
    background: transparent;
  }

  @keyframes loading-shimmer {
    0% {
      background-position: -100% top;
    }

    to {
      background-position: 250% top;
    }
  }
}`,
    isUpdated: false,
    collection: "inputs",
    props: [
      {
        name: "onPowerOff",
        type: "() => void",
        description: "Callback fired when the power-off is triggered.",
        required: false,
      },
      {
        name: "label",
        type: "string",
        description: "Customizable slide label.",
        required: false,
      },
      {
        name: "className",
        type: "string",
        description: "Optional additional class names for the root container.",
        required: false,
      },
      {
        name: "duration",
        type: "number",
        description: "Duration of the power-off animation in milliseconds.",
        required: false,
      },
      {
        name: "disabled",
        type: "boolean",
        description: "If true, disables the slider.",
        required: false,
      },
    ],
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
    componentUi: UserAccountAvatarDemo,
    download: "motion lucide-react @radix-ui/react-popover",
    cnFunction: false,
    isUpdated: false,
    collection: "user-interface",
    props: [
      {
        name: "user",
        type: "{ name: string; email: string; avatar: string }",
        description: "User data to display and edit.",
        required: false,
        fields: [
          { name: "name", type: "string", description: "User's name" },
          { name: "email", type: "string", description: "User's email" },
          { name: "avatar", type: "string", description: "Avatar image URL" },
        ],
      },
      {
        name: "orders",
        type: "Order[]",
        description: "Array of orders to display in the order history.",
        required: false,
        fields: [
          { name: "id", type: "string", description: "Order ID" },
          { name: "date", type: "string", description: "Order date" },
          {
            name: "status",
            type: '"processing" | "shipped" | "delivered"',
            description: "Order status",
          },
          {
            name: "progress",
            type: "number",
            description: "Order progress percent",
          },
        ],
      },
      {
        name: "onProfileSave",
        type: "(user: { name: string; email: string; avatar: string }) => void",
        description: "Callback fired when the profile is saved.",
        required: false,
      },
      {
        name: "onOrderView",
        type: "(orderId: string) => void",
        description: "Callback fired when an order is viewed.",
        required: false,
      },
      {
        name: "className",
        type: "string",
        description: "Optional additional class names for the root container.",
        required: false,
      },
    ],
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
    componentUi: ButtonCopyDemo,
    download: "motion lucide-react",
    cnFunction: false,
    isUpdated: false,
    collection: "inputs",
    props: [
      {
        name: "onCopy",
        type: "() => Promise<void> | void",
        description: "Callback to perform the copy action.",
        required: false,
      },
      {
        name: "idleIcon",
        type: "ReactNode",
        description: "Icon to show when idle.",
        required: false,
      },
      {
        name: "loadingIcon",
        type: "ReactNode",
        description: "Icon to show when loading.",
        required: false,
      },
      {
        name: "successIcon",
        type: "ReactNode",
        description: "Icon to show on success.",
        required: false,
      },
      {
        name: "className",
        type: "string",
        description: "Optional additional class names for the root container.",
        required: false,
      },
      {
        name: "duration",
        type: "number",
        description: "How long to show the success state (ms).",
        required: false,
      },
      {
        name: "loadingDuration",
        type: "number",
        description: "How long to show the loading state (ms).",
        required: false,
      },
      {
        name: "disabled",
        type: "boolean",
        description: "If true, disables the button.",
        required: false,
      },
    ],
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
    componentUi: MatrixCardDemo,
    download: "motion",
    cnFunction: false,
    isUpdated: false,
    collection: "animations",
    props: [
      {
        name: "title",
        type: "string",
        description: "Card title.",
        required: false,
      },
      {
        name: "description",
        type: "string",
        description: "Card description.",
        required: false,
      },
      {
        name: "fontSize",
        type: "number",
        description: "Font size for the matrix effect.",
        required: false,
      },
      {
        name: "chars",
        type: "string",
        description: "Characters to use in the matrix effect.",
        required: false,
      },
      {
        name: "className",
        type: "string",
        description: "Optional additional class names for the root container.",
        required: false,
      },
      {
        name: "children",
        type: "ReactNode",
        description:
          "Custom content inside the card (replaces title/description).",
        required: false,
      },
    ],
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
    componentUi: DynamicIslandDemo,
    download: "motion lucide-react",
    cnFunction: false,
    isUpdated: false,
    collection: "notifications",
    props: [
      {
        name: "view",
        type: '"idle" | "ring" | "timer"',
        description: "Controlled view state.",
        required: false,
      },
      {
        name: "onViewChange",
        type: '(view: "idle" | "ring" | "timer") => void',
        description: "Callback when the view changes.",
        required: false,
      },
      {
        name: "idleContent",
        type: "ReactNode",
        description: "Custom content for idle state.",
        required: false,
      },
      {
        name: "ringContent",
        type: "ReactNode",
        description: "Custom content for ring state.",
        required: false,
      },
      {
        name: "timerContent",
        type: "ReactNode",
        description: "Custom content for timer state.",
        required: false,
      },
      {
        name: "className",
        type: "string",
        description: "Optional additional class names for the root container.",
        required: false,
      },
    ],
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
    componentUi: NumberFlowDemo,
    download: "clsx tailwind-merge lucide-react",
    cnFunction: true,
    customCss: `@layer utilities {
  .slide-in-up {
    animation: slideInUp 0.3s forwards;
  }

  .slide-out-up {
    animation: slideOutUp 0.3s forwards;
  }

  .slide-in-down {
    animation: slideInDown 0.3s forwards;
  }

  .slide-out-down {
    animation: slideOutDown 0.3s forwards;
  }

  @keyframes slideInUp {
    from {
      transform: translateY(50px);
      filter: blur(5px);
    }
    to {
      transform: translateY(0px);
      filter: blur(0px);
    }
  }

  @keyframes slideOutUp {
    from {
      transform: translateY(0px);
      filter: blur(0px);
    }
    to {
      transform: translateY(-50px);
      filter: blur(5px);
    }
  }

  @keyframes slideInDown {
    from {
      transform: translateY(-50px);
      filter: blur(5px);
    }
    to {
      transform: translateY(0px);
      filter: blur(0px);
    }
  }

  @keyframes slideOutDown {
    from {
      transform: translateY(0px);
      filter: blur(0px);
    }
    to {
      transform: translateY(50px);
      filter: blur(5px);
    }
  }
}`,
    isUpdated: false,
    collection: "data-display",
    props: [
      {
        name: "value",
        type: "number",
        description: "Controlled value.",
        required: false,
      },
      {
        name: "onChange",
        type: "(value: number) => void",
        description: "Callback when value changes.",
        required: false,
      },
      {
        name: "min",
        type: "number",
        description: "Minimum value.",
        required: false,
      },
      {
        name: "max",
        type: "number",
        description: "Maximum value.",
        required: false,
      },
      {
        name: "className",
        type: "string",
        description: "Optional additional class names for the root container.",
        required: false,
      },
      {
        name: "digitClassName",
        type: "string",
        description: "Class name for the digit containers.",
        required: false,
      },
      {
        name: "buttonClassName",
        type: "string",
        description: "Class name for the increment/decrement buttons.",
        required: false,
      },
    ],
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
    componentUi: SocialSelectorDemo,
    download: "motion",
    cnFunction: false,
    isUpdated: false,
    collection: "navigation",
    props: [
      {
        name: "platforms",
        type: "Platform[]",
        description: "Array of platforms to show.",
        required: false,
        fields: [
          { name: "name", type: "string", description: "Platform name" },
          { name: "domain", type: "string", description: "Platform domain" },
          { name: "icon", type: "ReactNode", description: "Platform icon" },
          { name: "url", type: "string", description: "Platform profile URL" },
        ],
      },
      {
        name: "handle",
        type: "string",
        description: "The username/handle to display.",
        required: false,
      },
      {
        name: "selectedPlatform",
        type: "Platform",
        description: "Controlled selected platform.",
        required: false,
      },
      {
        name: "onChange",
        type: "(platform: Platform) => void",
        description: "Callback when platform changes.",
        required: false,
      },
      {
        name: "className",
        type: "string",
        description: "Optional additional class names for the root container.",
        required: false,
      },
    ],
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
    componentUi: ExpandableCardsDemo,
    download: "motion lucide-react",
    cnFunction: false,
    isUpdated: false,
    collection: "data-display",
    props: [
      {
        name: "cards",
        type: "Card[]",
        description:
          "Array of cards to display. Each card: { id, title, image, content, author? (object: { name, role, image }) }.",
        required: false,
        fields: [
          { name: "id", type: "number", description: "Card id" },
          { name: "title", type: "string", description: "Card title" },
          { name: "image", type: "string", description: "Card image URL" },
          {
            name: "content",
            type: "string",
            description: "Card content/description",
          },
          {
            name: "author",
            type: "{ name: string; role: string; image: string }",
            description: "Card author info (object with name, role, image).",
          },
        ],
      },
      {
        name: "selectedCard",
        type: "number | null",
        description: "Controlled selected card id.",
        required: false,
      },
      {
        name: "onSelect",
        type: "(id: number | null) => void",
        description: "Callback when a card is selected or deselected.",
        required: false,
      },
      {
        name: "className",
        type: "string",
        description: "Optional additional class names for the root container.",
        required: false,
      },
      {
        name: "cardClassName",
        type: "string",
        description: "Class name for each card.",
        required: false,
      },
    ],
  },
  {
    id: 15,
    componentTitle: "Apple Invites",
    slug: "apple-invites",
    type: "block",
    isNew: false,
    tags: ["react", "tailwindcss", "motion"],
    href: "https://x.com/educalvolpz",
    info: "Inspired by Apple's design, this component showcases a collection of event invites with smooth animations and transitions.",
    componentUi: AppleInvitesDemo,
    download: "motion lucide-react popmotion",
    customCss: `//Progressive Blur
.gradient-mask-t-0 {
    -webkit-mask-image: linear-gradient(#0000, #000);
    mask-image: linear-gradient(#0000, #000);
}`,
    cnFunction: false,
    isUpdated: false,
    collection: "notifications",
    props: [
      {
        name: "events",
        type: "Event[]",
        description:
          "Array of events to display. Each event: { id, title, subtitle, location, image, badge?, participants: [{ avatar }] }.",
        required: false,
        fields: [
          { name: "id", type: "number", description: "Event id" },
          { name: "title", type: "string", description: "Event title" },
          {
            name: "subtitle",
            type: "string",
            description: "Event subtitle/date",
          },
          { name: "location", type: "string", description: "Event location" },
          { name: "image", type: "string", description: "Event image URL" },
          {
            name: "badge",
            type: "string",
            description: "Event badge (optional)",
          },
          {
            name: "participants",
            type: "{ avatar: string }[]",
            description: "Array of participant avatars",
          },
        ],
      },
      {
        name: "interval",
        type: "number",
        description: "Time in ms between auto-advance.",
        required: false,
      },
      {
        name: "className",
        type: "string",
        description: "Optional additional class names for the root container.",
        required: false,
      },
      {
        name: "cardClassName",
        type: "string",
        description: "Class name for each event card.",
        required: false,
      },
      {
        name: "activeIndex",
        type: "number",
        description: "Controlled active event index.",
        required: false,
      },
      {
        name: "onChange",
        type: "(index: number) => void",
        description: "Callback when the active event changes.",
        required: false,
      },
    ],
  },
]
