import Link from "next/link"
import { Component } from "lucide-react"

import { ThemeSwitch } from "@/app/components/ui/themeSwitch"

export function FloatNav() {
  return (
    <nav className="border-light11/20 bg-light1/70 text-light12 dark:border-dark11/20 dark:bg-dark1/50 dark:text-dark12 fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 flex-row items-center justify-center gap-2 rounded-full border px-4 py-2 bg-blend-luminosity shadow-xs backdrop-blur-xl transition">
      <a
        href="https://x.com/educalvolpz"
        aria-label="X Profile educalvolpz"
        target="_blank"
        className="flex h-auto w-auto cursor-pointer items-center justify-center gap-4 p-1"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          className="fill-light12 dark:fill-dark12 hover:fill-pink-500"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M14.773 2.5h2.545l-5.56 6.354 6.54 8.646h-5.12l-4.01-5.244-4.59 5.244H2.032l5.946-6.796L1.704 2.5h5.25l3.626 4.793L14.773 2.5zm-.893 13.477h1.41L6.19 3.943H4.676l9.204 12.034z"></path>
        </svg>
      </a>
      <Link
        href="/doc"
        aria-label="Documentation"
        className="flex h-auto w-auto cursor-pointer items-center justify-center gap-4 p-1 hover:text-pink-500"
      >
        <Component size={20} />
      </Link>
      <ThemeSwitch />
    </nav>
  )
}
