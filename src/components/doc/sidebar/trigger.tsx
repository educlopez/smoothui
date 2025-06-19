import { PanelLeft } from "lucide-react"

import { Button } from "@/components/button"
import { useSidebar } from "@/components/ui/sidebar"

export function CustomTrigger() {
  const { toggleSidebar } = useSidebar()

  return (
    <Button variant="ghost" onClick={toggleSidebar}>
      <PanelLeft size={20} className="drop-shadow-sm" />
    </Button>
  )
}
