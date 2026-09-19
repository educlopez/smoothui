"use client";

import type { TerminalLine } from "@repo/smoothui/components/mac-terminal";
import MacTerminal from "@repo/smoothui/components/mac-terminal";

const DEMO_LINES: TerminalLine[] = [
  { id: "1", text: "pnpm add @smoothui/mac-terminal", type: "command" },
  { id: "2", text: "Resolving dependencies...", type: "output" },
  {
    id: "3",
    text: "+ @smoothui/mac-terminal 1.0.0",
    type: "success",
  },
  { delay: 400, id: "4", text: "pnpm dev", type: "command" },
  {
    id: "5",
    text: "▲ Next.js ready in 412ms",
    type: "output",
  },
  {
    id: "6",
    text: "# hot reload is watching for changes",
    type: "comment",
  },
  {
    delay: 400,
    id: "7",
    text: "Error: cannot find module 'left-pad'",
    type: "error",
  },
  {
    id: "8",
    text: "✓ compiled successfully",
    type: "success",
  },
];

export default function MacTerminalDemo() {
  return (
    <div className="mx-auto w-full max-w-xl px-4 py-8">
      <MacTerminal
        lines={DEMO_LINES}
        loop
        title="~/smoothui"
        typingSpeed={26}
      />
    </div>
  );
}
