"use client";

import {
  AIBranch,
  AIBranchMessages,
  AIBranchNext,
  AIBranchPage,
  AIBranchPrevious,
  AIBranchSelector,
} from "@repo/smoothui/components/ai-branch";

const Example = () => (
  <AIBranch defaultBranch={0}>
    <AIBranchMessages>
      <div className="space-y-4">
        {/* User Message */}
        <div className="flex justify-end">
          <div className="max-w-[80%] rounded-lg bg-brand p-3 text-white">
            <p className="text-sm">
              How do I implement authentication in Next.js?
            </p>
          </div>
        </div>

        {/* AI Response */}
        <div className="flex justify-start">
          <div className="max-w-[80%] rounded-lg border border-brand/30 bg-brand/10 p-3">
            <p className="text-gray-900 text-sm dark:text-gray-100">
              Here are several approaches for implementing authentication in
              Next.js...
            </p>
          </div>
        </div>

        {/* Branch Selector */}
        <AIBranchSelector from="assistant">
          <AIBranchPrevious />
          <AIBranchPage />
          <AIBranchNext />
        </AIBranchSelector>
      </div>

      <div className="space-y-4">
        {/* Alternative User Message */}
        <div className="flex justify-end">
          <div className="max-w-[80%] rounded-lg bg-brand p-3 text-white">
            <p className="text-sm">
              What about using NextAuth.js specifically?
            </p>
          </div>
        </div>

        {/* Alternative AI Response */}
        <div className="flex justify-start">
          <div className="max-w-[80%] rounded-lg border border-brand/30 bg-brand/10 p-3">
            <p className="text-gray-900 text-sm dark:text-gray-100">
              NextAuth.js is an excellent choice! Here's how to set it up...
            </p>
          </div>
        </div>

        {/* Branch Selector */}
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
