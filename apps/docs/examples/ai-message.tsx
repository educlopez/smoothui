"use client";

import AIMessage from "@repo/smoothui/components/ai-message";
import SiriOrb from "@repo/smoothui/components/siri-orb";

const ANSWER =
  "Rocky road is the one to retire — down 6% year on year and the weakest of the classics. Mint chip absorbs most of that volume on weekends.";

const Example = () => (
  <div className="mx-auto flex w-full max-w-xl flex-col gap-5 p-8">
    <AIMessage from="user" timestamp="14:31">
      Which flavour should we retire before Q4?
    </AIMessage>

    <AIMessage
      avatar={<SiriOrb size="26px" state="done" />}
      copyText={ANSWER}
      from="assistant"
      onRetry={() => {
        // Demo only.
      }}
      onVote={() => {
        // Demo only.
      }}
      timestamp="14:32"
    >
      {ANSWER}
    </AIMessage>

    <p className="text-center text-muted-foreground text-xs">
      Hover a message — or tab into it — to reveal its actions.
    </p>
  </div>
);

export default Example;
