import Link from "next/link"
import { Github } from "lucide-react"

import GithubStars from "@/components/landing/githubstars"
import Logo from "@/components/logo"

export default function Navbar() {
  return (
    <nav className="fixed top-0 right-0 left-0 z-40 flex h-16 items-center justify-between py-2">
      <div className="mx-auto flex w-full max-w-7xl flex-row items-center justify-between px-4">
        <div className="flex items-center justify-center gap-2 md:gap-3">
          <Logo classNameIcon="w-4 md:w-6" className="text-xl md:text-3xl" />
        </div>
        <div className="flex items-center justify-end gap-4 md:gap-6">
          <Link
            href="/doc"
            className="hover:text-brand text-sm font-medium transition-colors"
          >
            Docs
          </Link>
          <Link
            href="https://github.com/educlopez/smoothui/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand flex items-center gap-1 text-sm font-medium transition-colors"
          >
            <Github className="size-4" /> Issues
          </Link>
          <GithubStars />
        </div>
      </div>
    </nav>
  )
}
