import Link from "next/link"
import { Component, Github } from "lucide-react"

import { ThemeSwitch } from "@/components/themeSwitch"
import ToastChangelog from "@/components/toastChangelog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/tooltip"

import { ColorPickerFloatNav } from "./ColorPickerFloatNav"

export function FloatNav() {
  return (
    <nav
      className="bg-background/70 text-foreground fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 flex-row items-center justify-center gap-2 rounded-full border px-4 py-2 bg-blend-luminosity shadow-xs backdrop-blur-xl transition"
      aria-label="Floating Navigation"
    >
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="https://x.com/intent/user?screen_name=educalvolpz"
              aria-label="Visit X Profile of educalvolpz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-brand flex h-auto w-auto cursor-pointer items-center justify-center gap-4 p-1"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="X Icon"
                fill="currentColor"
              >
                <path
                  fill="currentColor"
                  d="M14.773 2.5h2.545l-5.56 6.354 6.54 8.646h-5.12l-4.01-5.244-4.59 5.244H2.032l5.946-6.796L1.704 2.5h5.25l3.626 4.793L14.773 2.5zm-.893 13.477h1.41L6.19 3.943H4.676l9.204 12.034z"
                ></path>
              </svg>
            </Link>
          </TooltipTrigger>
          <TooltipContent className="bg-background rounded-full border px-4 py-2 text-xs shadow-xs">
            <p>Follow me on X</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="https://github.com/educlopez/smoothui"
              aria-label="Visit GitHub Repository"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-brand flex h-auto w-auto cursor-pointer items-center justify-center gap-4 p-1"
            >
              <Github size={20} aria-hidden="true" />
            </Link>
          </TooltipTrigger>
          <TooltipContent className="bg-background rounded-full border px-4 py-2 text-xs shadow-xs">
            <p>GitHub</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/doc"
              aria-label="Documentation"
              className="hover:text-brand text-foreground flex h-auto w-auto cursor-pointer items-center justify-center gap-4 p-1"
            >
              <Component size={20} aria-hidden="true" />
            </Link>
          </TooltipTrigger>
          <TooltipContent className="bg-background rounded-full border px-4 py-2 text-xs shadow-xs">
            <p>Documentation</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger>
            <ToastChangelog />
          </TooltipTrigger>
          <TooltipContent className="bg-background rounded-full border px-4 py-2 text-xs shadow-xs">
            <p>Latest Changes</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger>
            <ThemeSwitch />
          </TooltipTrigger>
          <TooltipContent className="bg-background rounded-full border px-4 py-2 text-xs shadow-xs">
            <p>Theme Switcher</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <ColorPickerFloatNav />
          </TooltipTrigger>
          <TooltipContent className="bg-background rounded-full border px-4 py-2 text-xs shadow-xs">
            <p>Color Switcher</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </nav>
  )
}
