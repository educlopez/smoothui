import { LatestPostsGrid } from "@docs/components/landing/latest-posts-grid";
import { LandingAtmosphere } from "@docs/components/landing/motion/atmosphere";
import { SectionHeader } from "@docs/components/landing/section-header";
import { Button } from "@docs/components/smoothbutton";
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
    <section className="relative bg-background px-8 py-24 transition">
      <LandingAtmosphere />
      <SectionHeader
        chapterIndex="09"
        chapterLabel="Journal"
        description="Tutorials, deep dives and case studies on building beautifully animated React components."
        title="From the blog"
      />

      <LatestPostsGrid posts={withMeta} />

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
