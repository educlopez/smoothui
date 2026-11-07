import { NextResponse } from "next/server";

const GITHUB_REPO_URL = "https://api.github.com/repos/educlopez/smoothui";
const GENERIC_ERROR = "Failed to fetch GitHub data";

interface GitHubRepoResponse {
  forks_count: number;
  full_name: string;
  html_url: string;
  stargazers_count: number;
}

interface GitHubRepoStats {
  forks: number;
  name: string;
  stars: number;
  url: string;
}

let lastSuccessful: GitHubRepoStats | null = null;

const isGitHubRepoResponse = (value: unknown): value is GitHubRepoResponse => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const repo = value as Record<string, unknown>;

  return (
    typeof repo.forks_count === "number" &&
    typeof repo.full_name === "string" &&
    typeof repo.html_url === "string" &&
    typeof repo.stargazers_count === "number"
  );
};

const fetchGitHubRepo = async (): Promise<GitHubRepoStats> => {
  const response = await fetch(GITHUB_REPO_URL, {
    headers: {
      Accept: "application/vnd.github.v3+json",
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(GENERIC_ERROR);
  }

  const data: unknown = await response.json();

  if (!isGitHubRepoResponse(data)) {
    throw new Error(GENERIC_ERROR);
  }

  return {
    forks: data.forks_count,
    name: data.full_name,
    stars: data.stargazers_count,
    url: data.html_url,
  };
};

export async function GET() {
  try {
    const data = await fetchGitHubRepo();
    lastSuccessful = data;
    return NextResponse.json(data);
  } catch {
    if (lastSuccessful) {
      return NextResponse.json(lastSuccessful);
    }

    return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
  }
}
