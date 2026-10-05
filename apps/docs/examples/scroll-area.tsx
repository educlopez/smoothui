"use client";

import ScrollArea from "@repo/smoothui/components/scroll-area";

const TAGS = [
  "React",
  "Motion",
  "Tailwind",
  "TypeScript",
  "Next.js",
  "Base UI",
  "Radix",
  "Vite",
  "Vitest",
  "Biome",
  "Fumadocs",
  "Turborepo",
];

const FeaturesDemo = () => (
  <div className="flex items-center justify-center p-8">
    <ScrollArea
      className="h-48 w-56 rounded-xl border border-border bg-background/40"
      horizontal={false}
      scrollFade
    >
      <div className="space-y-2 p-4">
        {TAGS.map((tag) => (
          <div
            className="rounded-lg bg-foreground/5 px-3 py-2 font-medium text-sm"
            key={tag}
          >
            {tag}
          </div>
        ))}
      </div>
    </ScrollArea>
  </div>
);

const HorizontalDemo = () => (
  <div className="flex w-full items-center justify-center p-8">
    <ScrollArea
      className="w-full max-w-md whitespace-nowrap rounded-xl border border-border"
      scrollFade="x"
      vertical={false}
    >
      <div className="flex w-max gap-3 p-4">
        {TAGS.map((tag) => (
          <div
            className="flex h-24 w-32 shrink-0 items-center justify-center rounded-lg bg-foreground/5 font-medium text-sm"
            key={tag}
          >
            {tag}
          </div>
        ))}
      </div>
    </ScrollArea>
  </div>
);

export const demoScenes = {
  Features: FeaturesDemo,
  Horizontal: HorizontalDemo,
};

export default function ScrollAreaDemo() {
  return <FeaturesDemo />;
}
