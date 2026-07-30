"use client";

import AIToolCall, {
  type AIToolCallStatus,
} from "@repo/smoothui/components/ai-tool-call";
import { useEffect, useState } from "react";

const SEQUENCE: AIToolCallStatus[] = ["pending", "running", "success", "error"];
const STEP_MS = 2000;

const Example = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setIndex((current) => (current + 1) % SEQUENCE.length),
      STEP_MS
    );
    return () => clearInterval(interval);
  }, []);

  const status = SEQUENCE[index] ?? "pending";

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 p-8">
      {/* One ring evolving through the whole lifecycle — it never unmounts, so
          the eye follows a single object rather than icons swapping. */}
      <AIToolCall
        args={
          <code>{'{ "query": "JWT auth vulnerabilities", "limit": 5 }'}</code>
        }
        defaultOpen
        name="search_web"
        result={
          <ul className="list-none space-y-1">
            <li>auth0.com — JWT verification best practices</li>
            <li>owasp.org — Node.js authentication guide</li>
            <li>portswigger.net — JWT attacks</li>
          </ul>
        }
        status={status}
        summary="3 sources"
      />

      <p className="text-center text-muted-foreground text-xs capitalize">
        {status}
      </p>

      <div className="flex flex-col gap-2">
        {/* Without args or result it collapses to a plain status row. */}
        <AIToolCall name="read_file" status="success" summary="1.2s" />
        <AIToolCall name="run_tests" status="error" summary="2 failed" />
        <AIToolCall name="deploy" status="pending" summary="queued" />
      </div>
    </div>
  );
};

export default Example;
