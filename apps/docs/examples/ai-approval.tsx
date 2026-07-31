"use client";

import AIApproval from "@repo/smoothui/components/ai-approval";
import { useState } from "react";

const Example = () => {
  const [runId, setRunId] = useState(0);

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4 p-8">
      <AIApproval
        key={runId}
        onDecide={() => {
          // Demo only.
        }}
        options={[
          { id: "three", label: "Three flavours", detail: "core line" },
          { id: "five", label: "Five flavours", detail: "full case" },
          { id: "one", label: "Just one hero" },
        ]}
        question="How many flavours should we launch?"
      >
        Cold-chain capacity covers five, but marketing has budget for three.
      </AIApproval>

      <AIApproval
        key={`destructive-${runId}`}
        options={[
          { id: "keep", label: "Keep the draft" },
          { id: "delete", label: "Delete all 412 rows", destructive: true },
        ]}
        question="Clear the staging table before the import?"
      />

      <button
        className="w-fit rounded-full border border-border px-3 py-1.5 text-muted-foreground text-xs transition-colors hover:text-foreground"
        onClick={() => setRunId((current) => current + 1)}
        type="button"
      >
        Ask again
      </button>
    </div>
  );
};

export default Example;
