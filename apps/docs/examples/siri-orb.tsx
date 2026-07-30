"use client";

import {
  type AIState,
  useAudioAmplitude,
  useSimulatedAmplitude,
} from "@repo/smoothui/components/ai-core";
import SiriOrb from "@repo/smoothui/components/siri-orb";
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
      <SiriOrb amplitude={amplitude} size="72px" state={state} />
      <span className="text-muted-foreground text-xs capitalize">{state}</span>
    </div>
  );
};

const Example = () => {
  const [state, setState] = useState<AIState>("idle");
  const simulated = useSimulatedAmplitude(state);
  const { amplitude: mic, status, start, stop } = useAudioAmplitude();

  const isMicActive = status === "active";

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      {/* All six states at once — the motifs are meant to be told apart at a
          glance, so they are best judged side by side. */}
      <div className="grid grid-cols-3 gap-x-8 gap-y-6 sm:grid-cols-6">
        {STATES.map((option) => (
          <StateSample key={option} state={option} />
        ))}
      </div>

      <div className="h-px w-full max-w-md bg-border" />

      <SiriOrb
        amplitude={isMicActive ? mic : simulated}
        size="160px"
        state={state}
      />

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

      <div className="flex flex-col items-center gap-1">
        <button
          className="rounded-full border border-border px-3 py-1.5 text-muted-foreground text-xs transition-colors hover:text-foreground"
          onClick={() => (isMicActive ? stop() : start())}
          type="button"
        >
          {isMicActive ? "Stop microphone" : "React to my voice"}
        </button>
        <p className="text-muted-foreground text-xs">
          {status === "denied" &&
            "Microphone denied — using a simulated level."}
          {status === "unsupported" &&
            "Microphone unavailable in this browser."}
          {status === "requesting" && "Waiting for permission…"}
          {isMicActive && "Live microphone — try the listening state."}
          {status === "idle" &&
            "Amplitude is simulated until you enable the mic."}
        </p>
      </div>
    </div>
  );
};

export default Example;
