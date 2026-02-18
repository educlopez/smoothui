"use client";

import Scrubber from "@repo/smoothui/components/scrubber";
import { useState } from "react";

export default function ScrubberDemo() {
  const [opacity, setOpacity] = useState(0.4);
  const [scale, setScale] = useState(1.5);
  const [rotation, setRotation] = useState(45);

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="flex w-full max-w-[380px] flex-col gap-3">
        <Scrubber label="Opacity" onValueChange={setOpacity} value={opacity} />
        <Scrubber
          decimals={1}
          label="Scale"
          max={3}
          min={0}
          onValueChange={setScale}
          step={0.1}
          ticks={5}
          value={scale}
        />
        <Scrubber
          decimals={0}
          label="Rotation"
          max={360}
          min={0}
          onValueChange={setRotation}
          step={1}
          ticks={7}
          value={rotation}
        />
      </div>
    </div>
  );
}
