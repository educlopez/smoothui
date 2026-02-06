import { createMetadata } from "@docs/lib/metadata";
import { blogSource, formatDate, getReadingTime } from "@docs/lib/source";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = createMetadata({
  title: "Blog",
  description:
    "Tutorials, tips, and case studies about building beautiful animated React components with SmoothUI.",
  openGraph: {
    url: "/blog",
  },
});

export default async function BlogPage() {
  const posts = blogSource.getPages().sort((a, b) => {
    const dateA = new Date(a.data.date as string);
    const dateB = new Date(b.data.date as string);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <main className="container max-w-4xl py-12">
      <div className="mb-12">
        <h1 className="mb-4 font-bold text-4xl">Blog</h1>
        <p className="text-foreground/70 text-lg">
          Tutorials, tips, and case studies about building beautiful animated
          React components.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {posts.map(async (post) => {
          const content = await post.data.getText("processed");
          const readingTime = getReadingTime(content);

          return (
            <Link
              className="group block rounded-lg border border-border/50 p-4 transition-all hover:border-brand/50 hover:shadow-sm"
              href={post.url}
              key={post.url}
            >
              <div className="mb-1 flex items-center gap-2 text-foreground/60 text-sm">
                <time dateTime={post.data.date as string}>
                  {formatDate(post.data.date as string)}
                </time>
                <span>·</span>
                <span>{readingTime} min read</span>
              </div>
              <h2 className="mb-1 font-semibold text-lg transition-colors group-hover:text-brand">
                {post.data.title}
              </h2>
              <p className="text-foreground/70 text-sm">
                {post.data.description}
              </p>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
