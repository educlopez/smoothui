"use client"

import Link from "next/link"
import { Star } from "lucide-react"

import AnimatedNumber from "./animated-number"
import { useGitHubStars } from "./hooks/use-github-stars"

export function GithubStars() {
  const { stars, isLoading, error, refresh } = useGitHubStars()

  // Show loading state
  if (isLoading) {
    return (
      <Link
        href="https://github.com/educlopez/smoothui"
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          // Allow refresh on click if loading
          e.preventDefault()
          refresh()
        }}
      >
        <span className="hover:text-brand flex items-center gap-1 text-sm font-medium transition-colors">
          <Star className="size-4 animate-pulse" />
          <span className="bg-muted h-4 w-8 animate-pulse rounded" />
        </span>
      </Link>
    )
  }

  // Show error state (fallback to 0)
  if (error) {
    console.warn("GitHub stars error:", error)
  }

  return (
    <Link
      href="https://github.com/educlopez/smoothui"
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        // Refresh on click if there's an error
        if (error) {
          e.preventDefault()
          refresh()
        }
      }}
    >
      <AnimatedNumber value={stars} />
    </Link>
  )
}
