"use client";

import { EditorialKicker } from "@docs/components/landing/motion/editorial-kicker";
import { ScrollFilm } from "@docs/components/landing/motion/scroll-film";
import { UiCraftInstallSelector } from "@docs/components/landing/ui-craft-install-selector";
import Link from "next/link";
import { IconArrowUpRightFill24 } from "nucleo-core-fill-24";

export function SkillsSection() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <ScrollFilm poster="/scenes/skill-meadow.webp" src="/films/craft.mp4" />
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-8 py-20 md:px-12 md:py-24">
        <EditorialKicker index="05" label="Craft" />
        <h2 className="mt-6 max-w-3xl font-display text-5xl text-white leading-[0.92] tracking-tight md:text-7xl">
          The system behind
          <br />
          <em>design taste.</em>
        </h2>
        <p className="mt-6 max-w-lg text-pretty text-base text-white/80 leading-relaxed md:text-lg">
          Anti-slop detection, a scored quality gate, and a convergence loop —
          so your agent ships UI you&apos;d actually put in production.
        </p>
        <div className="mt-8">
          <UiCraftInstallSelector className="items-start" />
        </div>
        <Link
          className="mt-6 flex w-fit items-center gap-1.5 font-meta text-[11px] text-white/70 uppercase tracking-[0.18em] transition-colors hover:text-white"
          href="https://skills.smoothui.dev"
          rel="noopener noreferrer"
          target="_blank"
        >
          Explore UI Craft
          <IconArrowUpRightFill24 size={12} />
        </Link>
      </div>
    </section>
  );
}
