"use client";

import AIDiff, { type AIDiffLine } from "@repo/smoothui/components/ai-diff";
import { useState } from "react";

const LINES: AIDiffLine[] = [
  { content: "export function getToken() {", kind: "context", number: 12 },
  { content: "  return localStorage.token;", kind: "removed", number: 13 },
  { content: '  const t = cookies.get("session");', kind: "added", number: 13 },
  {
    content: '  if (!t) throw new Error("no session");',
    kind: "added",
    number: 14,
  },
  { content: "  return t;", kind: "added", number: 15 },
  { content: "}", kind: "context", number: 16 },
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
