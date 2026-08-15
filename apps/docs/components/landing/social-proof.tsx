"use client";

import { GithubStars } from "@docs/components/landing/navbar/github-stars";
import Image from "next/image";

const FACES = [
  "orcdev",
  "jaykosai",
  "Lucas_Moveset",
  "Potato___Dragon",
  "openhunts",
  "PeteCapeCod",
];

export function SocialProof() {
  return (
    <section className="border-border border-y bg-background px-8 py-5">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <p className="font-meta text-[11px] text-muted-foreground uppercase tracking-[0.2em]">
          Community
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {FACES.map((handle) => (
                <Image
                  alt=""
                  aria-hidden
                  className="size-7 rounded-full border-2 border-background object-cover"
                  draggable={false}
                  height={28}
                  key={handle}
                  src={`https://unavatar.io/x/${handle}`}
                  unoptimized
                  width={28}
                />
              ))}
            </div>
            <span className="text-muted-foreground text-sm">
              Loved by developers building with shadcn/ui
            </span>
          </div>
          <span aria-hidden className="hidden h-4 w-px bg-border sm:block" />
          <GithubStars />
        </div>
      </div>
    </section>
  );
}
