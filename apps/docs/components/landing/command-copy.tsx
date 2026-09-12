"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CommandCopy() {
  const [result, setResult] = useState<"idle" | "copied" | "error">("idle");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText("npx shadcn add @smoothui/siri-orb");
      setResult("copied");
    } catch {
      setResult("error");
    }
  };
  return (
    <div className="relative inline-flex">
      <button
        aria-label="Copy example command"
        className="flex min-h-11 min-w-11 items-center justify-center rounded-lg px-2 text-xs hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
        onClick={copy}
        type="button"
      >
        {result === "copied" ? (
          <Check aria-hidden size={15} className="text-brand" />
        ) : (
          <Copy aria-hidden size={15} />
        )}
      </button>
      <span className="sr-only" role="status">
        {result === "copied" ? "Command copied." : null}
        {result === "error"
          ? "Copy failed. Try again or select the command manually."
          : null}
      </span>
      {result === "error" ? (
        <span className="absolute top-full right-0 z-10 w-40 rounded border bg-background p-2 text-xs">
          Copy unavailable. Try again.
        </span>
      ) : null}
    </div>
  );
}
