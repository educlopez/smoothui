import { cache } from "react";

export interface ContributorInfo {
  name: string;
  email: string;
  url?: string;
  username?: string;
  avatar?: string;
}

// Cache for contributors (key: owner/repo/filePath, value: contributors)
const contributorsCache = new Map<string, ContributorInfo[]>();

// Regex for parsing Link header (defined at top level for performance)
const LINK_HEADER_REGEX = /<([^>]+)>;\s*rel="([^"]+)"/;

/**
 * Validate commit author structure
 */
function isValidCommitAuthor(
  author: unknown
): author is { name: string; email: string } {
  if (!author || typeof author !== "object") {
    return false;
  }

  const authorObj = author as Record<string, unknown>;
  return (
    typeof authorObj.name === "string" && typeof authorObj.email === "string"
  );
}

/**
 * Validate GitHub user structure
 */
function isValidGitHubUser(
  user: unknown
): user is { login: string; avatar_url: string; html_url: string } {
  if (!user || typeof user !== "object") {
    return false;
  }

  const userObj = user as Record<string, unknown>;
  return (
    typeof userObj.login === "string" &&
    typeof userObj.avatar_url === "string" &&
    typeof userObj.html_url === "string"
  );
}

/**
 * Runtime validation for GitHub commit API response item
 */
function isValidCommitItem(item: unknown): item is {
  author: { login: string; avatar_url: string; html_url: string } | null;
  commit: {
    author: { name: string; email: string } | null;
  };
} {
  if (!item || typeof item !== "object") {
    return false;
  }

  const commit = item as Record<string, unknown>;

  // Validate commit.commit exists and is an object
  if (!commit.commit || typeof commit.commit !== "object") {
    return false;
  }

  const commitData = commit.commit as Record<string, unknown>;

  // Validate commit.commit.author (can be null)
  if (commitData.author !== null && !isValidCommitAuthor(commitData.author)) {
    return false;
  }

  // Validate commit.author (can be null)
  if (commit.author !== null && !isValidGitHubUser(commit.author)) {
    return false;
  }

  return true;
}

/**
 * Parse Link header to extract pagination info
 */
function parseLinkHeader(linkHeader: string | null): {
  next?: string;
  last?: string;
} {
  const links: { next?: string; last?: string } = {};

  if (!linkHeader) {
    return links;
  }

  const linkParts = linkHeader.split(",");
  for (const part of linkParts) {
    const match = part.match(LINK_HEADER_REGEX);
    if (match) {
      const url = match[1];
      const rel = match[2];
      if (rel === "next") {
        links.next = url;
      } else if (rel === "last") {
        links.last = url;
      }
    }
  }

  return links;
}

interface CommitItem {
  author: { login: string; avatar_url: string; html_url: string } | null;
  commit: {
    author: { name: string; email: string } | null;
  };
}

interface FetchCommitsPageOptions {
  owner: string;
  repo: string;
  filePath: string;
  page: number;
  perPage: number;
  headers: HeadersInit;
}

/**
 * Fetch a single page of commits from GitHub API
 */
async function fetchCommitsPage(
  options: FetchCommitsPageOptions
): Promise<{ commits: CommitItem[]; hasMore: boolean }> {
  const { owner, repo, filePath, page, perPage, headers } = options;
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/commits?path=${encodeURIComponent(filePath)}&per_page=${perPage}&page=${page}`;

  try {
    const response = await fetch(apiUrl, {
      headers,
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      // Try to get error details from response
      let errorMessage = `HTTP ${response.status}`;
      let rateLimitInfo = "";

      try {
        const errorData = (await response.json()) as {
          message?: string;
          documentation_url?: string;
        };
        errorMessage = errorData.message ?? errorMessage;
      } catch {
        // If parsing fails, try to get rate limit info from headers
        const remaining = response.headers.get("x-ratelimit-remaining");
        const reset = response.headers.get("x-ratelimit-reset");
        if (remaining !== null || reset !== null) {
          rateLimitInfo = ` Rate limit remaining: ${remaining}, Reset at: ${reset}`;
        }
      }

      // Log error for debugging (but don't throw to avoid breaking the page)
      if (response.status === 403 || response.status === 429) {
        // Rate limit or forbidden - these are important to log
        console.error(
          `GitHub API rate limit/forbidden: ${response.status} for ${filePath} page ${page}. ${errorMessage}${rateLimitInfo}`
        );
      } else if (response.status !== 404) {
        // Log other errors (but not 404, which is expected for files that don't exist)
        console.error(
          `GitHub API error: ${response.status} for ${filePath} page ${page}. ${errorMessage}${rateLimitInfo}`
        );
      }
      return { commits: [], hasMore: false };
    }

    const commits = (await response.json()) as unknown;

    // Validate response is an array
    if (!Array.isArray(commits)) {
      return { commits: [], hasMore: false };
    }

    // Validate and filter each commit item
    const validCommits: CommitItem[] = [];
    for (const item of commits) {
      if (isValidCommitItem(item) && item.commit.author) {
        validCommits.push(item);
      }
    }

    // Check if there are more pages
    const hasMoreByCount = commits.length >= perPage;
    const linkHeader = response.headers.get("Link");
    const links = parseLinkHeader(linkHeader);
    const hasMoreByLink = Boolean(links.next);

    return { commits: validCommits, hasMore: hasMoreByCount && hasMoreByLink };
  } catch (error) {
    // Log unexpected errors
    console.error(
      `Unexpected error fetching GitHub commits for ${filePath} page ${page}:`,
      error
    );
    return { commits: [], hasMore: false };
  }
}

/**
 * Extract contributors from commits
 */
function extractContributors(commits: CommitItem[]): ContributorInfo[] {
  // Reverse commits to get oldest first (creator is the first commit)
  const reversedCommits = [...commits].reverse();

  // Get unique contributors, preserving order (first commit = creator)
  const contributorsMap = new Map<string, ContributorInfo>();
  const contributors: ContributorInfo[] = [];

  for (const commit of reversedCommits) {
    // Guard against null/undefined commit.author
    const commitAuthor = commit.commit.author;
    if (!commitAuthor) {
      continue;
    }

    const key = `${commitAuthor.name}|${commitAuthor.email}`;

    if (contributorsMap.has(key)) {
      continue;
    }

    // Guard against null/undefined author
    const githubUser = commit.author;
    const username = githubUser?.login;
    const url = username ? `https://github.com/${username}` : undefined;
    const avatar = githubUser?.avatar_url;

    const contributor: ContributorInfo = {
      name: commitAuthor.name,
      email: commitAuthor.email,
      url,
      username,
      avatar: avatar ?? undefined,
    };

    contributorsMap.set(key, contributor);
    contributors.push(contributor);
  }

  return contributors;
}

/**
 * Get all contributors for a file using GitHub API
 * Similar to how lastModified is obtained
 */
async function getGitHubContributors(
  owner: string,
  repo: string,
  filePath: string,
  token?: string
): Promise<ContributorInfo[]> {
  // Check cache first
  const cacheKey = `${owner}/${repo}/${filePath}`;
  const cached = contributorsCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // Fetch all commits with pagination
    // Limit to first 5 pages during build to avoid rate limiting
    // This still gives us up to 500 commits per file, which is usually enough
    const maxPages = process.env.NODE_ENV === "production" ? 5 : 10;
    const allCommits: CommitItem[] = [];
    let page = 1;
    const perPage = 100;
    let hasMorePages = true;

    while (hasMorePages && page <= maxPages) {
      const { commits, hasMore } = await fetchCommitsPage({
        owner,
        repo,
        filePath,
        page,
        perPage,
        headers,
      });

      allCommits.push(...commits);

      if (hasMore && page < maxPages) {
        page++;
      } else {
        hasMorePages = false;
      }
    }

    if (allCommits.length === 0) {
      return [];
    }

    const contributors = extractContributors(allCommits);

    // Cache the result
    contributorsCache.set(cacheKey, contributors);
    return contributors;
  } catch (error) {
    // Log unexpected errors
    console.error(
      `Unexpected error getting GitHub contributors for ${filePath}:`,
      error
    );
    return [];
  }
}

/**
 * Get all contributors for a component or block using GitHub API
 * @param type - "component" or "block"
 * @param name - Name of the component/block
 * @returns Array of contributor info, with the first one being the creator
 */
// Use React.cache() for per-request deduplication
export const getComponentContributors = cache(
  async (
    type: "component" | "block",
    name: string
  ): Promise<ContributorInfo[]> => {
    const owner = "educlopez";
    const repo = "smoothui";
    const token = process.env.GITHUB_TOKEN;

    const filePath =
      type === "component"
        ? `packages/smoothui/components/${name}/index.tsx`
        : `packages/smoothui/blocks/${name}/index.tsx`;

    return await getGitHubContributors(owner, repo, filePath, token);
  }
);
