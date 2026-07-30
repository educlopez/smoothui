"use client";

import AILoader from "@repo/smoothui/components/ai-loader";

const Example = () => (
  <div className="flex flex-col items-start gap-6 p-8">
    {/* Side by side on purpose: the variants share one cycle length, so they
        stay in step with each other. */}
    <AILoader label="Thinking" variant="dots" />
    <AILoader label="Reading the export" variant="bar" />
    <AILoader label="Churning" showElapsed variant="grid" />
    <AILoader showElapsed variant="dots" />
  </div>
);

export default Example;
