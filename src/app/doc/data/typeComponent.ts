export interface ComponentsProps {
  id: number
  componentTitle: string
  slug?: string
  type?: "component" | "block"
  isNew?: boolean
  createdAt?: string // ISO date string
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
    default?: unknown
  }[]
  hasRefreshDemo?: boolean
  icon?: string
  relatedComponents?: string[]
}
