"use client";

import { formatDate } from "@docs/lib/source";
import Link from "next/link";

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
    <ol className="border-border border-t">
      {posts.map((post, index) => (
        <li className="border-border border-b" key={post.url}>
          <Link className="group block py-7" href={post.url}>
            <p className="font-meta text-[11px] text-muted-foreground uppercase tracking-[0.18em]">
              {String(index + 1).padStart(2, "0")}
              <span className="mx-2 text-border">/</span>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span className="mx-2 text-border">/</span>
              {post.readingTime} min
            </p>
            <h3 className="mt-3 font-display text-3xl text-foreground leading-[1.05] tracking-tight transition-colors group-hover:text-brand md:text-4xl">
              {post.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-foreground/65 text-sm leading-relaxed">
              {post.description}
            </p>
          </Link>
        </li>
      ))}
    </ol>
  );
}
