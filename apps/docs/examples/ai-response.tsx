"use client";

import AIResponse from "@repo/smoothui/components/ai-response";
import { useEffect, useState } from "react";

const TEXT =
  "Transformers scale well with data and compute [1], though attention is quadratic in sequence length [2]. In practice that means the context window is the first thing to budget for.";

const CITATIONS = [
  {
    id: "1",
    index: 1,
    title: "Attention Is All You Need",
    url: "https://arxiv.org/abs/1706.03762",
  },
  {
    id: "2",
    index: 2,
    title: "Efficient Transformers: A Survey",
    url: "https://arxiv.org/abs/2009.06732",
  },
];

const INTERVAL_MS = 55;

const Example = () => {
  const [text, setText] = useState("");
  const [runId, setRunId] = useState(0);

  useEffect(() => {
    setText("");
    const words = TEXT.split(" ");
    let index = 0;
    const interval = setInterval(() => {
      index += 1;
      setText(words.slice(0, index).join(" "));
      if (index >= words.length) {
        clearInterval(interval);
      }
    }, INTERVAL_MS);
    return () => clearInterval(interval);
  }, [runId]);

  const isStreaming = text.split(" ").length < TEXT.split(" ").length;

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-4 p-8">
      <AIResponse citations={CITATIONS} isStreaming={isStreaming} text={text} />

      <button
        className="w-fit rounded-full border border-border px-3 py-1.5 text-muted-foreground text-xs transition-colors hover:text-foreground"
        onClick={() => setRunId((current) => current + 1)}
        type="button"
      >
        Replay stream
      </button>
    </div>
  );
};

export default Example;
