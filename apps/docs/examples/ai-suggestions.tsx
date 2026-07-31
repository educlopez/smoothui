"use client";

import AIPromptInput from "@repo/smoothui/components/ai-prompt-input";
import AISuggestions, {
  type AISuggestion,
} from "@repo/smoothui/components/ai-suggestions";
import { useState } from "react";

const STARTERS: AISuggestion[] = [
  { id: "1", label: "Forecast summer demand" },
  { id: "2", label: "Find waffle cone suppliers" },
  { id: "3", label: "Compare seasonal flavours" },
  { id: "4", label: "Draft a launch plan" },
  { id: "5", label: "Check cold-chain status" },
];

const FOLLOW_UPS: AISuggestion[] = [
  { id: "a", label: "Which flavours sell best in winter?" },
  { id: "b", label: "Compare gelato and soft serve margins" },
];

const Example = () => {
  const [draft, setDraft] = useState("");
  const [showFollowUps, setShowFollowUps] = useState(false);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-5 p-8">
      <AISuggestions
        label={showFollowUps ? "Follow-ups" : "Start with"}
        onSelect={(suggestion) => setDraft(suggestion.label)}
        suggestions={showFollowUps ? FOLLOW_UPS : STARTERS}
      />

      {/* A chip press fills the composer — the suggestion becomes the draft
          instead of sending straight away, so it stays editable. */}
      <AIPromptInput
        onSubmit={() => {
          setDraft("");
          setShowFollowUps(true);
        }}
        onValueChange={setDraft}
        value={draft}
      />

      <button
        className="w-fit rounded-full border border-border px-3 py-1.5 text-muted-foreground text-xs transition-colors hover:text-foreground"
        onClick={() => setShowFollowUps((current) => !current)}
        type="button"
      >
        Swap the set
      </button>
    </div>
  );
};

export default Example;
