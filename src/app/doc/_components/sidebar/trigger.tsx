import { PanelLeft } from "lucide-react"

import { useSidebar } from "@/components/ui/sidebar"

export function CustomTrigger() {
  const { toggleSidebar } = useSidebar()

  return (
    <button
      className="candy-btn group relative cursor-pointer rounded-md px-1 py-1 text-sm font-medium"
      onClick={toggleSidebar}
    >
      <PanelLeft size={20} className="drop-shadow-sm" />
    </button>
  )
}
