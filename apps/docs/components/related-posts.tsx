import { blogSource, formatDate } from "@docs/lib/source";
import Link from "next/link";

interface RelatedPostsProps {
  currentSlug: string;
  limit?: number;
}

export function RelatedPosts({ currentSlug, limit = 3 }: RelatedPostsProps) {
  const allPosts = blogSource
    .getPages()
    .filter((post) => post.slugs[0] !== currentSlug)
    .sort((a, b) => {
      const dateA = new Date(a.data.date as string);
      const dateB = new Date(b.data.date as string);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, limit);

  if (allPosts.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 border-t pt-8">
      <h2 className="mb-6 font-semibold text-xl">More Posts</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {allPosts.map((post) => (
          <Link
            className="group rounded-lg border border-border/50 p-4 transition-colors hover:border-border hover:bg-accent/50"
            href={post.url}
            key={post.url}
          >
            <time
              className="text-foreground/60 text-xs"
              dateTime={post.data.date as string}
            >
              {formatDate(post.data.date as string)}
            </time>
            <h3 className="mt-1 font-medium text-sm group-hover:text-primary">
              {post.data.title}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
