"use client";

import type { PresetPattern } from "@repo/smoothui/components/grid-loader";
import GridLoader from "@repo/smoothui/components/grid-loader";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

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
    useState<PresetPattern>("sparkle");
  const [colorIndex, setColorIndex] = useState(4);
  const [modeIndex, setModeIndex] = useState(0);
  const [blur, setBlur] = useState(1);
  const [rounded, setRounded] = useState(false);
  const [open, setOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const currentMode = modes[modeIndex];

  return (
    <div className="flex w-full flex-col items-center gap-5">
      {/* Pills showcase */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {/* Fixed: Thinking */}
        <div className="flex items-center gap-2.5 rounded-full bg-black px-4 py-2">
          <GridLoader
            blur={1}
            color="white"
            gap={1}
            mode="stagger"
            pattern="frame"
            size="sm"
          />
          <span className="font-medium text-sm text-white">Thinking</span>
        </div>

        {/* Fixed: Generating */}
        <div className="flex items-center gap-2.5 rounded-full bg-black px-4 py-2">
          <GridLoader
            blur={1.2}
            color="blue"
            gap={1}
            mode="pulse"
            pattern="plus-full"
            rounded
            size="sm"
          />
          <span className="font-medium text-sm text-white">Generating</span>
        </div>

        {/* Customizable: Searching */}
        <div className="flex items-center gap-2.5 rounded-full bg-black px-4 py-2 ring-2 ring-primary/50">
          <GridLoader
            blur={blur}
            color={colors[colorIndex]}
            gap={1}
            mode={currentMode}
            pattern={selectedPattern}
            rounded={rounded}
            sequence={
              currentMode === "sequence"
                ? ["corners-only", "plus-hollow", "frame"]
                : undefined
            }
            size="sm"
          />
          <span className="font-medium text-sm text-white">Searching</span>
        </div>
      </div>

      {/* Customize button */}
      <button
        className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-muted-foreground text-xs transition-colors hover:text-foreground"
        onClick={() => setOpen(true)}
        type="button"
      >
        <svg
          className="size-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
        >
          <path
            d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.248a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Customize
      </button>

      {/* Animated side panel */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && (
              <>
                <motion.div
                  animate={{ opacity: 1 }}
                  className="fixed inset-0 z-[60] bg-black/50"
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0 }}
                  onClick={() => setOpen(false)}
                  transition={
                    shouldReduceMotion ? { duration: 0 } : { duration: 0.2 }
                  }
                />
                <motion.div
                  animate={{ x: 0 }}
                  aria-label="Customize panel"
                  aria-modal="true"
                  className="fixed inset-y-0 right-0 z-[60] flex w-80 flex-col border-l bg-background shadow-lg"
                  exit={{ x: "100%" }}
                  initial={{ x: "100%" }}
                  role="dialog"
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { type: "spring", duration: 0.5, bounce: 0.05 }
                  }
                >
                  <div className="flex items-center justify-between border-b px-4 py-3">
                    <span className="font-semibold text-sm">Customize</span>
                    <button
                      className="rounded-xs opacity-70 transition-opacity hover:opacity-100"
                      onClick={() => setOpen(false)}
                      type="button"
                    >
                      <svg
                        className="size-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M18 6 6 18M6 6l12 12"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="sr-only">Close</span>
                    </button>
                  </div>

                  <div className="flex flex-col gap-4 overflow-y-auto p-4">
                    {/* Color selector */}
                    <div className="flex flex-col gap-2">
                      <span className="text-muted-foreground text-xs">
                        Color
                      </span>
                      <div className="flex gap-2">
                        {colors.map((color, idx) => (
                          <button
                            aria-label={`Select ${color} color`}
                            className={`size-6 cursor-pointer rounded-sm border transition-all duration-200 ${
                              idx === colorIndex
                                ? "shadow-custom-brand"
                                : "opacity-60 hover:opacity-100"
                            }`}
                            key={color}
                            onClick={() => setColorIndex(idx)}
                            style={{ background: colorValues[color] }}
                            type="button"
                          />
                        ))}
                      </div>
                    </div>

                    {/* Mode */}
                    <div className="flex flex-col gap-2">
                      <span className="text-muted-foreground text-xs">
                        Mode
                      </span>
                      <div className="flex gap-1 rounded-lg bg-muted p-1">
                        {modes.map((mode, idx) => (
                          <button
                            className={`flex-1 rounded-md px-2 py-1 font-medium text-xs transition-all ${
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

                    {/* Rounded */}
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-xs">
                        Rounded
                      </span>
                      <button
                        className={`rounded-md px-2.5 py-1 font-medium text-xs transition-all ${
                          rounded
                            ? "bg-foreground text-background"
                            : "bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                        onClick={() => setRounded((prev) => !prev)}
                        type="button"
                      >
                        {rounded ? "On" : "Off"}
                      </button>
                    </div>

                    {/* Blur slider */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-xs">
                          Blur
                        </span>
                        <span className="font-mono text-muted-foreground text-xs">
                          {blur.toFixed(1)}
                        </span>
                      </div>
                      <input
                        className="w-full"
                        max="3"
                        min="0"
                        onChange={(e) =>
                          setBlur(Number.parseFloat(e.target.value))
                        }
                        step="0.1"
                        type="range"
                        value={blur}
                      />
                    </div>

                    {/* Pattern grid */}
                    <div className="flex flex-col gap-2">
                      <span className="text-muted-foreground text-xs">
                        Pattern
                      </span>
                      <div className="overflow-y-auto rounded-lg border bg-muted/50 p-2.5">
                        {patternGroups.map((group) => (
                          <div className="mb-2.5 last:mb-0" key={group.label}>
                            <div className="mb-1 px-1 font-medium text-[11px] text-muted-foreground">
                              {group.label}
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {group.patterns.map((pattern) => (
                                <button
                                  className={`rounded-md bg-black p-1.5 transition-shadow ${
                                    selectedPattern === pattern
                                      ? "ring-2 ring-primary"
                                      : ""
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
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
