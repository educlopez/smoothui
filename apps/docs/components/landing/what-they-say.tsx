"use client";

import { EditorialKicker } from "@docs/components/landing/motion/editorial-kicker";
import { ScrollFilm } from "@docs/components/landing/motion/scroll-film";
import { cn } from "@repo/shadcn-ui/lib/utils";
import {
  IconChevronLeftFill24,
  IconChevronRightFill24,
} from "nucleo-core-fill-24";
import { useState } from "react";

interface Testimonial {
  handle: string;
  id: string;
  name: string;
  quote: string;
  tweetUrl: string;
}

const VOICES: Testimonial[] = [
  {
    handle: "@orcdev",
    id: "orcdev",
    name: "OrcDev",
    quote:
      "Love your project Edu! Keep it up — can't wait to see what you cook next.",
    tweetUrl: "https://x.com/orcdev/status/2007091382784303330",
  },
  {
    handle: "@jaykosai",
    id: "jaykosai",
    name: "jeth.eth",
    quote: "All I can say is 🙌 — planning to build something crazy with it.",
    tweetUrl: "https://x.com/jaykosai/status/1919079453017231481",
  },
  {
    handle: "@Lucas_Moveset",
    id: "lucas",
    name: "Lucas",
    quote:
      "UI libraries like SmoothUI simplify your workflow and boost your design aesthetic.",
    tweetUrl: "https://x.com/Lucas_Moveset/status/1990155654019887348",
  },
  {
    handle: "@Potato___Dragon",
    id: "potato",
    name: "Potato Dragon",
    quote:
      "I really liked the buttons on SmoothUI — that clickable kind of animation.",
    tweetUrl: "https://x.com/Potato___Dragon/status/1980544421121970512",
  },
  {
    handle: "@openhunts",
    id: "openhunts",
    name: "openhunts",
    quote: "I love this UI component from @educalvolpz.",
    tweetUrl: "https://x.com/openhunts/status/1980911462030950489",
  },
  {
    handle: "@PeteCapeCod",
    id: "pete",
    name: "Peter Cruckshank",
    quote: "Checked out SmoothUI — some great stuff. Great job.",
    tweetUrl: "https://x.com/PeteCapeCod/status/1962707094395556337",
  },
];

export function WhatTheySay() {
  const [page, setPage] = useState(0);
  const active = VOICES[page];

  const goTo = (delta: number) =>
    setPage((current) => (current + delta + VOICES.length) % VOICES.length);

  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <ScrollFilm poster="/scenes/testimonial-1.jpg" src="/films/voices.mp4" />
      <div className="relative z-10 mx-auto grid min-h-[100svh] max-w-7xl items-end gap-12 px-8 py-20 md:grid-cols-12 md:px-12 md:py-24">
        <div className="md:col-span-8">
          <EditorialKicker index="06" label="Voices" />
          <blockquote className="mt-6 max-w-3xl font-display text-4xl text-white leading-[1.05] tracking-tight md:text-6xl">
            {active.quote}
          </blockquote>
          <a
            className="mt-8 inline-block font-meta text-[11px] text-white/70 uppercase tracking-[0.18em] transition-colors hover:text-white"
            href={active.tweetUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            {active.name}
            <span className="mx-2 text-white/30">/</span>
            {active.handle}
          </a>
          <div className="mt-8 flex items-center gap-2">
            <button
              aria-label="Previous testimonial"
              className="flex size-10 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/10"
              onClick={() => goTo(-1)}
              type="button"
            >
              <IconChevronLeftFill24 className="size-4" />
            </button>
            <button
              aria-label="Next testimonial"
              className="flex size-10 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/10"
              onClick={() => goTo(1)}
              type="button"
            >
              <IconChevronRightFill24 className="size-4" />
            </button>
          </div>
        </div>
        <aside className="border-white/20 border-t pt-8 md:col-span-4 md:border-t-0 md:border-l md:pt-0 md:pl-10">
          <p className="font-meta text-[10px] text-white/50 uppercase tracking-[0.2em]">
            Index
          </p>
          <ol className="mt-6 space-y-4">
            {VOICES.map((voice, index) => {
              const isActive = index === page;
              return (
                <li key={voice.id}>
                  <button
                    className={cn(
                      "flex w-full cursor-pointer items-baseline gap-3 text-left font-meta text-[11px] uppercase tracking-[0.16em] transition-colors",
                      isActive
                        ? "text-white"
                        : "text-white/45 hover:text-white/80"
                    )}
                    onClick={() => setPage(index)}
                    type="button"
                  >
                    <span className="tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{voice.name}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </aside>
      </div>
    </section>
  );
}
