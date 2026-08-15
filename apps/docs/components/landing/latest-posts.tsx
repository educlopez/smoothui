import { LatestPostsGrid } from "@docs/components/landing/latest-posts-grid";
import { EditorialKicker } from "@docs/components/landing/motion/editorial-kicker";
import { blogSource, getReadingTime } from "@docs/lib/source";
import Link from "next/link";

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
      date: post.data.date as string,
      description: post.data.description ?? "",
      image: post.data.image as string | undefined,
      readingTime: getReadingTime(await post.data.getText("processed")),
      title: post.data.title,
      url: post.url,
    }))
  );

  return (
    <section className="relative bg-background px-8 py-28 md:py-36">
      <div className="mx-auto grid max-w-7xl gap-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <EditorialKicker
            className="text-muted-foreground"
            index="09"
            label="Journal"
          />
          <h2 className="mt-6 font-display text-5xl text-foreground leading-[0.92] tracking-tight md:text-7xl">
            From the
            <br />
            <em>blog.</em>
          </h2>
          <p className="mt-5 max-w-sm text-pretty text-foreground/70 leading-relaxed">
            Tutorials, deep dives and case studies on building beautifully
            animated React components.
          </p>
          <Link
            className="mt-8 inline-flex font-meta text-[11px] text-muted-foreground uppercase tracking-[0.18em] transition-colors hover:text-foreground"
            href="/blog"
          >
            View all posts
          </Link>
        </div>
        <div className="md:col-span-7">
          <LatestPostsGrid posts={withMeta} />
        </div>
      </div>
    </section>
  );
}
