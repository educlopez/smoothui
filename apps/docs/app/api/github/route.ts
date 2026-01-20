import { cache } from "react";
import { NextResponse } from "next/server";

interface GitHubRepoResponse {
  stargazers_count: number;
  forks_count: number;
  full_name: string;
  html_url: string;
}

// Use React.cache() for per-request deduplication
const fetchGitHubRepo = cache(async (owner: string, repo: string) => {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };

  // Add token from environment variable if available (for higher rate limits)
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}`,
    {
      headers,
      next: { revalidate: 300 }, // Cache for 5 minutes
    }
  );

  if (!response.ok) {
    // Try to get error details from response
    let errorMessage = "Failed to fetch GitHub data";
    try {
      const errorData = (await response.json()) as { message?: string };
      errorMessage = errorData.message ?? errorMessage;
    } catch {
      // If parsing fails, use default message
    }

    // Log error for debugging (only in development or when needed)
    console.error(
      `GitHub API error: ${response.status} ${response.statusText}`,
      {
        owner,
        repo,
        hasToken: Boolean(token),
        errorMessage,
      }
    );

    throw new Error(errorMessage);
  }

  return (await response.json()) as GitHubRepoResponse;
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");

  if (!owner || !repo) {
    return NextResponse.json(
      { error: "owner and repo are required" },
      { status: 400 }
    );
  }

  try {
    const data = await fetchGitHubRepo(owner, repo);

    return NextResponse.json({
      stars: data.stargazers_count,
      forks: data.forks_count,
      name: data.full_name,
      url: data.html_url,
    });
  } catch (error) {
    // Log unexpected errors
    console.error("Unexpected error fetching GitHub data:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch GitHub data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

