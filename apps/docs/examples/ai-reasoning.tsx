"use client";

import AIReasoning from "@repo/smoothui/components/ai-reasoning";
import { useEffect, useState } from "react";

const THINK_MS = 2800;

const Example = () => {
  const [isStreaming, setIsStreaming] = useState(true);
  const [runId, setRunId] = useState(0);

  useEffect(() => {
    setIsStreaming(true);
    const timeout = setTimeout(() => setIsStreaming(false), THINK_MS);
    return () => clearTimeout(timeout);
  }, [runId]);

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 p-8">
      {/* Watch it shimmer while working, then settle, report the duration and
          collapse itself. */}
      <AIReasoning isStreaming={isStreaming} key={runId}>
        <p>
          The request compares two summers, so the first step is pulling sales
          for both windows rather than a single range.
        </p>
        <p className="mt-2">
          Weekend and weekday velocity move differently for novelty flavours, so
          they need splitting before anything is ranked.
        </p>
      </AIReasoning>

      <AIReasoning collapseWhenDone={false} defaultOpen duration={4.2}>
        A settled trace that stays open, for when the reasoning is the content
        rather than scaffolding.
      </AIReasoning>

      <button
        className="w-fit rounded-full border border-border px-3 py-1.5 text-muted-foreground text-xs transition-colors hover:text-foreground"
        onClick={() => setRunId((current) => current + 1)}
        type="button"
      >
        Think again
      </button>
    </div>
  );
};

export default Example;
