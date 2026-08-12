"use client";

import SmoothButton from "@repo/smoothui/components/smooth-button";
import TextMorph from "@repo/smoothui/components/text-morph";
import { useEffect, useState } from "react";

type Step = {
  detail: string;
  id: string;
  progress: number;
  status: string;
};

const STEPS: Step[] = [
  {
    detail: "Waiting for a free build runner",
    id: "queued",
    progress: 0,
    status: "Queued",
  },
  {
    detail: "Waiting for the bundler to finish",
    id: "building",
    progress: 38,
    status: "Building",
  },
  {
    detail: "Waiting for the edge to pick it up",
    id: "deploying",
    progress: 76,
    status: "Deploying",
  },
  {
    detail: "Waiting is over, the build is live",
    id: "deployed",
    progress: 100,
    status: "Deployed",
  },
];

const STEP_INTERVAL_MS = 2200;
const PERCENT = 100;

export default function TextMorphDemo() {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }
    const intervalId = setInterval(() => {
      setIndex((prev) => (prev + 1) % STEPS.length);
    }, STEP_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [isPlaying]);

  const step = STEPS[index] ?? STEPS[0];

  const handlePick = (nextIndex: number) => {
    setIndex(nextIndex);
    setIsPlaying(false);
  };

  return (
    <div className="flex h-full w-full flex-col justify-between gap-6">
      <div className="flex flex-col gap-3">
        <span className="font-medium text-[11px] text-muted-foreground uppercase tracking-[0.14em]">
          Deployment
        </span>

        <TextMorph
          as="p"
          className="font-semibold text-5xl text-foreground tracking-tight sm:text-6xl"
          text={step.status}
        />

        <TextMorph
          as="p"
          className="max-w-md text-lg text-muted-foreground"
          mode="words"
          text={step.detail}
        />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <span className="text-muted-foreground text-sm">Progress</span>
          <TextMorph
            align="end"
            className="font-semibold text-3xl text-foreground tabular-nums"
            text={`${step.progress}%`}
          />
        </div>

        <div className="h-1.5 w-full overflow-hidden rounded-full bg-foreground/10">
          <div
            className="h-full origin-left rounded-full bg-brand transition-transform duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"
            style={{ transform: `scaleX(${step.progress / PERCENT})` }}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {STEPS.map((entry, entryIndex) => (
          <SmoothButton
            aria-pressed={entryIndex === index}
            color={entryIndex === index ? "accent" : "neutral"}
            key={entry.id}
            onClick={() => handlePick(entryIndex)}
            shape="pill"
            size="sm"
            variant={entryIndex === index ? "solid" : "soft"}
          >
            {entry.status}
          </SmoothButton>
        ))}

        <SmoothButton
          className="ml-auto"
          onClick={() => setIsPlaying((playing) => !playing)}
          shape="pill"
          size="sm"
          variant="ghost"
        >
          <TextMorph text={isPlaying ? "Pause" : "Play"} />
        </SmoothButton>
      </div>
    </div>
  );
}
