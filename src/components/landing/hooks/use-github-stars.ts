import { useCallback, useEffect, useState } from "react"

interface GitHubStarsData {
  stars: number
  isLoading: boolean
  error: string | null
  refresh: () => Promise<void>
}

export function useGitHubStars(): GitHubStarsData {
  const [stars, setStars] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStars = useCallback(async () => {
    try {
      setError(null)
      const res = await fetch("/api/github-stars")

      if (!res.ok) {
        throw new Error(`Failed to fetch stars: ${res.status}`)
      }

      const data = await res.json()
      setStars(data.stars || 0)
    } catch (err) {
      console.error("Error fetching GitHub stars:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch stars")
      // Keep the previous star count on error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const refresh = useCallback(async () => {
    setIsLoading(true)
    await fetchStars()
  }, [fetchStars])

  useEffect(() => {
    fetchStars()

    // Refresh every 5 minutes
    const interval = setInterval(fetchStars, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [fetchStars])

  return { stars, isLoading, error, refresh }
}
