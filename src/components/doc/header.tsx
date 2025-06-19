"use client"

import { CustomTrigger } from "@/components/doc/sidebar/trigger"
import Logo from "@/components/logo"
import { useIsMobile } from "@/components/ui/hooks/use-mobile"

const Header = () => {
  const isMobile = useIsMobile()
  return (
    <nav
      className="sticky top-0 right-0 left-0 z-30 flex items-center justify-between px-4 py-1 md:py-3"
      aria-label="Main navigation"
    >
      <div className="flex flex-1 items-center gap-4">
        <CustomTrigger />
        <div className="my-3 flex flex-row items-center justify-center gap-2 px-0 py-1 lg:hidden">
          <Logo classNameIcon="w-5" />
        </div>
      </div>
    </nav>
  )
}

export default Header
