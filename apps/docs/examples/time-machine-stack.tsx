"use client";

import SmoothButton from "@repo/smoothui/components/smooth-button";
import type { TimeMachineStackItem } from "@repo/smoothui/components/time-machine-stack";
import TimeMachineStack from "@repo/smoothui/components/time-machine-stack";
import { useState } from "react";

const SHOTS = [
  { alt: "Fog rolling over a forested ridge", id: "ridge" },
  { alt: "An empty road cutting through desert scrub", id: "road" },
  { alt: "Waves breaking against a dark rock shelf", id: "shore" },
  { alt: "Snow-covered peaks above a still lake", id: "peaks" },
  { alt: "City rooftops at dusk under low cloud", id: "rooftops" },
  { alt: "Sunlight through a canopy of tall pines", id: "canopy" },
  { alt: "A narrow canyon road in late afternoon light", id: "canyon" },
] as const;

const items: TimeMachineStackItem[] = SHOTS.map((shot) => ({
  content: (
    <img
      alt={shot.alt}
      className="h-full w-full select-none object-cover"
      draggable={false}
      src={`https://picsum.photos/seed/timemachine-${shot.id}/960/640`}
    />
  ),
  id: shot.id,
}));

export default function TimeMachineStackDemo() {
  const [index, setIndex] = useState(0);
  const lastIndex = items.length - 1;

  return (
    <div className="flex h-[30rem] w-full flex-col gap-4">
      <TimeMachineStack
        className="min-h-0 flex-1"
        index={index}
        items={items}
        onIndexChange={setIndex}
      />

      <div className="flex shrink-0 items-center justify-center gap-2">
        <SmoothButton
          disabled={index === 0}
          onClick={() => setIndex((current) => Math.max(current - 1, 0))}
          size="sm"
          variant="outline"
        >
          Newer
        </SmoothButton>
        <SmoothButton
          color="accent"
          disabled={index === lastIndex}
          onClick={() =>
            setIndex((current) => Math.min(current + 1, lastIndex))
          }
          size="sm"
          variant="solid"
        >
          Older
        </SmoothButton>
      </div>

      <p className="shrink-0 text-center text-muted-foreground text-xs tabular-nums">
        {index + 1} of {items.length} &middot; scroll, drag, or use Arrow Up /
        Down inside the stack
      </p>
    </div>
  );
}
