"use client";

import CodeBlock from "@repo/smoothui/components/code-block";

const SNIPPET = `import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);

  // Increment on click
  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}`;

const INSTALL_SNIPPET = `pnpm add motion
npx shadcn@latest add @smoothui/code-block`;

export default function CodeBlockDemo() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8">
      <CodeBlock
        code={SNIPPET}
        filename="counter.tsx"
        highlightLines={[7]}
        language="tsx"
      />

      <CodeBlock
        code={SNIPPET}
        filename="counter.tsx (typing)"
        language="tsx"
        typing
        typingSpeed={60}
      />

      <CodeBlock
        code={INSTALL_SNIPPET}
        language="bash"
        showLineNumbers={false}
      />
    </div>
  );
}
