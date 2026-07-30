"use client";

import {
  type AIState,
  useSimulatedAmplitude,
} from "@repo/smoothui/components/ai-core";
import AIOrbFace from "@repo/smoothui/components/ai-orb-face";
import { useState } from "react";

const STATES: AIState[] = [
  "idle",
  "listening",
  "thinking",
  "streaming",
  "done",
  "error",
];

const StateSample = ({ state }: { state: AIState }) => {
  const amplitude = useSimulatedAmplitude(state);

  return (
    <div className="flex flex-col items-center gap-2">
      <AIOrbFace amplitude={amplitude} gaze={false} size={72} state={state} />
      <span className="text-muted-foreground text-xs capitalize">{state}</span>
    </div>
  );
};

const Example = () => {
  const [state, setState] = useState<AIState>("idle");
  const amplitude = useSimulatedAmplitude(state);

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      {/* Gaze is off in the grid: six characters all tracking the cursor at
          once is noise. The big one below tracks it. */}
      <div className="grid grid-cols-3 gap-x-8 gap-y-6 sm:grid-cols-6">
        {STATES.map((option) => (
          <StateSample key={option} state={option} />
        ))}
      </div>

      <div className="h-px w-full max-w-md bg-border" />

      <AIOrbFace amplitude={amplitude} size={150} state={state} />
      <p className="text-muted-foreground text-xs">
        Move your cursor — it watches. Switch to thinking and it looks away.
      </p>

      <div className="flex flex-wrap justify-center gap-2">
        {STATES.map((option) => (
          <button
            className={`rounded-full border px-3 py-1.5 text-xs capitalize transition-colors ${
              state === option
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
            key={option}
            onClick={() => setState(option)}
            type="button"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Example;
