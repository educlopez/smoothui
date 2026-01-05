export type ContributorInfo = {
  name: string;
  email: string;
  url?: string;
  username?: string;
  avatar?: string;
};

// Cache for contributors (key: owner/repo/filePath, value: contributors)
const contributorsCache = new Map<
  string,
  ContributorInfo[]
>();

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
  if (contributorsCache.has(cacheKey)) {
    return contributorsCache.get(cacheKey) ?? [];
  }

  try {
    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // Get all commits for this file to extract contributors
    // We need to get commits in reverse chronological order, then reverse to get creator first
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/commits?path=${encodeURIComponent(filePath)}&per_page=100`;
    const response = await fetch(apiUrl, {
      headers,
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      return [];
    }

    const commits = (await response.json()) as Array<{
      author: { login: string; avatar_url: string; html_url: string } | null;
      commit: {
        author: { name: string; email: string };
      };
    }>;

    if (commits.length === 0) {
      return [];
    }

    // Reverse commits to get oldest first (creator is the first commit)
    const reversedCommits = [...commits].reverse();

    // Get unique contributors, preserving order (first commit = creator)
    const contributorsMap = new Map<string, ContributorInfo>();
    const contributors: ContributorInfo[] = [];

    for (const commit of reversedCommits) {
      const author = commit.commit.author;
      const key = `${author.name}|${author.email}`;

      if (contributorsMap.has(key)) continue;

      const githubUser = commit.author;
      const username = githubUser?.login;
      const url = username ? `https://github.com/${username}` : undefined;
      const avatar = githubUser?.avatar_url;

      const contributor: ContributorInfo = {
        name: author.name,
        email: author.email,
        url,
        username,
        avatar: avatar ?? undefined,
      };

      contributorsMap.set(key, contributor);
      contributors.push(contributor);
    }

    // Cache the result
    contributorsCache.set(cacheKey, contributors);
    return contributors;
  } catch {
    return [];
  }
}

/**
 * Get all contributors for a component or block using GitHub API
 * @param type - "component" or "block"
 * @param name - Name of the component/block
 * @returns Array of contributor info, with the first one being the creator
 */
export async function getComponentContributors(
  type: "component" | "block",
  name: string
): Promise<ContributorInfo[]> {
  const owner = "educlopez";
  const repo = "smoothui";
  const token = process.env.GITHUB_TOKEN;

  const filePath =
    type === "component"
      ? `packages/smoothui/components/${name}/index.tsx`
      : `packages/smoothui/blocks/${name}/index.tsx`;

  return getGitHubContributors(owner, repo, filePath, token);
}

