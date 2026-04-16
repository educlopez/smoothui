import { createMetadata } from "@docs/lib/metadata";
import { blogSource, formatDate, getReadingTime } from "@docs/lib/source";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = createMetadata({
  title: "Blog",
  description:
    "Tutorials, tips, and case studies on building beautiful animated React components with SmoothUI and Tailwind CSS.",
  openGraph: {
    url: "/blog",
  },
});

const AUTHOR_AVATAR =
  "https://ik.imagekit.io/16u211libb/avatar-educalvolpz.jpeg?updatedAt=1765524159631&tr=w-48,h-48,q-85,f-auto";

function AuthorBadge({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="size-6 overflow-hidden rounded-md border border-transparent bg-card shadow-black/15 shadow-md ring-1 ring-border">
        <img
          alt={name}
          className="size-full object-cover"
          height={24}
          src={AUTHOR_AVATAR}
          width={24}
        />
      </div>
      <span className="line-clamp-1 text-muted-foreground text-sm">{name}</span>
    </div>
  );
}

function ReadLink({ title }: { title: string }) {
  return (
    <span
      aria-label={`Read ${title}`}
      className="flex items-center gap-1 font-medium text-brand text-sm transition-colors duration-200 group-hover:text-foreground"
    >
      Read
      <ChevronRight
        aria-hidden="true"
        className="size-3.5 translate-y-px transition-transform duration-200 group-hover:translate-x-0.5"
        strokeWidth={2.5}
      />
    </span>
  );
}

/** Abstract decorative illustration for the featured post. Mesh gradient, CSS-only. */
function FeaturedIllustration() {
  return (
    <div
      aria-hidden="true"
      className="relative aspect-video overflow-hidden rounded-[10px] border border-transparent shadow-black/10 shadow-md ring-1 ring-border"
      style={{
        background: [
          "radial-gradient(ellipse 80% 60% at 20% 30%, var(--color-brand) 0%, transparent 60%)",
          "radial-gradient(ellipse 60% 80% at 75% 70%, var(--color-brand-secondary) 0%, transparent 55%)",
          "radial-gradient(ellipse 50% 50% at 55% 20%, var(--color-brand-light) 0%, transparent 50%)",
          "radial-gradient(ellipse 40% 60% at 40% 80%, var(--color-brand-lighter) 0%, transparent 50%)",
          "linear-gradient(135deg, var(--color-brand-secondary) 0%, var(--color-brand-light) 100%)",
        ].join(", "),
      }}
    >
      <div
        className="absolute inset-0 opacity-40 mix-blend-soft-light"
        style={{
          backgroundImage:
            "radial-gradient(circle at 70% 25%, white 0%, transparent 40%)",
        }}
      />
    </div>
  );
}

export default async function BlogPage() {
  const posts = blogSource.getPages().sort((a, b) => {
    const dateA = new Date(a.data.date as string);
    const dateB = new Date(b.data.date as string);
    return dateB.getTime() - dateA.getTime();
  });

  const [featured, ...rest] = posts;

  if (!featured) {
    return null;
  }

  const featuredContent = await featured.data.getText("processed");
  const featuredReadingTime = getReadingTime(featuredContent);

  return (
    <main className="bg-background">
      <div className="mx-auto max-w-5xl px-6 pt-12 pb-24 lg:pt-16">
        {/* Header */}
        <div className="mb-12 max-w-xl">
          <h1 className="text-balance font-semibold text-4xl text-foreground sm:text-5xl lg:tracking-tight">
            Blog
          </h1>
          <p className="mt-3 text-muted-foreground">
            Tutorials, deep dives, and case studies on building beautiful
            animated React components.
          </p>
        </div>

        {/* All posts in one container — dark bg peeks through card corners */}
        <div className="overflow-hidden rounded-2xl border border-border">
          {/* Featured post */}
          <article className="group relative grid divide-x divide-border md:grid-cols-2">
            <div className="bg-card p-6 lg:p-10">
              <FeaturedIllustration />
            </div>
            <div>
              <Link
                className="flex h-full flex-col gap-4 bg-card p-6 lg:p-10"
                href={featured.url}
              >
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <time dateTime={featured.data.date as string}>
                    {formatDate(featured.data.date as string)}
                  </time>
                  <span aria-hidden="true">·</span>
                  <span>{featuredReadingTime} min read</span>
                </div>
                <h2 className="text-balance font-semibold text-foreground text-lg transition-colors group-hover:text-brand md:text-xl">
                  {featured.data.title}
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {featured.data.description}
                </p>
                <div className="mt-auto flex items-end justify-between gap-2 pt-4">
                  {featured.data.author && (
                    <AuthorBadge name={featured.data.author as string} />
                  )}
                  <ReadLink title={featured.data.title} />
                </div>
              </Link>
            </div>
          </article>

          {/* Posts grid */}
          {rest.length > 0 && (
            <div className="grid divide-x divide-y divide-border border-border border-t sm:grid-cols-2 lg:grid-cols-3">
              {rest.map(async (post) => {
                const content = await post.data.getText("processed");
                const readingTime = getReadingTime(content);

                return (
                  <article className="group relative" key={post.url}>
                    <Link
                      className="flex h-full flex-col bg-card p-6 transition-colors duration-200 hover:bg-card/80 lg:p-10"
                      href={post.url}
                    >
                      <div className="flex flex-1 flex-col gap-3">
                        <time
                          className="text-muted-foreground text-sm"
                          dateTime={post.data.date as string}
                        >
                          {formatDate(post.data.date as string)}
                        </time>
                        <h2 className="font-semibold text-foreground transition-colors group-hover:text-brand">
                          {post.data.title}
                        </h2>
                        <p className="text-muted-foreground text-sm">
                          {post.data.description}
                        </p>
                      </div>
                      <div className="mt-auto flex items-end justify-between gap-2 pt-6">
                        {post.data.author && (
                          <AuthorBadge name={post.data.author as string} />
                        )}
                        <ReadLink title={post.data.title} />
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
