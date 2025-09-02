"use client"

import { useCallback, useEffect, useRef, useState } from "react"

interface GitHubStarsData {
  stars: number
  isLoading: boolean
  error: string | null
  refresh: () => Promise<void>
}

// Cache stars data to reduce API calls across components
const starsCache = {
  data: 0,
  timestamp: 0,
  isValid: () => Date.now() - starsCache.timestamp < 5 * 60 * 1000, // 5 minutes
}

export function useGitHubStars(): GitHubStarsData {
  const [stars, setStars] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const refreshTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  const fetchStars = useCallback(async () => {
    try {
      setError(null)

      // Check cache first
      if (starsCache.isValid()) {
        setStars(starsCache.data)
        setIsLoading(false)
        return
      }

      const res = await fetch("/api/github-stars", {
        // Add cache control to prevent unnecessary requests
        headers: {
          "Cache-Control": "max-age=300", // 5 minutes
        },
      })

      if (!res.ok) {
        throw new Error(`Failed to fetch stars: ${res.status}`)
      }

      const data = await res.json()
      const starCount = data.stars || 0

      // Update cache
      starsCache.data = starCount
      starsCache.timestamp = Date.now()

      setStars(starCount)
    } catch (err) {
      console.error("Error fetching GitHub stars:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch stars")

      // Use cached data if available, even if expired
      if (starsCache.data > 0) {
        setStars(starsCache.data)
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const refresh = useCallback(async () => {
    // Clear existing timeout
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current)
    }

    setIsLoading(true)
    await fetchStars()
  }, [fetchStars])

  useEffect(() => {
    // Initial fetch
    fetchStars()

    // Set up refresh interval only if we don't have valid cached data
    if (!starsCache.isValid()) {
      refreshTimeoutRef.current = setTimeout(fetchStars, 5 * 60 * 1000) // 5 minutes
    }

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current)
      }
    }
  }, [fetchStars])

  return { stars, isLoading, error, refresh }
}
