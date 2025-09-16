export interface BlocksProps {
  title: string
  description: string
  componentPath: string
  componentUi: React.ElementType
  stylePath?: string // Ruta opcional al archivo CSS extra
  props?: {
    name: string
    type: string
    description: string
    required: boolean
    fields?: { name: string; type: string; description: string }[]
    default?: string
  }[]
}
