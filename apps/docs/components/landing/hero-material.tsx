"use client";

import SiriOrb from "@repo/smoothui/components/siri-orb";
import { Pause, Play } from "lucide-react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useId, useRef, useState } from "react";

const PALETTES = [
  { colors: ["#596374", "#f2f3f5", "#858197"], name: "Pearl" },
  { colors: ["#bf397e", "#f7e9f3", "#775786"], name: "Rose" },
  { colors: ["#34797e", "#e5f0f1", "#647ea9"], name: "Glacier" },
];
const MODES = ["Calm", "Energetic"] as const;

export function HeroMaterial() {
  const [palette, setPalette] = useState(0);
  const [mode, setMode] = useState<(typeof MODES)[number]>("Calm");
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const materialRef = useRef<HTMLDivElement>(null);
  const inView = useInView(materialRef, { amount: 0.1 });
  const id = useId();
  const { colors } = PALETTES[palette];

  return (
    <div
      aria-label="Interactive material preview"
      className="relative isolate w-full rounded-[2rem] border border-border/70 bg-muted/40 p-3 shadow-[inset_0_1px_0_#ffffff80] sm:p-5"
      data-hero-material
      ref={materialRef}
      role="group"
    >
      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[1.5rem] border border-border/50 bg-background/65 shadow-[inset_0_2px_12px_#00000004]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_75%,var(--color-muted),transparent_65%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-[12%] h-5 w-2/5 rounded-[50%] bg-foreground/10 blur-xl"
        />
        <div
          className="hero-material-orb relative aspect-square w-[78%] max-w-90"
          data-paused={paused || !inView || reduced ? "true" : "false"}
        >
          <SiriOrb
            animationDuration={mode === "Energetic" ? 10 : 28}
            className="!size-full"
            colors={{
              bg: colors[1],
              c1: colors[0],
              c2: colors[2],
              c3: colors[1],
              c4: colors[0],
            }}
            size="320px"
            state="thinking"
          />
        </div>
      </div>
      <div className="relative mx-auto -mt-6 flex w-full max-w-full flex-wrap items-center justify-center gap-3 rounded-2xl border border-border/80 bg-card p-2 shadow-[0_6px_20px_#0000000a,inset_0_1px_0_#ffffff80] sm:w-fit sm:gap-3 sm:px-3">
        <div aria-label="Material palette" className="flex" role="group">
          {PALETTES.map((item, index) => (
            <button
              aria-label={item.name}
              aria-pressed={palette === index}
              className="group relative flex size-10 items-center justify-center rounded-xl focus-visible:outline-2 focus-visible:outline-ring"
              key={item.name}
              onClick={() => setPalette(index)}
              type="button"
            >
              <span
                className="size-6 rounded-full border border-foreground/10 shadow-[inset_0_1px_2px_#ffffffaa,0_2px_3px_#00000010] transition-transform motion-safe:group-hover:scale-110 motion-reduce:transition-none"
                style={{
                  background: `linear-gradient(135deg, ${item.colors.join(", ")})`,
                }}
              />
              {palette === index ? (
                <span
                  aria-hidden
                  className="absolute bottom-0.5 size-1 rounded-full bg-brand"
                />
              ) : null}
            </button>
          ))}
        </div>
        <button
          aria-label={
            paused ? "Resume material animation" : "Pause material animation"
          }
          aria-pressed={paused}
          className="flex size-10 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring sm:order-last"
          onClick={() => setPaused((value) => !value)}
          type="button"
        >
          {paused ? (
            <Play aria-hidden className="size-4" />
          ) : (
            <Pause aria-hidden className="size-4" />
          )}
        </button>
        <div
          aria-label="Material motion"
          className="flex w-full rounded-xl bg-muted/70 p-1 sm:w-auto"
          role="group"
        >
          {MODES.map((value) => (
            <button
              aria-pressed={mode === value}
              className="relative min-h-10 flex-1 rounded-lg px-3 font-medium text-foreground/70 text-xs focus-visible:outline-2 focus-visible:outline-ring sm:px-4"
              key={value}
              onClick={() => setMode(value)}
              type="button"
            >
              {mode === value ? (
                <motion.span
                  aria-hidden
                  className="absolute inset-0 rounded-lg border border-border/60 bg-background shadow-sm"
                  layoutId={`material-mode-${id}`}
                  transition={{ duration: reduced ? 0 : 0.2, ease: "easeOut" }}
                />
              ) : null}
              <span className="relative">{value}</span>
            </button>
          ))}
        </div>
      </div>
      <style>{`
        .hero-material-orb[data-paused="true"] *,
        .hero-material-orb[data-paused="true"] *::before,
        .hero-material-orb[data-paused="true"] *::after {
          animation-play-state: paused !important;
        }
      `}</style>
    </div>
  );
}
