"use client";

import ScrollProgress from "@repo/smoothui/components/scroll-progress";
import { useRef } from "react";

const SECTIONS = [
  {
    body: "A transition is a sentence about cause and effect. The panel did not appear out of nowhere — it came from the button you pressed, and the animation is the only chance the interface gets to say so. Remove it and the user has to infer the relationship; stretch it past 300ms and they start waiting for permission to continue.",
    heading: "Motion is an explanation",
    id: "explanation",
  },
  {
    body: "Duration is not a taste question, it is a frequency question. Something you touch fifty times an hour — a checkbox, a tab, a keystroke — should not animate at all, because speed is the feature. Something you see once a session can afford to tell a story. Everything between those poles lives in the 150 to 300 millisecond band.",
    heading: "Frequency sets the budget",
    id: "frequency",
  },
  {
    body: "Ease-out for anything entering: it arrives fast and settles, the way a real object with mass does. Ease-in-out for anything already on screen that moves to a new place. Ease-in for anything leaving, and almost nothing else, because it starts slowly and slow starts read as lag.",
    heading: "Curves carry weight",
    id: "curves",
  },
  {
    body: "Exits should run at roughly three quarters of their entrance. Nobody is studying the element on the way out — they have already decided, and the animation is now the only thing standing between the decision and the result. Symmetric durations feel polite on paper and sluggish in the hand.",
    heading: "Leave faster than you arrive",
    id: "exits",
  },
  {
    body: "Every animation needs a version that does not animate. Gate it on prefers-reduced-motion, drop the duration to zero rather than swapping in a shorter one, and check that the final state is still legible on its own. If the interface only makes sense while it is moving, the motion is doing work the layout should have done.",
    heading: "The version with no motion",
    id: "reduced",
  },
] as const;

const VariantTag = ({ children }: { children: string }) => (
  <span className="shrink-0 rounded-full border border-foreground/12 px-2 py-0.5 font-medium font-mono text-[10px] text-muted-foreground leading-none">
    {children}
  </span>
);

export default function ScrollProgressDemo() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    // An explicit height, not `h-full`: the docs preview frame sizes itself to
    // its content, so a percentage height here resolves to `auto`, the scroller
    // below grows to fit the whole article, and nothing ever scrolls — which
    // leaves all four indicators frozen at 0%.
    <div className="relative flex h-[460px] w-full flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-background">
      <div className="flex shrink-0 items-center justify-between gap-6 border-foreground/10 border-b px-5 py-3">
        <div className="min-w-0">
          <p className="truncate font-semibold text-foreground text-sm">
            The quiet craft of motion
          </p>
          <p className="text-muted-foreground text-xs">
            Essay &middot; 6 min read
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-5">
          <div className="flex flex-col items-center gap-1">
            <ScrollProgress
              className="text-3xl"
              container={scrollRef}
              position="inline"
              showLabel
              variant="number"
            />
            <VariantTag>number</VariantTag>
          </div>
          <div className="flex flex-col items-center gap-1">
            <ScrollProgress
              container={scrollRef}
              position="inline"
              showLabel
              size={52}
              thickness={5}
              variant="ring"
            />
            <VariantTag>ring</VariantTag>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3 px-5 pt-2.5 pb-2">
        <VariantTag>bar</VariantTag>
        <span className="text-muted-foreground text-xs">
          Full-bleed reading bar, flush to the panel edge
        </span>
      </div>
      {/* Deliberately outside the padded row: a reading bar is anchored to an
          edge, so any inset would read as a rendering fault. */}
      <ScrollProgress
        className="shrink-0"
        container={scrollRef}
        position="inline"
        thickness={4}
        variant="bar"
      />

      {/* Nothing positioned wraps the scroller's content. Motion resolves a
          `target`'s position by walking `offsetParent` up to the scroll
          container, so a `relative` wrapper around the content terminates that
          walk early — harmless here, where the indicators track the container
          itself, but a trap the moment a demo adds a `target`. The fade below is
          a sibling, positioned against the panel root. */}
      <div
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
        ref={scrollRef}
      >
        <article className="flex flex-col gap-6 px-5 pt-2 pb-8">
          <img
            alt="Long-exposure photograph of light trails curving through a city street"
            className="h-44 w-full rounded-xl object-cover"
            src="https://picsum.photos/seed/scroll-progress-hero/1200/500"
          />
          <p className="text-base text-foreground/80 leading-relaxed">
            Animation is the part of an interface that most often gets added
            last and judged first. These are the five rules that survive contact
            with real products.
          </p>
          {SECTIONS.map((section) => (
            <section className="flex flex-col gap-2" key={section.id}>
              <h3 className="font-semibold text-foreground text-lg tracking-tight">
                {section.heading}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {section.body}
              </p>
            </section>
          ))}
          <p className="border-foreground/10 border-t pt-6 text-muted-foreground text-sm leading-relaxed">
            None of this is about making software feel expensive. It is about
            making cause and effect legible, then getting out of the way.
          </p>
        </article>
      </div>

      {/* At rest the panel has to read as scrollable: text cut by a soft edge
          says "there is more" without a label doing it. Sat above the footer bar
          so it fades the article, not the segments row. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-[3.4rem] h-14 bg-gradient-to-t from-background to-transparent"
      />

      <div className="flex shrink-0 items-center justify-between gap-4 border-foreground/10 border-t px-5 py-3">
        <VariantTag>segments</VariantTag>
        <ScrollProgress
          container={scrollRef}
          position="inline"
          segments={12}
          showLabel
          thickness={6}
          variant="segments"
        />
      </div>
    </div>
  );
}
