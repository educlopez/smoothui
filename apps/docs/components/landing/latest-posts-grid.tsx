"use client";

import { ClipRevealGroup } from "@docs/components/landing/motion/clip-reveal";
import { PointerLean } from "@docs/components/landing/motion/pointer-lean";
import { PostCover } from "@docs/components/post-cover";
import { formatDate } from "@docs/lib/source";
import Link from "next/link";
import { IconChevronRightFill24 } from "nucleo-core-fill-24";

export interface LatestPostCard {
  date: string;
  description: string;
  image?: string;
  readingTime: number;
  title: string;
  url: string;
}

export function LatestPostsGrid({ posts }: { posts: LatestPostCard[] }) {
  return (
    <ClipRevealGroup className="mx-auto mt-16 grid max-w-6xl gap-4 md:grid-cols-3">
      {posts.map((post) => (
        <article className="group relative" data-reveal key={post.url}>
          <PointerLean className="h-full">
            <Link
              className="landing-paper flex h-full flex-col overflow-hidden rounded-2xl border bg-primary/40 transition-colors hover:bg-primary"
              href={post.url}
            >
              <PostCover
                alt={post.title}
                className="aspect-video border-border border-b"
                image={post.image}
                seed={post.url}
              />
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  <span aria-hidden="true">·</span>
                  <span>{post.readingTime} min read</span>
                </div>
                <h3 className="mt-3 font-semibold text-foreground tracking-tight transition-colors group-hover:text-brand">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-muted-foreground text-sm leading-relaxed">
                  {post.description}
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
          </PointerLean>
        </article>
      ))}
    </ClipRevealGroup>
  );
}
