"use client";

import type { AIState } from "@repo/smoothui/components/ai-core";
import AIPromptInput, {
  type AIPromptAttachment,
} from "@repo/smoothui/components/ai-prompt-input";
import SiriOrb from "@repo/smoothui/components/siri-orb";
import { useState } from "react";

const SAMPLE_ATTACHMENTS: AIPromptAttachment[] = [
  { id: "1", name: "sales-velocity.csv", size: 24_600 },
  { id: "2", name: "onboarding-sop.pdf", size: 1_248_000 },
];

const STREAM_MS = 2600;

const Example = () => {
  const [state, setState] = useState<AIState>("idle");
  const [attachments, setAttachments] =
    useState<AIPromptAttachment[]>(SAMPLE_ATTACHMENTS);
  const [lastSent, setLastSent] = useState<string | null>(null);

  const handleSubmit = (value: string) => {
    setLastSent(value);
    setState("streaming");
    // Stand-in for a real request so the stop control is reachable.
    setTimeout(() => setState("done"), STREAM_MS);
  };

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4 p-8">
      <div className="flex items-center gap-3">
        <SiriOrb size="30px" state={state} />
        <span className="text-muted-foreground text-xs capitalize">
          {state}
        </span>
      </div>

      <AIPromptInput
        attachments={attachments}
        maxLength={280}
        onAttach={() => setAttachments(SAMPLE_ATTACHMENTS)}
        onRemoveAttachment={(id) =>
          setAttachments((current) => current.filter((a) => a.id !== id))
        }
        onStop={() => setState("idle")}
        onSubmit={handleSubmit}
        state={state}
      >
        <button
          className="rounded-lg px-2 py-1.5 text-muted-foreground text-xs transition-colors hover:bg-muted hover:text-foreground"
          type="button"
        >
          Opus 5
        </button>
      </AIPromptInput>

      <p className="text-muted-foreground text-xs">
        {lastSent
          ? `Sent: “${lastSent}”`
          : "Type and press Enter. Shift+Enter breaks the line."}
      </p>
    </div>
  );
};

export default Example;
