"use client";

import SvgDrawOnScroll from "@repo/smoothui/components/svg-draw-on-scroll";
import { ArrowDown } from "lucide-react";
import { useRef } from "react";

const SIGNATURE_PATH =
  "M5,60 C20,10 35,90 50,50 C65,10 75,90 95,55 C105,40 110,60 95,60";

export default function SvgDrawOnScrollDemo() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-foreground/12 bg-background">
      <div
        // `relative` is load-bearing: Motion walks `offsetParent` from the
        // target up to the scroll container, so the container has to be one.
        // Without it the offsets are shifted by the panel's distance down the
        // document and the range no longer matches what you see.
        className="relative h-[500px] overflow-y-auto overscroll-contain"
        ref={scrollRef}
      >
        {/* Lead-in sized so the stroke is still at zero when the panel is at
            rest, and tall enough that the whole ["start 0.9", "end 0.6"] range
            fits inside the available scroll — the line now finishes drawing
            while the artwork is still mid-panel, not on its way out. */}
        <div className="flex h-[420px] items-end justify-center px-6 pb-6">
          <p className="max-w-sm text-center text-muted-foreground text-sm leading-relaxed">
            Scroll the panel and the line draws itself, with the dot riding the
            tip of the stroke.
          </p>
        </div>

        <div className="px-6">
          <SvgDrawOnScroll
            className="h-44 w-full text-brand"
            container={scrollRef}
            marker={
              <span className="block size-3.5 rounded-full bg-brand shadow-black/20 shadow-md ring-2 ring-background" />
            }
            path={SIGNATURE_PATH}
            strokeWidth={3}
            viewBox="0 0 110 100"
          />
        </div>

        <div className="flex h-[340px] items-start justify-center px-6 pt-10">
          <p className="max-w-sm text-center text-muted-foreground/70 text-sm leading-relaxed">
            Scroll back up and the line undraws. Pass{" "}
            <code className="rounded bg-foreground/8 px-1 py-0.5 font-mono text-xs">
              once
            </code>{" "}
            to keep it drawn instead.
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
