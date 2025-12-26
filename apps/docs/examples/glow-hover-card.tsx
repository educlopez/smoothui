"use client";

import type { GlowHoverItem } from "@repo/smoothui/components/glow-hover-card";
import GlowHover from "@repo/smoothui/components/glow-hover-card";

export default function GlowHoverCardDemo() {
  const items: GlowHoverItem[] = [
    {
      id: "design",
      // No theme - will use brand color
      element: (
        <div className="grid min-w-[200px] max-w-[280px] flex-1 grid-rows-[auto_auto_1fr] items-start gap-4 rounded-2xl border border-foreground/20 bg-background p-5 text-foreground">
          <div>
            <h2 className="mb-2 font-semibold text-sm">Design System</h2>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Build beautiful interfaces with our comprehensive design system
            </p>
          </div>
          <ul className="space-y-1.5 text-xs leading-relaxed">
            <li className="flex items-start gap-1.5">
              <span className="mt-0.5 shrink-0">✓</span>
              <span>Component library</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="mt-0.5 shrink-0">✓</span>
              <span>Color palette</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="mt-0.5 shrink-0">✓</span>
              <span>Typography scale</span>
            </li>
          </ul>
          <div className="mt-4 self-end">
            <div className="rounded-lg bg-brand px-4 py-2 text-center font-semibold text-sm text-white">
              Explore
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "components",
      // No theme - will use brand color
      element: (
        <div className="grid min-w-[200px] max-w-[280px] flex-1 grid-rows-[auto_auto_1fr] items-start gap-4 rounded-2xl border border-foreground/20 bg-background p-5 text-foreground">
          <div>
            <h2 className="mb-2 font-semibold text-sm">Components</h2>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Pre-built components ready to use in your next project
            </p>
          </div>
          <ul className="space-y-1.5 text-xs leading-relaxed">
            <li className="flex items-start gap-1.5">
              <span className="mt-0.5 shrink-0">✓</span>
              <span>40+ components</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="mt-0.5 shrink-0">✓</span>
              <span>Fully customizable</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="mt-0.5 shrink-0">✓</span>
              <span>TypeScript support</span>
            </li>
          </ul>
          <div className="mt-4 self-end">
            <div className="rounded-lg bg-brand px-4 py-2 text-center font-semibold text-sm text-white">
              View All
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "animations",
      // No theme - will use brand color
      element: (
        <div className="grid min-w-[200px] max-w-[280px] flex-1 grid-rows-[auto_auto_1fr] items-start gap-4 rounded-2xl border border-foreground/20 bg-background p-5 text-foreground">
          <div>
            <h2 className="mb-2 font-semibold text-sm">Animations</h2>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Smooth, performant animations powered by Framer Motion
            </p>
          </div>
          <ul className="space-y-1.5 text-xs leading-relaxed">
            <li className="flex items-start gap-1.5">
              <span className="mt-0.5 shrink-0">✓</span>
              <span>GPU accelerated</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="mt-0.5 shrink-0">✓</span>
              <span>Accessible</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="mt-0.5 shrink-0">✓</span>
              <span>Spring physics</span>
            </li>
          </ul>
          <div className="mt-4 self-end">
            <div className="rounded-lg bg-brand px-4 py-2 text-center font-semibold text-sm text-white">
              Learn More
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <GlowHover
        className="flex flex-wrap gap-6 md:gap-8 lg:gap-10"
        items={items}
      />
    </div>
  );
}
