"use client";

import AIDiff, { type AIDiffLine } from "@repo/smoothui/components/ai-diff";
import { useState } from "react";

const LINES: AIDiffLine[] = [
  { number: 12, kind: "context", content: "export function getToken() {" },
  { number: 13, kind: "removed", content: "  return localStorage.token;" },
  { number: 13, kind: "added", content: '  const t = cookies.get("session");' },
  {
    number: 14,
    kind: "added",
    content: '  if (!t) throw new Error("no session");',
  },
  { number: 15, kind: "added", content: "  return t;" },
  { number: 16, kind: "context", content: "}" },
];

const Example = () => {
  const [runId, setRunId] = useState(0);

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-4 p-8">
      <AIDiff
        key={runId}
        lines={LINES}
        onAccept={() => {
          // Demo only.
        }}
        onReject={() => {
          // Demo only.
        }}
        title="src/auth.ts"
      />

      <button
        className="w-fit rounded-full border border-border px-3 py-1.5 text-muted-foreground text-xs transition-colors hover:text-foreground"
        onClick={() => setRunId((current) => current + 1)}
        type="button"
      >
        Propose again
      </button>
    </div>
  );
};

export default Example;
