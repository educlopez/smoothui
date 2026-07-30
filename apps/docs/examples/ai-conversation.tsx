"use client";

import AIConversation from "@repo/smoothui/components/ai-conversation";
import AILoader from "@repo/smoothui/components/ai-loader";
import AIMessage from "@repo/smoothui/components/ai-message";
import AIReasoning from "@repo/smoothui/components/ai-reasoning";
import AIResponse from "@repo/smoothui/components/ai-response";
import AIToolCall from "@repo/smoothui/components/ai-tool-call";
import SiriOrb from "@repo/smoothui/components/siri-orb";
import { useEffect, useState } from "react";

const ANSWER =
  "Mint chip is up 12% on last summer, with the gain concentrated on weekends [1]. Rocky road is the one to retire — down 6% and the weakest of the classics [2].";

/**
 * Internal documents, so no url — the pills render as plain markers rather than
 * links that go nowhere. This is what retrieval over a company's own files
 * actually looks like.
 */
const CITATIONS = [
  { id: "1", index: 1, title: "Sales velocity export, 2026 Q2" },
  { id: "2", index: 2, title: "Flavour performance review" },
];

const STREAM_INTERVAL_MS = 45;
const THINK_MS = 1600;

const Example = () => {
  const [phase, setPhase] = useState<"thinking" | "streaming" | "done">(
    "thinking"
  );
  const [streamed, setStreamed] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => setPhase("streaming"), THINK_MS);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (phase !== "streaming") {
      return;
    }
    // Stand-in for a real token stream.
    const words = ANSWER.split(" ");
    let index = 0;
    const interval = setInterval(() => {
      index += 1;
      setStreamed(words.slice(0, index).join(" "));
      if (index >= words.length) {
        clearInterval(interval);
        setPhase("done");
      }
    }, STREAM_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [phase]);

  return (
    <div className="mx-auto flex h-[26rem] w-full max-w-xl flex-col p-4">
      <AIConversation className="flex-1" contentKey={streamed.length + phase}>
        <div className="flex flex-col gap-5 pb-2">
          <AIMessage from="user" timestamp="14:32">
            Compare mint chip to last summer and tell me which flavour to
            retire.
          </AIMessage>

          <AIMessage
            // The phase values are AIState values, so the orb takes it directly
            // and the whole message moves as one surface.
            avatar={<SiriOrb size="26px" state={phase} />}
            copyText={ANSWER}
            from="assistant"
            onRetry={() => {
              setStreamed("");
              setPhase("thinking");
            }}
            onVote={() => {
              // Demo only.
            }}
            timestamp="14:32"
          >
            <div className="flex flex-col gap-3">
              <AIReasoning isStreaming={phase === "thinking"}>
                Pulled three summers of mint chip sales, then compared weekend
                and weekday velocity before ranking the classics.
              </AIReasoning>

              <AIToolCall
                args={<code>{'{ "flavour": "mint-chip", "years": 3 }'}</code>}
                name="query_sales"
                result={<span>412 rows</span>}
                status={phase === "thinking" ? "running" : "success"}
                summary="3 summers"
              />

              {phase === "thinking" ? (
                <AILoader label="Thinking" showElapsed variant="dots" />
              ) : (
                <AIResponse
                  citations={CITATIONS}
                  isStreaming={phase === "streaming"}
                  text={streamed}
                />
              )}
            </div>
          </AIMessage>
        </div>
      </AIConversation>
    </div>
  );
};

export default Example;
