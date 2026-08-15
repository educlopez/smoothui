"use client";

import type { ScrollImageRevealMask } from "@repo/smoothui/components/scroll-image-reveal";
import ScrollImageReveal from "@repo/smoothui/components/scroll-image-reveal";
import { sceneById } from "@smoothui/data/scenes";
import { ArrowDown } from "lucide-react";
import type { ComponentProps } from "react";
import { useRef } from "react";

type Frame = {
  alt: string;
  caption: string;
  direction?: ComponentProps<typeof ScrollImageReveal>["direction"];
  id: string;
  mask: ScrollImageRevealMask;
  scene: string;
  parallax?: number;
  title: string;
};

const FRAMES: Frame[] = [
  {
    alt: "A mountainside catching low golden light",
    caption:
      "A single edge travels across the frame. The most literal reveal there is, and the one that survives being used twice on the same page.",
    id: "wipe",
    mask: "wipe",
    scene: "golden-ridge",
    title: "Wipe",
  },
  {
    alt: "A wildflower meadow under towering cumulus",
    caption:
      "The mask opens from the top edge downward, so the image reads as arriving rather than uncovering. Best where the subject sits low in the crop.",
    direction: "down",
    id: "curtain",
    mask: "curtain",
    scene: "cloud-meadow",
    title: "Curtain",
  },
  {
    alt: "A watercolour grove fading into white",
    caption:
      "An expanding circle puts the centre of the frame first. It rewards a photograph with a real subject and punishes one without.",
    id: "circle",
    mask: "circle",
    scene: "watercolor-grove",
    title: "Circle",
  },
  {
    alt: "Blue mountain ridges receding into night",
    caption:
      "Forty-pixel bands widen in parallel. Mechanical, deliberate, and the only mask here that reads as an instrument rather than a curtain.",
    id: "blinds",
    mask: "blinds",
    scene: "blue-ridge-night",
    title: "Blinds",
  },
  {
    alt: "A single pale dune crest in deep shadow",
    caption:
      "Scale and opacity together, settling from a slight overscan down to its natural size. No hard edge anywhere — the quietest of the five.",
    id: "scale",
    mask: "scale",
    parallax: 40,
    scene: "dune-shadow",
    title: "Scale",
  },
];

export default function ScrollImageRevealDemo() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    // An explicit height, not `h-full`: the docs preview frame sizes itself to
    // its content, so a percentage height here resolves to `auto`, the scroller
    // grows to fit all five figures at once, and no mask ever animates.
    <div className="relative flex h-[520px] w-full flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-background">
      <div className="flex shrink-0 items-center justify-between gap-4 border-foreground/10 border-b px-6 py-3">
        <p className="font-semibold text-foreground text-sm">Five masks</p>
        <p className="inline-flex items-center gap-1.5 text-muted-foreground text-xs">
          <ArrowDown aria-hidden="true" className="size-3.5" />
          Scroll the panel
        </p>
      </div>

      {/* The scroller is a direct child and nothing positioned sits between it
          and the frames inside. Motion resolves a `target`'s position by walking
          `offsetParent` up to the scroll container, so wrapping the content in a
          `relative` div — for a fade overlay, say — terminates that walk early
          and every frame reports zero progress no matter where it actually is.
          The fade is therefore a sibling, positioned against the panel root. */}
      <div
        // `relative` is load-bearing: Motion walks `offsetParent` from each
        // frame up to the scroll container, so the container has to be one.
        // Without it every frame's offsets are shifted by the panel's distance
        // down the document and the masks open outside the visible range.
        className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain"
        ref={scrollRef}
      >
        <div className="flex flex-col gap-16 px-6 pb-24">
          {/* A lead-in tall enough to own the panel at rest. Each mask starts
                fully hidden by definition, so any frame that is only half past
                the fold at rest reads as an empty box rather than as something
                waiting to be scrolled into view. */}
          <header className="flex h-[400px] max-w-xl flex-col justify-center gap-3">
            <h2 className="font-semibold text-2xl text-foreground leading-tight tracking-tight">
              Every reveal is a claim about where the eye should land first
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              The five masks below are driven by this panel&rsquo;s own scroll,
              not the page&rsquo;s. Each image also travels against the scroll
              direction, so the frame and its contents never move at the same
              speed.
            </p>
          </header>

          {FRAMES.map((frame) => (
            <figure className="flex flex-col gap-4" key={frame.id}>
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-semibold text-foreground text-lg tracking-tight">
                  {frame.title}
                </h3>
                <span className="shrink-0 rounded-full border border-foreground/12 px-2.5 py-0.5 font-medium font-mono text-[11px] text-muted-foreground">
                  mask=&quot;{frame.mask}&quot;
                </span>
              </div>
              <ScrollImageReveal
                alt={frame.alt}
                className="h-[260px] w-full"
                container={scrollRef}
                direction={frame.direction}
                mask={frame.mask}
                parallax={frame.parallax}
                src={`${sceneById(frame.scene)?.src}?tr=w-1400,h-900,f-auto`}
              />
              <figcaption className="max-w-xl text-muted-foreground text-sm leading-relaxed">
                {frame.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-background to-transparent"
      />
    </div>
  );
}
