import Link from "next/link"
import { Github } from "lucide-react"

import { Icon } from "../icon"
import Logo from "../logo"

export default function Navbar() {
  return (
    <nav className="fixed top-0 right-0 left-0 z-40 flex h-16 items-center justify-between py-2">
      <div className="mx-auto flex w-full max-w-7xl flex-row items-center justify-between px-4">
        <div className="flex items-center justify-center gap-3">
          <Logo classNameIcon="w-6" className="w-32" />
        </div>
        <div className="flex items-center gap-6">
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
            <Github size={18} /> Issues
          </Link>
        </div>
      </div>
    </nav>
  )
}
