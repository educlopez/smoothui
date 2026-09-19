"use client";

import KineticTypeScroll from "@repo/smoothui/components/kinetic-type-scroll";
import SmoothButton from "@repo/smoothui/components/smooth-button";
import { ArrowDown, RotateCcw } from "lucide-react";
import { useRef, useState } from "react";

const WORDS = [
  "Design",
  "moves",
  "with",
  "intent",
  "and",
  "breathes",
  "on",
  "scroll",
];

export default function KineticTypeScrollDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [runId, setRunId] = useState(0);

  const handleReplay = () => {
    containerRef.current?.scrollTo({ behavior: "smooth", top: 0 });
    setRunId((id) => id + 1);
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-3 px-4 py-6">
      <div className="relative w-full overflow-hidden rounded-2xl border border-foreground/12 bg-background">
        <div
          // `relative` is load-bearing: Motion resolves the target's position
          // by walking `offsetParent` up to the scroll container, so the
          // container has to *be* an offsetParent. Without it the walk escapes
          // to the page and every offset is shifted by the panel's distance
          // down the document — which is why the wave used to run out of range
          // before it reached the last word.
          className="relative h-[520px] overflow-y-auto overscroll-contain"
          ref={containerRef}
        >
          {/* Sized so the phrase sits just below the fold at rest — its first
              line already peeking in, so the panel never reads as an empty box,
              but the scroll window still starts at zero rather than halfway
              through the wave. */}
          <div className="flex h-[380px] items-center justify-center px-6">
            <p className="max-w-sm text-center text-muted-foreground text-sm leading-relaxed">
              Each word owns a slice of this panel&rsquo;s scroll range. Keep
              scrolling and the wave travels through the phrase, one word at a
              time.
            </p>
          </div>

          <div className="flex h-[340px] items-center justify-center px-6">
            <KineticTypeScroll
              className="max-w-xl font-semibold text-[2.75rem] text-foreground leading-[1.15] tracking-tight sm:text-6xl"
              container={containerRef}
              dimRange={[0.4, 1]}
              key={runId}
              liftRange={[0, -14]}
              scaleRange={[0.92, 1.16]}
              trackingRange={[-1, 3]}
              weightRange={[400, 900]}
              words={WORDS}
            />
          </div>

          {/* Tail room: the wave finishes with the phrase parked near the top
              of the panel, and this holds it there long enough to read. */}
          <div className="flex h-[340px] items-start justify-center px-6 pt-14">
            <p className="max-w-sm text-center text-muted-foreground/70 text-sm leading-relaxed">
              Scroll back up and the wave runs in reverse — the effect is bound
              to position, not to a one-shot trigger.
            </p>
          </div>
        </div>

        {/* Rest-state affordance: the fade says the panel continues, the pill
            says the panel is the thing you scroll. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-background to-transparent"
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

      <SmoothButton
        onClick={handleReplay}
        shape="pill"
        size="sm"
        variant="outline"
      >
        <RotateCcw />
        Replay
      </SmoothButton>
    </div>
  );
}
