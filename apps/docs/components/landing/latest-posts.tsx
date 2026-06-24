import Divider from "@docs/components/landing/divider";
import { SectionHeader } from "@docs/components/landing/section-header";
import { PostCover } from "@docs/components/post-cover";
import { Button } from "@docs/components/smoothbutton";
import { blogSource, formatDate, getReadingTime } from "@docs/lib/source";
import Link from "next/link";
import { IconChevronRightFill24 } from "nucleo-core-fill-24";

export async function LatestPosts() {
  const posts = blogSource
    .getPages()
    .sort(
      (a, b) =>
        new Date(b.data.date as string).getTime() -
        new Date(a.data.date as string).getTime()
    )
    .slice(0, 3);

  if (posts.length === 0) {
    return null;
  }

  const withMeta = await Promise.all(
    posts.map(async (post) => ({
      post,
      readingTime: getReadingTime(await post.data.getText("processed")),
    }))
  );

  return (
    <section className="relative bg-background px-8 py-24 transition">
      <Divider />
      <SectionHeader
        description="Tutorials, deep dives and case studies on building beautifully animated React components."
        title="From the blog"
      />

      <div className="mx-auto mt-16 grid max-w-6xl gap-4 md:grid-cols-3">
        {withMeta.map(({ post, readingTime }) => (
          <article className="group relative" key={post.url}>
            <Link
              className="flex h-full flex-col overflow-hidden rounded-2xl border bg-primary/40 transition-colors hover:bg-primary"
              href={post.url}
            >
              <PostCover
                alt={post.data.title}
                className="aspect-video border-border border-b"
                image={post.data.image as string | undefined}
                seed={post.url}
              />
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <time dateTime={post.data.date as string}>
                    {formatDate(post.data.date as string)}
                  </time>
                  <span aria-hidden="true">·</span>
                  <span>{readingTime} min read</span>
                </div>
                <h3 className="mt-3 font-semibold text-foreground tracking-tight transition-colors group-hover:text-brand">
                  {post.data.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-muted-foreground text-sm leading-relaxed">
                  {post.data.description}
                </p>
                <span className="mt-auto flex items-center gap-1 pt-6 font-medium text-brand text-sm">
                  Read
                  <IconChevronRightFill24
                    aria-hidden="true"
                    className="size-3.5 translate-y-px transition-transform group-hover:translate-x-0.5"
                  />
                </span>
              </div>
            </Link>
          </article>
        ))}
      </div>

      <div className="mx-auto mt-8 flex justify-center">
        <Button asChild size="lg" variant="candy">
          <Link href="/blog">
            <span className="flex items-center gap-1">
              <span>View all posts</span>
            </span>
            <svg
              aria-hidden="true"
              className="-mx-1.5 size-5 shrink-0 text-white/72"
              fill="none"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.333 13.333 11.667 10 8.333 6.667"
                stroke="currentColor"
                strokeLinecap="square"
                strokeWidth="1.25"
              />
            </svg>
          </Link>
        </Button>
      </div>
    </section>
  );
}
