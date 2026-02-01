"use client";

import type { PresetPattern } from "@repo/smoothui/components/grid-loader";
import GridLoader from "@repo/smoothui/components/grid-loader";
import { useState } from "react";

// All available patterns grouped by category
const patternGroups: { label: string; patterns: PresetPattern[] }[] = [
  {
    label: "Solo",
    patterns: ["solo-center", "solo-tl", "solo-tr", "solo-bl", "solo-br"],
  },
  {
    label: "Lines H",
    patterns: ["line-h-top", "line-h-mid", "line-h-bot"],
  },
  {
    label: "Lines V",
    patterns: ["line-v-left", "line-v-mid", "line-v-right"],
  },
  {
    label: "Diagonals",
    patterns: ["line-diag-1", "line-diag-2"],
  },
  {
    label: "Corners",
    patterns: ["corners-only", "corners-sync", "corners"],
  },
  {
    label: "Plus",
    patterns: ["plus-hollow", "plus-full"],
  },
  {
    label: "L-shapes",
    patterns: ["L-tl", "L-tr", "L-bl", "L-br"],
  },
  {
    label: "T-shapes",
    patterns: ["T-top", "T-bot", "T-left", "T-right"],
  },
  {
    label: "Duo",
    patterns: ["duo-h", "duo-v", "duo-diag"],
  },
  {
    label: "Frame",
    patterns: ["frame", "frame-sync", "border"],
  },
  {
    label: "Sparse",
    patterns: ["sparse-1", "sparse-2", "sparse-3"],
  },
  {
    label: "Waves",
    patterns: ["wave-lr", "wave-rl", "wave-tb", "wave-bt"],
  },
  {
    label: "Quadrants",
    patterns: ["diagonal-tl", "diagonal-tr", "diagonal-bl", "diagonal-br"],
  },
  {
    label: "Ripple",
    patterns: ["ripple-out", "ripple-in"],
  },
  {
    label: "Shapes",
    patterns: ["cross", "x-shape", "diamond"],
  },
  {
    label: "Stripes",
    patterns: ["stripes-h", "stripes-v", "rows-alt"],
  },
  {
    label: "Spirals",
    patterns: ["spiral-cw", "spiral-ccw"],
  },
  {
    label: "Snake",
    patterns: ["snake", "snake-rev"],
  },
  {
    label: "Rain",
    patterns: ["rain", "rain-rev"],
  },
  {
    label: "Effects",
    patterns: [
      "waterfall",
      "breathing",
      "heartbeat",
      "twinkle",
      "sparkle",
      "chaos",
    ],
  },
  {
    label: "Edge",
    patterns: ["edge-cw", "checkerboard"],
  },
];

const colors = ["white", "blue", "red", "green", "amber"] as const;

const colorValues: Record<string, string> = {
  white: "#f5f5f4",
  red: "#f87171",
  blue: "#38bdf8",
  green: "#4ade80",
  amber: "#fbbf24",
};

const modes = ["stagger", "pulse", "sequence"] as const;

export default function GridLoaderDemo() {
  const [selectedPattern, setSelectedPattern] =
    useState<PresetPattern>("frame");
  const [colorIndex, setColorIndex] = useState(1); // Default to blue
  const [modeIndex, setModeIndex] = useState(0); // Default to stagger

  const currentMode = modes[modeIndex];

  return (
    <div className="flex w-full flex-col gap-4 lg:flex-row lg:gap-6">
      {/* Pattern list - Below on mobile, left on desktop */}
      <div className="order-2 h-[200px] w-full shrink-0 overflow-y-auto rounded-xl border bg-muted/50 p-3 lg:order-1 lg:h-[400px] lg:w-52">
        {patternGroups.map((group) => (
          <div className="mb-3" key={group.label}>
            <div className="mb-1.5 px-1 font-medium text-muted-foreground text-xs">
              {group.label}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {group.patterns.map((pattern) => (
                <button
                  className={`rounded-md bg-black p-1.5 transition-all ${
                    selectedPattern === pattern
                      ? "ring-2 ring-primary"
                      : "opacity-70 hover:opacity-100"
                  }`}
                  key={pattern}
                  onClick={() => setSelectedPattern(pattern)}
                  title={pattern}
                  type="button"
                >
                  <GridLoader
                    color={colors[colorIndex]}
                    pattern={pattern}
                    size={18}
                    static
                  />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Preview and controls - Top on mobile, right on desktop */}
      <div className="order-1 flex min-w-0 flex-1 flex-col items-center justify-center gap-3 lg:order-2 lg:gap-4">
        {/* Main showcase with color selector */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center justify-center rounded-xl bg-black/90 p-6 sm:p-8">
            <GridLoader
              color={colors[colorIndex]}
              mode={currentMode}
              pattern={selectedPattern}
              sequence={
                currentMode === "sequence"
                  ? ["corners-only", "plus-hollow", "frame"]
                  : undefined
              }
              size={48}
            />
          </div>

          {/* Color selector - horizontal on mobile */}
          <div className="flex gap-2">
            {colors.map((color, idx) => (
              <button
                aria-label={`Select ${color} color`}
                className={`size-5 cursor-pointer rounded-sm border transition-all duration-200 ${
                  idx === colorIndex
                    ? "shadow-custom-brand"
                    : "opacity-60 hover:opacity-100"
                }`}
                key={color}
                onClick={() => setColorIndex(idx)}
                style={{
                  background: colorValues[color],
                }}
                type="button"
              />
            ))}
          </div>
        </div>

        {/* Pattern name */}
        <div className="font-mono text-muted-foreground text-sm">
          {selectedPattern}
        </div>

        {/* Mode selector */}
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          {modes.map((mode, idx) => (
            <button
              className={`rounded-md px-2.5 py-1 font-medium text-xs transition-all sm:px-3 sm:py-1.5 sm:text-sm ${
                idx === modeIndex
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              key={mode}
              onClick={() => setModeIndex(idx)}
              type="button"
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
