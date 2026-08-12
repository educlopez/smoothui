"use client";

import SvgClipMask from "@repo/smoothui/components/svg-clip-mask";
import { ArrowDown } from "lucide-react";
import { useRef } from "react";

const MORPH_PATHS = [
  "M0.5,0.02 C0.75,0.02 0.98,0.25 0.98,0.5 C0.98,0.75 0.75,0.98 0.5,0.98 C0.25,0.98 0.02,0.75 0.02,0.5 C0.02,0.25 0.25,0.02 0.5,0.02 Z",
  "M0.5,0.1 C0.85,0.05 0.95,0.35 0.9,0.55 C0.95,0.85 0.65,0.95 0.5,0.9 C0.15,0.98 0.05,0.65 0.1,0.45 C0.05,0.15 0.35,0.05 0.5,0.1 Z",
];

// `animate="scroll"` steps between the paths it is given, so it needs at least
// two — with a single path it has nothing to step to and silently does nothing,
// which is what the wave below used to do. Every path keeps the same command
// structure (M, C, L, L, Z) so the browser interpolates the numbers instead of
// snapping between shapes.
const WAVE_PATHS = [
  "M0,0.42 C0.25,0.00 0.75,0.72 1,0.36 L1,1 L0,1 Z",
  "M0,0.10 C0.25,0.70 0.75,0.04 1,0.58 L1,1 L0,1 Z",
  "M0,0.55 C0.25,0.08 0.75,0.66 1,0.06 L1,1 L0,1 Z",
  "M0,0.06 C0.25,0.62 0.75,0.00 1,0.48 L1,1 L0,1 Z",
  "M0,0.48 C0.25,0.02 0.75,0.60 1,0.20 L1,1 L0,1 Z",
];

export default function SvgClipMaskDemo() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-foreground/12 bg-background">
      <div
        // `relative` is load-bearing: Motion walks `offsetParent` from the
        // target up to the scroll container, so the container has to be one.
        // Without it the offsets are shifted by the panel's distance down the
        // document and the crest no longer tracks the scroll you can see.
        className="relative h-[500px] overflow-y-auto overscroll-contain"
        ref={scrollRef}
      >
        <div className="flex flex-col items-center gap-4 px-6 pt-8 pb-6">
          <p className="max-w-sm text-center text-muted-foreground text-sm leading-relaxed">
            The blob morphs on a loop of its own, with no scrolling involved.
          </p>
          <SvgClipMask animate="morph" morphPaths={MORPH_PATHS} shape="blob">
            <img
              alt="Colorful abstract texture"
              className="size-52 object-cover"
              src="https://picsum.photos/seed/svg-clip-mask-blob/400/400"
            />
          </SvgClipMask>
        </div>

        <div className="flex h-[280px] items-end justify-center px-6 pb-4">
          <p className="max-w-sm text-center text-muted-foreground text-sm leading-relaxed">
            The wave below is different — its mask is bound to this
            panel&rsquo;s scroll position, so the crest moves as you scroll.
          </p>
        </div>

        <div className="px-6">
          <SvgClipMask
            animate="scroll"
            className="w-full"
            container={scrollRef}
            morphPaths={WAVE_PATHS}
            shape="wave"
          >
            <img
              alt="Ocean waves seen from above"
              className="h-48 w-full object-cover"
              src="https://picsum.photos/seed/svg-clip-mask-wave/800/300"
            />
          </SvgClipMask>
        </div>

        <div className="flex h-[300px] items-start justify-center px-6 pt-10">
          <p className="max-w-sm text-center text-muted-foreground/70 text-sm leading-relaxed">
            Scroll back up and the crest retraces its path — the shape is bound
            to scroll position, not to a one-shot trigger.
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
