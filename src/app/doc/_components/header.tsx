"use client"

import Image from "next/image"

import { useIsMobile } from "@/components/ui/hooks/use-mobile"
import { CustomTrigger } from "@/app/doc/_components/sidebar/trigger"

import Logo from "./../../../../public/icon.png"

const Header = () => {
  const isMobile = useIsMobile()
  return (
    <nav
      className="bg-light-50/50 dark:bg-dark-50/50 sticky top-0 right-0 left-0 z-30 flex items-center justify-between px-4 py-1 backdrop-blur-md md:py-3"
      aria-label="Main navigation"
    >
      <div className="flex flex-1 items-center gap-4">
        <CustomTrigger />
        <div className="my-3 block px-0 py-1 lg:hidden">
          <Image src={Logo} alt="Logo SmoothUI" width={36} />
        </div>
      </div>
    </nav>
  )
}

export default Header
