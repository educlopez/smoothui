import { PanelLeft } from "lucide-react"

import { useSidebar } from "@/components/ui/sidebar"
import { Button } from "@/app/components/button"

export function CustomTrigger() {
  const { toggleSidebar } = useSidebar()

  return (
    <Button variant="ghost" onClick={toggleSidebar}>
      <PanelLeft size={20} className="drop-shadow-sm" />
    </Button>
  )
}
