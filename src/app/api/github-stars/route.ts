import { NextResponse } from "next/server"

export async function GET() {
  try {
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

    return NextResponse.json(
      { stars: starCount },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600", // Cache for 5 minutes, stale for 10 minutes
        },
      }
    )
  } catch (error) {
    console.error("Failed to fetch GitHub stars:", error)
    return NextResponse.json(
      { stars: 0, error: "Failed to fetch stars" },
      { status: 500 }
    )
  }
}
