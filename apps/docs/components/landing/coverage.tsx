"use client";

import { EditorialKicker } from "@docs/components/landing/motion/editorial-kicker";

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
    <section className="relative bg-background px-8 py-28 md:py-36">
      <div className="mx-auto max-w-4xl">
        <EditorialKicker
          className="text-muted-foreground"
          index="07"
          label="Coverage"
        />
        <blockquote className="mt-8 font-display text-4xl text-foreground leading-[1.1] tracking-tight md:text-6xl">
          SmoothUI is a game-changer for frontend developers looking for
          polished UI components with motion-powered interactivity.
        </blockquote>
        <a
          className="mt-8 inline-block font-meta text-[11px] text-muted-foreground uppercase tracking-[0.18em] transition-colors hover:text-foreground"
          href={COVERAGE[0].url}
          rel="noopener noreferrer"
          target="_blank"
        >
          Shikhil Saxena
          <span className="mx-2 text-border">/</span>
          Peerlist
        </a>
        <div className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-3 border-border border-t pt-8">
          {COVERAGE.map((item) => (
            <a
              className="font-meta text-[11px] text-muted-foreground uppercase tracking-[0.16em] transition-colors hover:text-foreground"
              href={item.url}
              key={item.label}
              rel="noopener noreferrer"
              target="_blank"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
