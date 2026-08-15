"use client";

import Divider from "@docs/components/landing/divider";
import { LandingAtmosphere } from "@docs/components/landing/motion/atmosphere";
import { ChapterEyebrow } from "@docs/components/landing/motion/chapter-eyebrow";
import { ClipRevealGroup } from "@docs/components/landing/motion/clip-reveal";
import { WordReveal } from "@docs/components/landing/motion/word-reveal";

const COVERAGE: { label: string; url: string }[] = [
  {
    label: "Peerlist",
    url: "https://peerlist.io/saxenashikhil/articles/smoothui-a-beautiful-motiondriven-ui-library-for-react-devel",
  },
  {
    label: "DEV.to",
    url: "https://dev.to/jqueryscript/smoothui-40-animated-react-components-with-motion-8e5",
  },
  { label: "Tailkits", url: "https://tailkits.com/components/smoothui/" },
  { label: "All Shadcn", url: "https://allshadcn.com/blocks/smoothui/" },
  {
    label: "Tailwind Resources",
    url: "https://www.tailwindresources.com/theme/educlopez-smoothui/",
  },
  {
    label: "Shadcn Templates",
    url: "https://shadcntemplates.com/theme/educlopez-smoothui",
  },
  {
    label: "Built At Lightspeed",
    url: "https://www.builtatlightspeed.com/theme/educlopez-smoothui",
  },
];

export function Coverage() {
  return (
    <section className="relative bg-background px-8 py-20 transition">
      <LandingAtmosphere />
      <Divider />
      <div className="relative mx-auto max-w-3xl text-center">
        <ChapterEyebrow index="07" label="Coverage" />
        <h2 className="font-medium text-[11px] text-muted-foreground uppercase tracking-[0.18em]">
          Featured across the community
        </h2>

        <blockquote className="mt-5 text-balance font-semibold font-title text-foreground text-xl tracking-tight md:text-2xl">
          <span aria-hidden>&ldquo;</span>
          <WordReveal text="SmoothUI is a game-changer for frontend developers looking for polished UI components with motion-powered interactivity." />
          <span aria-hidden>&rdquo;</span>
        </blockquote>

        <a
          className="mt-3 inline-block text-muted-foreground text-sm transition-colors hover:text-brand"
          href={COVERAGE[0].url}
          rel="noopener noreferrer"
          target="_blank"
        >
          — Shikhil Saxena, Peerlist
        </a>

        <ClipRevealGroup
          className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
          stagger={0.04}
        >
          {COVERAGE.map((item) => (
            <a
              className="font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
              data-reveal
              href={item.url}
              key={item.label}
              rel="noopener noreferrer"
              target="_blank"
            >
              {item.label}
            </a>
          ))}
        </ClipRevealGroup>
      </div>
    </section>
  );
}
