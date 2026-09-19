"use client";

import type { PixelFlowFieldShape } from "@repo/smoothui/components/pixel-flow-field";
import PixelFlowField from "@repo/smoothui/components/pixel-flow-field";
import SmoothButton from "@repo/smoothui/components/smooth-button";
import { useState } from "react";

const SHAPES: { label: string; value: PixelFlowFieldShape }[] = [
  { label: "Squares", value: "square" },
  { label: "Dots", value: "circle" },
  { label: "Crosses", value: "cross" },
];

export default function PixelFlowFieldDemo() {
  const [shape, setShape] = useState<PixelFlowFieldShape>("square");
  const [scatter, setScatter] = useState(0);

  return (
    <div className="w-full">
      <PixelFlowField
        cellSize={7}
        className="h-[460px] w-full rounded-2xl border border-foreground/10 bg-background"
        gap={3}
        pointerRadius={150}
        scatter={scatter}
        shape={shape}
        text="smooth"
      >
        <div className="flex h-full flex-col justify-between p-5">
          <p className="max-w-[16rem] text-muted-foreground text-xs">
            Every cell samples one pixel of the word, then flows back into it.
          </p>

          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="flex items-center gap-1 rounded-full border border-foreground/10 bg-background/70 p-1 backdrop-blur-sm">
              {SHAPES.map(({ label, value }) => (
                <SmoothButton
                  aria-pressed={shape === value}
                  color={shape === value ? "accent" : "neutral"}
                  key={value}
                  onClick={() => setShape(value)}
                  shape="pill"
                  size="sm"
                  variant={shape === value ? "solid" : "ghost"}
                >
                  {label}
                </SmoothButton>
              ))}
            </div>

            <SmoothButton
              onClick={() => setScatter((previous) => previous + 1)}
              shape="pill"
              size="sm"
              variant="outline"
            >
              Scatter and re-form
            </SmoothButton>
          </div>
        </div>
      </PixelFlowField>
    </div>
  );
}
