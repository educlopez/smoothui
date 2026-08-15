"use client";

import { EditorialKicker } from "@docs/components/landing/motion/editorial-kicker";
import { EditorialRail } from "@docs/components/landing/motion/editorial-rail";
import { ScrollFilm } from "@docs/components/landing/motion/scroll-film";
import Link from "next/link";
import { IconArrowRightFill24 } from "nucleo-core-fill-24";

const BEATS = [
  {
    body: "AI assistants discover, search, and install any component.",
    index: "01",
    title: "MCP Server",
  },
  {
    body: "Search, suggest, and source. No auth. OpenAPI included.",
    index: "02",
    title: "REST API",
  },
  {
    body: "Structured catalog for context windows and RAG pipelines.",
    index: "03",
    title: "llms.txt",
  },
] as const;

export function AISection() {
  return (
    <section className="relative min-h-[100svh]">
      <ScrollFilm poster="/scenes/ai-mcp.webp" src="/films/agents.mp4" />
      <div className="relative z-10 mx-auto grid min-h-[100svh] max-w-7xl items-end gap-12 px-8 py-20 md:grid-cols-12 md:px-12 md:py-24">
        <div className="md:col-span-7">
          <EditorialKicker index="04" label="Agents" />
          <h2 className="mt-6 max-w-2xl font-display text-5xl text-white leading-[0.92] tracking-tight md:text-7xl">
            Built for
            <br />
            <em>AI-assisted</em>
            <br />
            development.
          </h2>
          <p className="mt-6 max-w-md text-pretty text-base text-white/80 leading-relaxed md:text-lg">
            The first component library designed for agents. Discover, search,
            and install programmatically.
          </p>
          <Link
            className="mt-8 inline-flex items-center gap-1.5 font-meta text-[11px] text-white/75 uppercase tracking-[0.18em] transition-colors hover:text-white"
            href="/docs/guides/ai-integration"
          >
            Learn more about AI integration
            <IconArrowRightFill24 size={12} />
          </Link>
        </div>
        <EditorialRail
          className="md:col-span-5"
          heading="Surfaces"
          items={BEATS}
        />
      </div>
    </section>
  );
}
