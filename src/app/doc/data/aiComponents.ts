import AiBranchDemo from "@/components/smoothui/examples/AiBranchDemo"
import AiInputDemo from "@/components/smoothui/examples/AiInputDemo"

import type { ComponentsProps } from "./typeComponent"

export const aiComponents: ComponentsProps[] = [
  {
    id: 1,
    componentTitle: "AI Branch",
    slug: "ai-branch",
    type: "component",
    isNew: true,
    tags: ["ai", "conversation", "chat", "branching", "history", "management"],
    href: "https://x.com/educalvolpz",
    info: "Manages conversation history where users can switch between different versions of their questions and see the corresponding AI responses. Perfect for scenarios where users edit their questions and want to see how the AI response changes.",
    componentUi: AiBranchDemo,
    download: "motion lucide-react",
    cnFunction: true,
    isUpdated: false,
    collection: "ai",
    props: [
      {
        name: "branches",
        type: "AIBranch[]",
        description: "Array of conversation branches to display.",
        required: true,
        fields: [
          {
            name: "id",
            type: "string",
            description: "Unique branch identifier",
          },
          {
            name: "userMessage",
            type: "string",
            description: "The user's question or message",
          },
          {
            name: "aiResponse",
            type: "string",
            description: "The AI's response to the user message",
          },
          {
            name: "timestamp",
            type: "Date",
            description: "When the conversation branch was created",
          },
          {
            name: "isActive",
            type: "boolean",
            description: "Whether this branch is currently selected",
          },
        ],
      },
      {
        name: "onBranchSelect",
        type: "(branchId: string) => void",
        description: "Callback fired when a branch is selected.",
        required: true,
      },
      {
        name: "className",
        type: "string",
        description: "Optional additional class names for the root container.",
        required: false,
      },
    ],
    hasRefreshDemo: true,
    icon: "GitBranch",
  },
  {
    id: 2,
    componentTitle: "AI Input",
    slug: "ai-input",
    type: "component",
    isNew: true,
    tags: ["ai", "input", "chat", "assistant", "interface", "conversation"],
    href: "https://x.com/educalvolpz",
    info: "A sleek AI input component featuring an animated Siri orb that morphs between dock and input states. Includes smooth spring animations, click-outside behavior, and keyboard shortcuts (⌘+Enter). Perfect for AI chat interfaces with elegant micro-interactions.",
    componentUi: AiInputDemo,
    download: "motion lucide-react",
    cnFunction: true,
    isUpdated: false,
    collection: "ai",
    props: [
      {
        name: "onSubmit",
        type: "(message: string) => void",
        description: "Callback fired when the user submits a message.",
        required: false,
      },
      {
        name: "placeholder",
        type: "string",
        description: "Placeholder text for the input field.",
        required: false,
        default: "Ask me anything...",
      },
      {
        name: "disabled",
        type: "boolean",
        description: "Whether the input is disabled.",
        required: false,
        default: false,
      },
      {
        name: "loading",
        type: "boolean",
        description: "Whether the AI is currently processing a request.",
        required: false,
        default: false,
      },
      {
        name: "expandable",
        type: "boolean",
        description: "Whether the input can expand to show additional content.",
        required: false,
        default: false,
      },
      {
        name: "success",
        type: "boolean",
        description: "Whether to show success state after submission.",
        required: false,
        default: false,
      },
      {
        name: "className",
        type: "string",
        description: "Optional additional class names for the root container.",
        required: false,
      },
      {
        name: "children",
        type: "React.ReactNode",
        description: "Custom content to render inside the input component.",
        required: false,
      },
    ],
    hasRefreshDemo: true,
    icon: "Send",
  },
]
