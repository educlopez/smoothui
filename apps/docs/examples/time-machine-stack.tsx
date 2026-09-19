"use client";

import SmoothButton from "@repo/smoothui/components/smooth-button";
import type { TimeMachineStackItem } from "@repo/smoothui/components/time-machine-stack";
import TimeMachineStack from "@repo/smoothui/components/time-machine-stack";
import { castAnimals, castPeople } from "@smoothui/data/cast";
import { approvedAbstracts } from "@smoothui/data/scenes";
import Image from "next/image";
import { useState } from "react";

const items: TimeMachineStackItem[] = [
  castPeople[0],
  castPeople[3],
  castPeople[13],
  castAnimals[0],
  castAnimals[3],
  ...approvedAbstracts.slice(0, 2),
].map((image) => ({
  content: (
    <Image
      alt={image.alt}
      className="h-full w-full select-none object-cover"
      draggable={false}
      height={640}
      width={960}
      unoptimized
      src={`${image.src}?tr=w-960,h-640,f-auto`}
    />
  ),
  id: image.id,
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
