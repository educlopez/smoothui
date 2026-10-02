import { loader } from "fumadocs-core/source";
import { blog } from "@/.source/server";

// Kept apart from `lib/source.ts` on purpose: the docs collection is large and
// pulls in the MDX runtime compiler, and the home page and blog routes only
// need the blog posts.
export const blogSource = loader({
  baseUrl: "/blog",
  source: blog.toFumadocsSource(),
});

const WHITESPACE_REGEX = /\s+/;

export function getReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(WHITESPACE_REGEX).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return Math.max(1, minutes);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
