"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Github, Search } from "lucide-react"

import { BlurMagic } from "@/components/blurmagic/blurMagic"
import { SearchDialog } from "@/components/doc/SearchDialog"
import { CustomTrigger } from "@/components/doc/sidebar/trigger"
import Logo from "@/components/logo"

const Header = () => {
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false)

  // Handle Cmd+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsSearchDialogOpen(true)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

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
        <BlurMagic
          side="top"
          className="z-2"
          stop="50%"
          blur="4px"
          background="var(--color-background)"
          height="76px"
        />

        {/* Left section */}
        <div className="z-3 flex items-center gap-4">
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

        {/* Center section - Search (Desktop only) */}
        <div className="z-3 hidden flex-1 justify-center md:flex">
          <button
            type="button"
            onClick={() => setIsSearchDialogOpen(true)}
            className="bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground inline-flex w-full max-w-sm cursor-pointer items-center gap-2 rounded-lg border p-2 text-sm transition-colors"
            aria-label="Search components"
          >
            <Search className="h-4 w-4" />
            <span className="flex-1 text-left">Search components...</span>
            <div className="ms-auto inline-flex gap-0.5">
              <kbd className="bg-primary rounded border px-1.5 font-mono text-xs">
                ⌘
              </kbd>
              <kbd className="bg-primary rounded border px-1.5 font-mono text-xs">
                K
              </kbd>
            </div>
          </button>
        </div>

        {/* Right section */}
        <div className="z-3 flex items-center gap-2">
          {/* Search Icon (Mobile only) */}
          <button
            type="button"
            onClick={() => setIsSearchDialogOpen(true)}
            className="border-border/50 bg-background/50 text-muted-foreground hover:bg-accent hover:text-accent-foreground flex h-8 w-8 items-center justify-center rounded-lg border transition-colors md:hidden"
            aria-label="Search components"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* GitHub Link */}
          <Link
            href="https://github.com/educlopez/smoothui"
            aria-label="Visit GitHub Repository"
            target="_blank"
            rel="noopener noreferrer"
            className="border-border/50 bg-background/50 text-muted-foreground hover:bg-accent hover:text-accent-foreground flex h-8 w-8 items-center justify-center rounded-lg border transition-colors"
          >
            <Github className="h-4 w-4" />
          </Link>

          {/* X.com Link */}
          <Link
            href="https://x.com/intent/user?screen_name=educalvolpz"
            aria-label="Visit X Profile of educalvolpz"
            target="_blank"
            rel="noopener noreferrer"
            className="border-border/50 bg-background/50 text-muted-foreground hover:bg-accent hover:text-accent-foreground flex h-8 w-8 items-center justify-center rounded-lg border transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="X Icon"
              fill="currentColor"
            >
              <path
                fill="currentColor"
                d="M14.773 2.5h2.545l-5.56 6.354 6.54 8.646h-5.12l-4.01-5.244-4.59 5.244H2.032l5.946-6.796L1.704 2.5h5.25l3.626 4.793L14.773 2.5zm-.893 13.477h1.41L6.19 3.943H4.676l9.204 12.034z"
              />
            </svg>
          </Link>
        </div>
      </nav>
    </>
  )
}

export default Header
