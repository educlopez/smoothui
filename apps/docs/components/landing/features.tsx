"use client";

import { EditorialKicker } from "@docs/components/landing/motion/editorial-kicker";
import { EditorialRail } from "@docs/components/landing/motion/editorial-rail";
import { ScrollFilm } from "@docs/components/landing/motion/scroll-film";

const FOUNDATIONS = [
  {
    body: "Server Components, TypeScript and hooks — built for React 19.",
    index: "01",
    title: "Modern React",
  },
  {
    body: "Utility-first engine with a unified token spine.",
    index: "02",
    title: "Tailwind CSS v4",
  },
  {
    body: "Drops into any shadcn project. Same patterns, one command.",
    index: "03",
    title: "shadcn compatible",
  },
] as const;

export function Features() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <ScrollFilm poster="/scenes/why-choose.webp" src="/films/motion.mp4" />
      <div className="relative z-10 mx-auto grid min-h-[100svh] max-w-7xl items-end gap-12 px-8 py-20 md:grid-cols-12 md:px-12 md:py-24">
        <div className="md:col-span-7">
          <EditorialKicker index="02" label="Foundations" />
          <h2 className="mt-6 max-w-xl font-display text-5xl text-white leading-[0.92] tracking-tight md:text-7xl">
            Motion is
            <br />
            the <em>product.</em>
          </h2>
          <p className="mt-6 max-w-md text-pretty text-base text-white/80 leading-relaxed md:text-lg">
            Every component ships with motion built in — Motion and GSAP, tuned
            for spring physics, fully reduced-motion aware.
          </p>
        </div>
        <EditorialRail
          className="md:col-span-5"
          heading="Stack"
          items={FOUNDATIONS}
        />
      </div>
    </section>
  );
}
