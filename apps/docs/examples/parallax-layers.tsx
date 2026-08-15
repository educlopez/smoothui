"use client";

import ParallaxLayers, {
  type ParallaxLayer,
} from "@repo/smoothui/components/parallax-layers";
import { ArrowDown } from "lucide-react";
import { useRef } from "react";

export default function ParallaxLayersDemo() {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Each layer has to leave the ones behind it visible, or the effect is three
  // opaque photographs stacked on top of each other and only the front one is
  // ever seen moving. Back is full-bleed, mid occupies the lower band, front is
  // type — so all three depths are legible at once.
  const layers: ParallaxLayer[] = [
    {
      content: (
        <img
          alt="Blue mountain ridges receding into night"
          className="h-full w-full scale-125 object-cover"
          src="https://ik.imagekit.io/16u211libb/smoothui/scenes/blue-ridge-night.webp?tr=w-1200,h-800,f-auto"
        />
      ),
      depth: 0.15,
      id: "sky",
    },
    {
      blur: 1.5,
      // Anchored past the bottom edge and overscanned, so the layer's own
      // travel can never drag its top or bottom edge into the frame.
      content: (
        <div className="absolute inset-x-0 -bottom-10 h-3/4">
          <img
            alt="A single pale dune crest in deep shadow"
            className="h-full w-full scale-125 object-cover"
            src="https://ik.imagekit.io/16u211libb/smoothui/scenes/dune-shadow.webp?tr=w-1200,h-500,f-auto"
          />
        </div>
      ),
      depth: 0.4,
      id: "ridge",
      opacity: 0.92,
    },
    {
      // Depth 0 means this one never moves, which is exactly what a scrim
      // needs: it guarantees the title's contrast over whatever photograph
      // sits behind it, without its own edges ever sliding into view.
      content: (
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/25" />
      ),
      depth: 0,
      id: "scrim",
    },
    {
      content: (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2">
          <h2 className="font-semibold text-4xl text-white tracking-tight">
            Depth on scroll
          </h2>
          <p className="font-medium text-sm text-white/85">
            Three layers, three speeds
          </p>
        </div>
      ),
      depth: 1,
      id: "title",
    },
  ];

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-foreground/12 bg-background">
      <div
        // `relative` is load-bearing: Motion walks `offsetParent` from the
        // target up to the scroll container, so the container has to be one.
        // Without it the offsets are shifted by the panel's distance down the
        // document and the layers separate outside the range you can see.
        className="relative h-[500px] overflow-y-auto overscroll-contain"
        ref={scrollRef}
      >
        {/* Lead-in tall enough that the scene starts at zero separation with
            the panel at rest, so the whole ["start 0.95", "end 0.6"] sweep is
            something you scroll through rather than land in the middle of. */}
        <div className="flex h-[400px] items-end justify-center px-6 pb-6">
          <p className="max-w-sm text-center text-muted-foreground text-sm leading-relaxed">
            Scroll the panel and the three layers travel at speeds set by their
            <code className="mx-1 rounded bg-foreground/8 px-1 py-0.5 font-mono text-xs">
              depth
            </code>
            . With a mouse, hovering the scene adds a second, pointer-driven
            layer of parallax.
          </p>
        </div>

        <div className="px-6">
          <ParallaxLayers
            className="h-[320px] w-full overflow-hidden rounded-2xl bg-foreground/5"
            container={scrollRef}
            layers={layers}
            pointerParallax
            range={80}
          />
        </div>

        <div className="flex h-[320px] items-start justify-center px-6 pt-8">
          <p className="max-w-sm text-center text-muted-foreground/70 text-sm leading-relaxed">
            The background barely shifts, the ridge follows, the title leads —
            which is what reads as distance.
          </p>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center"
      >
        <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/12 bg-background/90 px-3 py-1 font-medium text-muted-foreground text-xs shadow-black/5 shadow-sm backdrop-blur">
          <ArrowDown className="size-3.5" />
          Scroll inside the panel
        </span>
      </div>
    </div>
  );
}
