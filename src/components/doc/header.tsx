"use client"

import { useState } from "react"
import Link from "next/link"
import { Search } from "lucide-react"

import { BlurMagic } from "@/components/blurmagic/blurMagic"
import { SearchDialog } from "@/components/doc/SearchDialog"
import { CustomTrigger } from "@/components/doc/sidebar/trigger"
import Logo from "@/components/logo"
import { useIsMobile } from "@/components/ui/hooks/use-mobile"

const Header = () => {
  const isMobile = useIsMobile()
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false)

  return (
    <>
      <SearchDialog
        open={isSearchDialogOpen}
        onOpenChange={setIsSearchDialogOpen}
      />
      <nav
        className="sticky top-0 right-0 left-0 z-30 flex items-center justify-between px-4 py-1 md:py-3"
        aria-label="Main navigation"
      >
        {isMobile && (
          <BlurMagic
            side="top"
            className="z-2"
            stop="50%"
            blur="4px"
            background="var(--color-background)"
            height="76px"
          />
        )}
        <div className="z-3 flex flex-1 items-center gap-4">
          <CustomTrigger />

          <Link
            href="/"
            title="Home"
            aria-label="Go to home page"
            className="my-3 flex flex-row items-center justify-center gap-2 px-0 py-1 lg:hidden"
          >
            <Logo classNameIcon="w-5" />
          </Link>
        </div>
        {isMobile && (
          <button
            type="button"
            onClick={() => setIsSearchDialogOpen(true)}
            className="border-border/50 bg-background/50 text-muted-foreground hover:bg-accent hover:text-accent-foreground z-3 flex h-8 w-8 items-center justify-center rounded-lg border transition-colors"
            aria-label="Search components"
          >
            <Search className="h-4 w-4" />
          </button>
        )}
      </nav>
    </>
  )
}

export default Header
