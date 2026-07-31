"use client";

import AIArtifact from "@repo/smoothui/components/ai-artifact";

const CODE = `export const clamp = (n: number, min: number, max: number) =>
  Math.min(Math.max(n, min), max);

export const sum = (a: number, b: number) => a + b;`;

const Example = () => (
  <div className="mx-auto w-full max-w-lg p-8">
    {/* Switch panes — preview always sits to the left of code, so the swap has a
        direction you can learn. */}
    <AIArtifact
      code={CODE}
      copyText={CODE}
      preview={
        <div className="flex flex-col gap-2 text-sm">
          <p className="text-foreground">
            <code className="font-mono text-xs">clamp(12, 0, 10)</code> → 10
          </p>
          <p className="text-foreground">
            <code className="font-mono text-xs">sum(2, 3)</code> → 5
          </p>
        </div>
      }
      title="utils.ts"
    />
  </div>
);

export default Example;
