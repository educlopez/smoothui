"use client";

import {
  AIBranch,
  AIBranchMessages,
  AIBranchNext,
  AIBranchPage,
  AIBranchPrevious,
  AIBranchSelector,
} from "@repo/smoothui/components/ai-branch";
import AIMessage from "@repo/smoothui/components/ai-message";
import SiriOrb from "@repo/smoothui/components/siri-orb";

/**
 * The branches hold real `AIMessage`s rather than hand-rolled bubbles, so the
 * two components share one design by construction instead of by copy-paste.
 */
const Example = () => (
  <AIBranch defaultBranch={0}>
    <AIBranchMessages>
      <div className="space-y-4">
        <AIMessage from="user">
          How do I implement authentication in Next.js?
        </AIMessage>

        <AIMessage
          avatar={<SiriOrb size="26px" state="done" />}
          copyText="Here are several approaches for implementing authentication in Next.js…"
          from="assistant"
        >
          Here are several approaches for implementing authentication in
          Next.js…
        </AIMessage>

        <AIBranchSelector from="assistant">
          <AIBranchPrevious />
          <AIBranchPage />
          <AIBranchNext />
        </AIBranchSelector>
      </div>

      <div className="space-y-4">
        <AIMessage from="user">
          What about using NextAuth.js specifically?
        </AIMessage>

        <AIMessage
          avatar={<SiriOrb size="26px" state="done" />}
          copyText="NextAuth.js is an excellent choice. Here's how to set it up…"
          from="assistant"
        >
          NextAuth.js is an excellent choice. Here's how to set it up…
        </AIMessage>

        <AIBranchSelector from="assistant">
          <AIBranchPrevious />
          <AIBranchPage />
          <AIBranchNext />
        </AIBranchSelector>
      </div>
    </AIBranchMessages>
  </AIBranch>
);

export default Example;
