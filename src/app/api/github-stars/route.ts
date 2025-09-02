import { NextResponse } from "next/server"

// Cache GitHub stars data in memory to reduce external API calls
let cachedStars: { count: number; timestamp: number } | null = null
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

export async function GET() {
  try {
    // Check if we have valid cached data
    if (cachedStars && Date.now() - cachedStars.timestamp < CACHE_DURATION) {
      return NextResponse.json(
        { stars: cachedStars.count },
        {
          headers: {
            "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
            "X-Cache": "HIT",
          },
        }
      )
    }

    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
    }

    // Add GitHub token if available for higher rate limits
    if (process.env.GITHUB_TOKEN) {
      headers["Authorization"] = `token ${process.env.GITHUB_TOKEN}`
    }

    const res = await fetch("https://api.github.com/repos/educlopez/smoothui", {
      headers,
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status}`)
    }

    const data = await res.json()
    const starCount = data.stargazers_count || 0

    // Update cache
    cachedStars = {
      count: starCount,
      timestamp: Date.now(),
    }

    return NextResponse.json(
      { stars: starCount },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
          "X-Cache": "MISS",
        },
      }
    )
  } catch (error) {
    console.error("Failed to fetch GitHub stars:", error)

    // Return cached data if available, even if expired
    if (cachedStars) {
      return NextResponse.json(
        { stars: cachedStars.count, fromCache: true },
        {
          headers: {
            "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
            "X-Cache": "STALE",
          },
        }
      )
    }

    return NextResponse.json(
      { stars: 0, error: "Failed to fetch stars" },
      {
        status: 500,
        headers: {
          "Cache-Control": "public, s-maxage=60",
        },
      }
    )
  }
}

// Add runtime and revalidation configuration
export const runtime = "edge"
export const revalidate = 300 // Cache for 5 minutes
