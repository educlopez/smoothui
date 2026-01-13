import { NextRequest, NextResponse } from "next/server";

// Extract tweet ID from URL
function getTweetId(url: string): string | null {
  const match = url.match(/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/);
  return match ? match[1] : null;
}

// Extract images from HTML
function extractImagesFromHtml(html: string): string[] {
  const images: string[] = [];
  const seenImages = new Set<string>();

  // Match img tags with src attribute (multiple patterns)
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    const src = match[1];
    if (!src || seenImages.has(src)) continue;

    // Decode HTML entities in URL
    const decodedSrc = src
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");

    // Filter out profile pictures, icons, and emojis
    // Keep only tweet media images (usually from pbs.twimg.com or media URLs)
    if (
      decodedSrc &&
      !decodedSrc.includes("profile_images") &&
      !decodedSrc.includes("default_profile") &&
      !decodedSrc.includes("abs.twimg.com/icons") &&
      !decodedSrc.includes("emoji") &&
      !decodedSrc.includes("data:image") &&
      (decodedSrc.includes("twimg.com") || decodedSrc.includes("media"))
    ) {
      images.push(decodedSrc);
      seenImages.add(decodedSrc);
    }
  }

  // Also try to extract from data attributes or other patterns
  // Some tweets may have images in data-src or similar attributes
  const dataSrcRegex = /(?:data-src|data-url)=["']([^"']+)["']/gi;
  while ((match = dataSrcRegex.exec(html)) !== null) {
    const src = match[1];
    if (!src || seenImages.has(src)) continue;

    const decodedSrc = src
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");

    if (
      decodedSrc &&
      !decodedSrc.includes("profile_images") &&
      !decodedSrc.includes("default_profile") &&
      !decodedSrc.includes("abs.twimg.com/icons") &&
      !decodedSrc.includes("emoji") &&
      !decodedSrc.includes("data:image") &&
      (decodedSrc.includes("twimg.com") || decodedSrc.includes("media"))
    ) {
      images.push(decodedSrc);
      seenImages.add(decodedSrc);
    }
  }

  return images;
}

// Parse HTML content from oEmbed to extract formatted text
function extractFormattedTextFromHtml(html: string): string {
  // Convert HTML breaks and paragraphs to newlines, preserving formatting
  let text = html
    .replace(/<br\s*\/?>/gi, "\n") // Convert <br> to newline
    .replace(/<\/p>/gi, "\n\n") // Convert </p> to double newline
    .replace(/<p[^>]*>/gi, "") // Remove opening <p> tags
    .replace(/<\/?blockquote[^>]*>/gi, "") // Remove blockquote tags
    .replace(/<\/?strong[^>]*>/gi, "") // Remove <strong> tags but keep text
    .replace(/<\/?b[^>]*>/gi, "") // Remove <b> tags but keep text
    .replace(/<\/?em[^>]*>/gi, "") // Remove <em> tags but keep text
    .replace(/<\/?i[^>]*>/gi, "") // Remove <i> tags but keep text
    .replace(/<img[^>]*>/gi, "") // Remove image tags (we extract them separately)
    .replace(/<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi, "$2") // Extract link text, remove link tags
    .replace(/<\/?a[^>]*>/gi, "") // Remove any remaining link tags
    .replace(/<[^>]*>/g, "") // Remove all other HTML tags
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&mdash;/g, "—") // Convert em dash entity
    .replace(/&#8212;/g, "—") // Convert em dash numeric entity
    .replace(/—/g, "—") // Normalize em dash
    .replace(/&#10;/g, "\n") // Convert HTML newline entities
    .replace(/&#13;/g, "") // Remove carriage returns
    .replace(/\n{3,}/g, "\n\n") // Replace multiple newlines with double
    .replace(/^\n+|\n+$/g, "") // Remove leading/trailing newlines
    .trim();

  // Remove attribution line at the end (e.g., "— Tom Dörr (@tom_doerr) December 12, 2025")
  // Split into lines and filter out attribution patterns
  const lines = text.split("\n");
  const filteredLines = lines.filter((line) => {
    const trimmed = line.trim();
    // Skip empty lines
    if (!trimmed) return true;

    // Check for attribution patterns:
    // 1. Starts with em dash/en dash followed by name and handle
    // 2. Contains handle in parentheses with date
    // 3. Pattern: — Name (@handle) Date
    const hasEmDash = /^[—–-]\s*/.test(trimmed);
    const hasHandle = /\(@\w+\)/.test(trimmed);
    const hasDate = /\b[A-Z][a-z]+\s+\d{1,2},?\s+\d{4}\b/.test(trimmed);

    // If it has em dash AND handle, it's likely attribution
    if (hasEmDash && hasHandle) {
      return false;
    }

    // If it has handle AND date AND looks like attribution format
    if (hasHandle && hasDate && trimmed.length < 100) {
      return false;
    }

    return true;
  });

  text = filteredLines
    .join("\n")
    .replace(/\n\n\n+/g, "\n\n") // Clean up extra newlines
    .trim();

  return text;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "url parameter is required" },
      { status: 400 }
    );
  }

  const tweetId = getTweetId(url);
  if (!tweetId) {
    return NextResponse.json(
      { error: "Invalid tweet URL" },
      { status: 400 }
    );
  }

  try {
    // Use Twitter oEmbed API (public, no auth required)
    const oembedUrl = `https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}&omit_script=true&dnt=true`;

    const response = await fetch(oembedUrl, {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch tweet data" },
        { status: response.status }
      );
    }

    const data = (await response.json()) as {
      author_name: string;
      author_url: string;
      html: string;
      url: string;
      width?: number;
      height?: number;
    };

    // Extract author info from URL
    const authorUrlMatch = data.author_url.match(/(?:twitter\.com|x\.com)\/(\w+)/);
    const username = authorUrlMatch ? authorUrlMatch[1] : "";

    // Extract formatted text content from HTML (preserves line breaks)
    const content = extractFormattedTextFromHtml(data.html);

    // Extract images from HTML
    const images = extractImagesFromHtml(data.html);

    // Log for debugging (remove in production)
    if (images.length > 0) {
      console.log("Found images:", images);
    }

    return NextResponse.json({
      id: tweetId,
      url: data.url,
      author: {
        name: data.author_name,
        username: `@${username}`,
        url: data.author_url,
      },
      content,
      images,
      html: data.html, // Include raw HTML for debugging
    });
  } catch (error) {
    console.error("Error fetching tweet data:", error);
    return NextResponse.json(
      { error: "Failed to fetch tweet data" },
      { status: 500 }
    );
  }
}
