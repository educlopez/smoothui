import Link from "next/link"
import { Component, Github } from "lucide-react"

import { ThemeSwitch } from "@/app/components/themeSwitch"
import ToastChangelog from "@/app/components/toastChangelog"

export function FloatNav() {
  return (
    <nav
      className="border-light-900/20 bg-light-50/70 text-light-950 dark:border-dark-900/20 dark:bg-dark-50/50 dark:text-dark-950 fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 flex-row items-center justify-center gap-2 rounded-full border px-4 py-2 bg-blend-luminosity shadow-xs backdrop-blur-xl transition"
      aria-label="Floating Navigation"
    >
      <Link
        href="https://x.com/educalvolpz"
        aria-label="Visit X Profile of educalvolpz"
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-auto w-auto cursor-pointer items-center justify-center gap-4 p-1"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          className="fill-light-950 dark:fill-dark-950 hover:fill-pink-500 dark:hover:fill-pink-500"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="X Icon"
        >
          <path d="M14.773 2.5h2.545l-5.56 6.354 6.54 8.646h-5.12l-4.01-5.244-4.59 5.244H2.032l5.946-6.796L1.704 2.5h5.25l3.626 4.793L14.773 2.5zm-.893 13.477h1.41L6.19 3.943H4.676l9.204 12.034z"></path>
        </svg>
      </Link>
      <Link
        href="https://github.com/educlopez/smoothui"
        aria-label="Visit GitHub Repository"
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-auto w-auto cursor-pointer items-center justify-center gap-4 p-1 hover:text-pink-500"
      >
        <Github size={20} aria-hidden="true" />
      </Link>
      <Link
        href="/doc"
        aria-label="Documentation"
        className="flex h-auto w-auto cursor-pointer items-center justify-center gap-4 p-1 hover:text-pink-500"
      >
        <Component size={20} aria-hidden="true" />
      </Link>

      <ToastChangelog />
      <ThemeSwitch />
    </nav>
  )
}
