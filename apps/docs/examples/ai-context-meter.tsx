"use client";

import AIContextMeter from "@repo/smoothui/components/ai-context-meter";
import { useEffect, useState } from "react";

const LIMIT = 200_000;
const STEP_MS = 900;
const STEP_TOKENS = 24_000;

const BREAKDOWN = [
  { label: "System prompt", tokens: 1800 },
  { label: "Attached files", tokens: 48_000 },
  { label: "Conversation", tokens: 96_000 },
];

const Example = () => {
  const [used, setUsed] = useState(32_000);

  useEffect(() => {
    const interval = setInterval(
      () =>
        setUsed((current) => (current + STEP_TOKENS) % (LIMIT + STEP_TOKENS)),
      STEP_MS
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-start gap-6 p-8">
      {/* Watch it cross 80% and 95% — the hue changes, the ring never grows. */}
      <AIContextMeter breakdown={BREAKDOWN} limit={LIMIT} used={used} />

      <div className="flex items-center gap-6">
        <AIContextMeter limit={LIMIT} used={40_000} />
        <AIContextMeter limit={LIMIT} used={170_000} />
        <AIContextMeter limit={LIMIT} used={196_000} />
      </div>
    </div>
  );
};

export default Example;
