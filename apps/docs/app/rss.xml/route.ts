import { domain } from "@docs/lib/domain";
import { generateRegistryRssFeed } from "@wandry/analytics-sdk";

// Build at deploy time only — RSS feeds don't need real-time updates
export const dynamic = "force-static";
export const revalidate = false;

// Map individual block names to their category pages
const blockCategoryMap: Record<string, string> = {
  "faq-1": "faqs",
  "faq-2": "faqs",
  "footer-1": "footer",
  "footer-2": "footer",
  "header-1": "hero",
  "header-2": "hero",
  "header-3": "hero",
  "header-4": "hero",
  "logo-cloud-1": "logo-clouds",
  "logo-cloud-2": "logo-clouds",
  "pricing-1": "pricing",
  "pricing-2": "pricing",
  "pricing-3": "pricing",
  "stats-1": "stats",
  "stats-2": "stats",
  "team-1": "team-sections",
  "team-2": "team-sections",
  "testimonials-1": "testimonial",
  "testimonials-2": "testimonial",
  "testimonials-3": "testimonial",
};

// Blocks that should be excluded from RSS (like shared components)
const excludedBlocks = ["shared"];

// Cache for GitHub last edit dates (key: file path, value: last commit date)
const githubDateCache = new Map<string, Date>();

// Regex patterns (defined at top level for performance)
// Match both /docs/components/ and /components/ (with or without /docs/)
const componentUrlRegex = /\/docs\/components\/([^/]+)|\/components\/([^/]+)/;
// Match /docs/blocks/ and /blocks/ (with or without /docs/)
const blockUrlRegex = /\/docs\/blocks\/([^/]+)|\/blocks\/([^/]+)/;
const linkGuidRegex = /<(?:link|guid)>([^<]+)<\/(?:link|guid)>/;
const itemRegex = /<item>([\s\S]*?)<\/item>/g;
const pubDateRegex = /<pubDate>[^<]*<\/pubDate>/;

/**
 * Get the GitHub last commit date for a file
 */
async function getGitHubLastEditDate(
  owner: string,
  repo: string,
  filePath: string,
  token?: string
): Promise<Date | null> {
  // Check cache first
  const cacheKey = `${owner}/${repo}/${filePath}`;
  if (githubDateCache.has(cacheKey)) {
    return githubDateCache.get(cacheKey) ?? null;
  }

  try {
    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // Get the file's commit history (limit to 1 to get the most recent)
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/commits?path=${encodeURIComponent(filePath)}&per_page=1`;
    const response = await fetch(apiUrl, {
      headers,
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      // Log error for debugging (but don't throw)
      const NOT_FOUND_STATUS = 404;
      if (response.status === NOT_FOUND_STATUS) {
        // File doesn't exist, that's okay
        return null;
      }
      // Other errors (rate limit, etc.) - return null but don't cache
      return null;
    }

    const commits = (await response.json()) as Array<{
      commit: { committer: { date: string } };
    }>;

    if (commits.length === 0) {
      return null;
    }

    // Use committer date (when commit was applied) rather than author date
    const lastEditDate = new Date(commits[0].commit.committer.date);

    // Only cache if we got a valid date
    if (!Number.isNaN(lastEditDate.getTime())) {
      githubDateCache.set(cacheKey, lastEditDate);
      return lastEditDate;
    }

    return null;
  } catch {
    // Silently fail - return null so we don't break the RSS feed
    return null;
  }
}

/**
 * Extract component name from RSS item URL
 */
function extractComponentName(url: string): string | null {
  // Match /docs/components/component-name or /components/component-name
  const componentMatch = url.match(componentUrlRegex);
  if (componentMatch) {
    // The regex has two capture groups, one will be undefined
    const name = componentMatch[1] || componentMatch[2];
    if (name) {
      return name;
    }
  }

  return null;
}

/**
 * Extract block name from RSS item URL
 */
function extractBlockName(url: string): string | null {
  // Match /docs/blocks/block-name or /blocks/block-name
  const blockMatch = url.match(blockUrlRegex);
  if (blockMatch) {
    // The regex has two capture groups, one will be undefined
    const name = blockMatch[1] || blockMatch[2];
    if (name) {
      return name;
    }
  }

  return null;
}

/**
 * Get GitHub last edit date for a component
 */
function getItemLastEditDate(
  componentName: string,
  owner: string,
  repo: string,
  token?: string
): Promise<Date | null> {
  const githubPath = `packages/smoothui/components/${componentName}/index.tsx`;
  return getGitHubLastEditDate(owner, repo, githubPath, token);
}

/**
 * Get GitHub last edit date for a block
 * If blockName is a category, finds the most recently edited block in that category
 */
async function getBlockLastEditDate(
  blockName: string,
  owner: string,
  repo: string,
  token?: string
): Promise<Date | null> {
  // Check if blockName is a category (e.g., "faqs", "hero") or individual block (e.g., "faq-1")
  const isCategory = !Object.keys(blockCategoryMap).includes(blockName);

  if (isCategory) {
    // Find all blocks in this category
    const blocksInCategory = Object.entries(blockCategoryMap)
      .filter(([, category]) => category === blockName)
      .map(([block]) => block);

    if (blocksInCategory.length === 0) {
      return null;
    }

    // Get dates for all blocks in the category and return the most recent
    const datePromises = blocksInCategory.map((block) =>
      getGitHubLastEditDate(
        owner,
        repo,
        `packages/smoothui/blocks/${block}/index.tsx`,
        token
      )
    );

    const dates = await Promise.all(datePromises);
    const validDates = dates.filter((date): date is Date => date !== null);

    if (validDates.length === 0) {
      return null;
    }

    // Return the most recent date
    return new Date(Math.max(...validDates.map((d) => d.getTime())));
  }

  // It's an individual block, get its date directly
  const githubPath = `packages/smoothui/blocks/${blockName}/index.tsx`;
  return getGitHubLastEditDate(owner, repo, githubPath, token);
}

/**
 * Normalize URL by extracting pathname from full URL
 */
function normalizeUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname;
  } catch {
    return url;
  }
}

/**
 * Extract component or block name from RSS item content
 * Returns an object with type and name
 */
function extractItemNameFromItem(content: string): {
  type: "component" | "block";
  name: string;
} | null {
  const linkMatch = content.match(linkGuidRegex);
  if (!linkMatch) {
    return null;
  }

  const url = normalizeUrl(linkMatch[1]);

  // Try block first (since blocks might be incorrectly categorized as components)
  const blockName = extractBlockName(url);
  if (blockName) {
    return { type: "block", name: blockName };
  }

  // Check if it's a component URL that actually points to a block
  // (blocks might be incorrectly categorized as components in the RSS feed)
  const componentName = extractComponentName(url);
  if (componentName) {
    // Check if this component name is actually a block name
    if (Object.keys(blockCategoryMap).includes(componentName)) {
      return { type: "block", name: componentName };
    }
    return { type: "component", name: componentName };
  }

  return null;
}

/**
 * Replace pubDate in XML item
 */
function replaceItemPubDate(
  xml: string,
  item: { fullMatch: string; index: number },
  pubDate: Date
): string {
  const rfc822Date = pubDate.toUTCString().replace("GMT", "+0000");
  const newPubDate = `<pubDate>${rfc822Date}</pubDate>`;
  const itemWithNewDate = item.fullMatch.replace(pubDateRegex, newPubDate);

  if (itemWithNewDate === item.fullMatch) {
    return xml;
  }

  const lastIndex = xml.lastIndexOf(item.fullMatch);
  if (lastIndex === -1) {
    return xml;
  }

  return (
    xml.slice(0, lastIndex) +
    itemWithNewDate +
    xml.slice(lastIndex + item.fullMatch.length)
  );
}

/**
 * Fix pubDates in RSS XML by replacing them with actual GitHub last edit dates
 */
async function fixPubDates(
  rssXml: string,
  owner: string,
  repo: string,
  token?: string
): Promise<string> {
  // Extract all <item> blocks
  const items: Array<{ fullMatch: string; content: string; index: number }> =
    [];

  itemRegex.lastIndex = 0;
  let match: RegExpExecArray | null = itemRegex.exec(rssXml);
  while (match !== null) {
    items.push({
      fullMatch: match[0],
      content: match[1],
      index: match.index,
    });
    match = itemRegex.exec(rssXml);
  }

  // Process each item to get the correct pubDate
  const pubDatePromises = items.map(async (item) => {
    const itemInfo = extractItemNameFromItem(item.content);

    if (!itemInfo) {
      return { item, pubDate: null };
    }

    const lastEditDate =
      itemInfo.type === "block"
        ? await getBlockLastEditDate(itemInfo.name, owner, repo, token)
        : await getItemLastEditDate(itemInfo.name, owner, repo, token);

    return { item, pubDate: lastEditDate };
  });

  const pubDates = await Promise.all(pubDatePromises);

  // Replace pubDates in the XML
  let resultXml = rssXml;
  const reversedPubDates = [...pubDates].reverse();

  for (const { item, pubDate } of reversedPubDates) {
    if (!pubDate) {
      continue;
    }

    resultXml = replaceItemPubDate(resultXml, item, pubDate);
  }

  return resultXml;
}

function fixRssUrls(rssXml: string, baseUrl: string): string {
  let fixedXml = rssXml;

  // First, fix blocks that are incorrectly categorized as components
  // Pattern: /docs/components/block-name -> /docs/blocks/category-name
  for (const [blockName, categoryName] of Object.entries(blockCategoryMap)) {
    const escapedBlockName = blockName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // Match /docs/components/block-name and replace with /docs/blocks/category-name
    const regex = new RegExp(
      `${baseUrl}/docs/components/${escapedBlockName}([^<"\\s]*)`,
      "g"
    );
    fixedXml = fixedXml.replace(
      regex,
      `${baseUrl}/docs/blocks/${categoryName}$1`
    );
  }

  // Fix component URLs: /components/... -> /docs/components/...
  // (in case the SDK doesn't use the componentsUrl config)
  // But exclude blocks that we just fixed
  const blockNames = Object.keys(blockCategoryMap).join("|");
  fixedXml = fixedXml.replace(
    new RegExp(`${baseUrl}/components/(?!${blockNames})([^<"\\s]+)`, "g"),
    `${baseUrl}/docs/components/$1`
  );

  // Fix block URLs: map individual blocks to category pages
  // Pattern: /docs/blocks/block-name -> /docs/blocks/category-name
  for (const [blockName, categoryName] of Object.entries(blockCategoryMap)) {
    const escapedBlockName = blockName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // Match /docs/blocks/block-name and /blocks/block-name
    const patterns = [
      new RegExp(`${baseUrl}/docs/blocks/${escapedBlockName}([^<"\\s]*)`, "g"),
      new RegExp(`${baseUrl}/blocks/${escapedBlockName}([^<"\\s]*)`, "g"),
    ];
    for (const regex of patterns) {
      fixedXml = fixedXml.replace(
        regex,
        `${baseUrl}/docs/blocks/${categoryName}$1`
      );
    }
  }

  // Fix any remaining /blocks/ URLs that don't match the map
  // These should still get the /docs/ prefix
  fixedXml = fixedXml.replace(
    new RegExp(`${baseUrl}/blocks/([^<"\\s]+)`, "g"),
    `${baseUrl}/docs/blocks/$1`
  );

  return fixedXml;
}

function removeExcludedItems(rssXml: string): string {
  let cleanedXml = rssXml;

  // Remove RSS items for excluded blocks
  for (const excludedName of excludedBlocks) {
    // Remove entire <item> blocks for excluded items
    // Match <item>...</item> that contains the excluded name in link or guid
    const escapedName = excludedName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const excludedItemRegex = new RegExp(
      `<item>[\\s\\S]*?<(?:link|guid)>[^<]*/${escapedName}[^<]*</(?:link|guid)>[\\s\\S]*?</item>`,
      "g"
    );
    cleanedXml = cleanedXml.replace(excludedItemRegex, "");
  }

  // Note: We now KEEP block items in the RSS feed
  // They are properly mapped to category pages via fixRssUrls

  // Clean up any double newlines that might result from removal
  cleanedXml = cleanedXml.replace(/\n\s*\n\s*\n/g, "\n\n");

  return cleanedXml;
}

export async function GET() {
  const baseUrl = domain;
  const owner = "educlopez";
  const repo = "smoothui";
  const token = process.env.GITHUB_TOKEN;

  const rssXml = await generateRegistryRssFeed({
    baseUrl,
    componentsUrl: "docs/components",
    blocksUrl: "docs/blocks",
    rss: {
      title: "SmoothUI",
      description:
        "SmoothUI is a collection of beautifully designed components with smooth animations built with React, Tailwind CSS, and Motion",
      link: "https://smoothui.dev",
      pubDateStrategy: "githubLastEdit",
    },
    registry: {
      path: "r/registry.json",
    },
    github: {
      owner,
      repo,
      token,
    },
  });

  if (!rssXml) {
    return new Response("RSS feed not available", {
      status: 404,
      headers: { "Content-Type": "text/plain" },
    });
  }

  // Fix pubDates BEFORE fixing URLs so we can use original block names
  // (e.g., faq-1, faq-2) instead of category names (e.g., faqs)
  let fixedRssXml = await fixPubDates(rssXml, owner, repo, token);

  // Fix URLs in the RSS feed
  fixedRssXml = fixRssUrls(fixedRssXml, baseUrl);

  // Remove excluded items
  fixedRssXml = removeExcludedItems(fixedRssXml);

  return new Response(fixedRssXml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control":
        "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
