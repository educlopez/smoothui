"use client";

import type { LiquidMetalVariant } from "@repo/smoothui/components/liquid-metal";
import LiquidMetal from "@repo/smoothui/components/liquid-metal";
import { useState } from "react";

const VARIANTS: LiquidMetalVariant[] = ["chrome", "gold", "mercury", "oil"];

export default function LiquidMetalDemo() {
  const [variant, setVariant] = useState<LiquidMetalVariant>("chrome");
  const [paused, setPaused] = useState(false);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8">
      <div className="flex flex-wrap items-center gap-2">
        {VARIANTS.map((item) => (
          <button
            aria-pressed={variant === item}
            className={
              variant === item
                ? "rounded-full bg-brand px-3 py-1.5 font-medium text-sm text-white"
                : "rounded-full border border-foreground/20 px-3 py-1.5 font-medium text-muted-foreground text-sm"
            }
            key={item}
            onClick={() => setVariant(item)}
            type="button"
          >
            {item}
          </button>
        ))}
        <button
          className="ml-auto rounded-full border border-foreground/20 px-3 py-1.5 font-medium text-muted-foreground text-sm"
          onClick={() => setPaused((value) => !value)}
          type="button"
        >
          {paused ? "Play" : "Pause"}
        </button>
      </div>

      <LiquidMetal
        className="min-h-[280px]"
        distortion={1.15}
        paused={paused}
        pointerInfluence
        speed={0.9}
        variant={variant}
      >
        <div className="flex min-h-[280px] flex-col justify-end gap-2 p-8">
          <h2 className="font-semibold text-2xl text-white drop-shadow-lg">
            Poured, not printed
          </h2>
          <p className="max-w-sm text-sm text-white/80 drop-shadow">
            A domain-warped WebGL2 surface that reacts to your pointer.
          </p>
        </div>
      </LiquidMetal>

      <div className="rounded-2xl border border-foreground/20 bg-background p-8 text-center">
        <LiquidMetal
          className="font-bold text-4xl tracking-tight sm:text-6xl"
          maskText
          variant={variant}
        >
          Liquid Metal
        </LiquidMetal>
        <p className="mt-3 text-muted-foreground text-sm">
          The same palette clipped to the text with{" "}
          <code className="text-foreground">maskText</code>.
        </p>
      </div>
    </div>
  );
}
