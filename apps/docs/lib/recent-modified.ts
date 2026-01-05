/**
 * Utility functions for determining recent modifications
 */

/**
 * Determines if a page was recently modified
 * @param lastModified - Timestamp in milliseconds
 * @param daysThreshold - Number of days to consider "recent" (default: 7)
 * @returns boolean indicating if the page is recently modified
 */
export function isRecentlyModified(
  lastModified: number | undefined,
  daysThreshold = 7
): boolean {
  if (!lastModified) return false;

  const now = Date.now();
  const diffInDays = (now - lastModified) / (1000 * 60 * 60 * 24);

  return diffInDays <= daysThreshold;
}

/**
 * Gets a human-readable label for when the page was modified
 */
export function getModificationLabel(lastModified: number): string {
  const now = Date.now();
  const diffInHours = (now - lastModified) / (1000 * 60 * 60);
  const diffInDays = diffInHours / 24;

  if (diffInHours < 24) {
    return "Updated today";
  }
  if (diffInDays < 7) {
    const days = Math.floor(diffInDays);
    return `Updated ${days} day${days !== 1 ? "s" : ""} ago`;
  }
  if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `Updated ${weeks} week${weeks !== 1 ? "s" : ""} ago`;
  }

  return "";
}
