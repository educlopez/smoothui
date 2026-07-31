"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import AIApproval from "@repo/smoothui/components/ai-approval";
import AIArtifact from "@repo/smoothui/components/ai-artifact";
import AIContextMeter from "@repo/smoothui/components/ai-context-meter";
import AIConversation from "@repo/smoothui/components/ai-conversation";
import type { AIState } from "@repo/smoothui/components/ai-core";
import AIDiff from "@repo/smoothui/components/ai-diff";
import AILoader from "@repo/smoothui/components/ai-loader";
import AIMessage from "@repo/smoothui/components/ai-message";
import AIPromptInput, {
  type AIPromptAttachment,
} from "@repo/smoothui/components/ai-prompt-input";
import AIReasoning from "@repo/smoothui/components/ai-reasoning";
import AIResponse from "@repo/smoothui/components/ai-response";
import AISources from "@repo/smoothui/components/ai-sources";
import AISuggestions from "@repo/smoothui/components/ai-suggestions";
import AITaskList from "@repo/smoothui/components/ai-task-list";
import AIToolCall from "@repo/smoothui/components/ai-tool-call";
import SiriOrb from "@repo/smoothui/components/siri-orb";
import { ChevronDown, PanelLeftOpen, Paperclip } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ATTACHABLE_FILES,
  type ChatTurn,
  CONTEXT_LIMIT,
  MODELS,
  SIMULATED_REPLY,
  STARTER_SUGGESTIONS,
} from "./chat-data";

const THINK_MS = 900;
const TOOL_MS = 1900;
const STREAM_INTERVAL_MS = 45;
/** Rough English ratio, good enough for a meter that is showing pressure. */
const CHARS_PER_TOKEN = 4;
const SYSTEM_TOKENS = 1800;
const TOKENS_PER_SOURCE = 9200;
const TOKENS_PER_ATTACHMENT = 6400;

type LivePhase = "idle" | "thinking" | "tool" | "streaming";

const formatClock = (date: Date) =>
  `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

export type ChatThreadProps = {
  className?: string;
  /** Opens the conversation list on narrow screens, where it has no column. */
  onOpenSidebar?: () => void;
  title: string;
  turns: ChatTurn[];
};

export const ChatThread = ({
  className,
  onOpenSidebar,
  title,
  turns,
}: ChatThreadProps) => {
  const [localTurns, setLocalTurns] = useState<ChatTurn[]>([]);
  const [phase, setPhase] = useState<LivePhase>("idle");
  const [streamed, setStreamed] = useState("");
  const [draftAttachments, setDraftAttachments] = useState<
    AIPromptAttachment[]
  >([]);
  const [model, setModel] = useState<string>(MODELS[0].label);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    for (const timer of timers.current) {
      clearTimeout(timer);
    }
    timers.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  useEffect(() => {
    if (phase !== "streaming") {
      return;
    }
    const words = SIMULATED_REPLY.text.split(" ");
    let index = 0;
    const interval = setInterval(() => {
      index += 1;
      setStreamed(words.slice(0, index).join(" "));
      if (index >= words.length) {
        clearInterval(interval);
        setPhase("idle");
        setLocalTurns((current) => [
          ...current,
          {
            citations: [...SIMULATED_REPLY.citations],
            from: "assistant",
            id: `live-a-${current.length}`,
            reasoning: SIMULATED_REPLY.reasoning,
            sources: [...SIMULATED_REPLY.sources],
            suggestions: [...SIMULATED_REPLY.suggestions],
            text: SIMULATED_REPLY.text,
            timestamp: formatClock(new Date()),
            tool: { ...SIMULATED_REPLY.tool },
          },
        ]);
        setStreamed("");
      }
    }, STREAM_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [phase]);

  const send = (value: string) => {
    const draft = value.trim();
    if (!draft || phase !== "idle") {
      return;
    }

    clearTimers();
    const attachments = draftAttachments;
    setDraftAttachments([]);
    setLocalTurns((current) => [
      ...current,
      {
        attachments: attachments.length > 0 ? attachments : undefined,
        from: "user",
        id: `live-u-${current.length}`,
        text: draft,
        timestamp: formatClock(new Date()),
      },
    ]);
    setPhase("thinking");
    // Stand-ins for a request's stages. No model runs here.
    timers.current.push(setTimeout(() => setPhase("tool"), THINK_MS));
    timers.current.push(setTimeout(() => setPhase("streaming"), TOOL_MS));
  };

  const stop = () => {
    clearTimers();
    setPhase("idle");
    setStreamed("");
  };

  // Memoised because the token breakdown below depends on it; a fresh array each
  // render would make that memo pointless.
  const allTurns = useMemo(
    () => [...turns, ...localTurns],
    [turns, localTurns]
  );
  const isBusy = phase !== "idle";
  const state: AIState = phase === "streaming" ? "streaming" : "thinking";
  // Derived from what is actually on screen, so an empty chat reads as empty
  // instead of inheriting a fixture's 67k. A fixed number here was a lie the
  // moment you pressed "New chat".
  const breakdown = useMemo(() => {
    // Everything the model would actually have been sent, not just the prose:
    // a reasoning trace and an artifact's source are the bulk of a real turn.
    const transcript =
      allTurns.reduce((total, turn) => {
        if (turn.from === "user") {
          return total + turn.text.length;
        }
        return (
          total +
          (turn.text?.length ?? 0) +
          (turn.reasoning?.length ?? 0) +
          (turn.artifact?.code.length ?? 0) +
          (turn.tool ? turn.tool.args.length + turn.tool.result.length : 0) +
          (turn.diff?.lines.reduce(
            (chars, line) => chars + line.content.length,
            0
          ) ?? 0)
        );
      }, 0) / CHARS_PER_TOKEN;
    const retrieved = allTurns.reduce(
      (total, turn) =>
        total +
        (turn.from === "assistant" && turn.sources
          ? turn.sources.length * TOKENS_PER_SOURCE
          : 0) +
        (turn.from === "user" && turn.attachments
          ? turn.attachments.length * TOKENS_PER_ATTACHMENT
          : 0),
      0
    );

    return [
      { label: "System", tokens: SYSTEM_TOKENS },
      {
        label: "Transcript",
        tokens: Math.round(transcript + streamed.length / CHARS_PER_TOKEN),
      },
      ...(retrieved > 0
        ? [{ label: "Retrieved files", tokens: retrieved }]
        : []),
    ];
  }, [allTurns, streamed]);

  const used = breakdown.reduce((total, item) => total + item.tokens, 0);

  return (
    <section className={cn("flex min-w-0 flex-1 flex-col", className)}>
      <header className="flex items-center gap-3 border-border/60 border-b px-4 py-2.5">
        {/* The only way into the conversation list on a phone, where the sidebar
            has no column of its own. */}
        {onOpenSidebar && (
          <button
            aria-label="Open conversations"
            className="-ml-1 flex cursor-pointer items-center rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
            onClick={onOpenSidebar}
            type="button"
          >
            <PanelLeftOpen aria-hidden="true" size={16} />
          </button>
        )}
        <h2 className="min-w-0 flex-1 truncate font-medium text-sm">{title}</h2>
        <AIContextMeter
          breakdown={breakdown}
          limit={CONTEXT_LIMIT}
          used={used}
        />
      </header>

      <AIConversation
        className="flex-1 px-4"
        contentKey={`${allTurns.length}-${streamed.length}-${phase}`}
      >
        {/* `px-2`, not decoration: the scroller clips at its padding box, and the
              orb avatar sat flush against that edge — its glow extends past its
              own 26px box, so the left of it was being shaved off. */}
        <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col gap-5 px-2 py-5">
          {allTurns.length === 0 && (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 py-10 text-center">
              <SiriOrb size="64px" state="idle" />
              <p className="text-muted-foreground text-sm">
                Ask about sales, stores or staffing.
              </p>
              <AISuggestions
                onSelect={(suggestion) => send(suggestion.label)}
                suggestions={STARTER_SUGGESTIONS}
              />
            </div>
          )}

          {allTurns.map((turn) => (
            <ChatTurnView key={turn.id} onSuggestion={send} turn={turn} />
          ))}

          {isBusy && (
            <AIMessage
              avatar={<SiriOrb size="26px" state={state} />}
              bubble={false}
              from="assistant"
            >
              <div className="flex flex-col gap-3">
                <AIReasoning collapseWhenDone isStreaming>
                  {SIMULATED_REPLY.reasoning}
                </AIReasoning>

                {phase !== "thinking" && (
                  <AIToolCall
                    args={<code>{SIMULATED_REPLY.tool.args}</code>}
                    name={SIMULATED_REPLY.tool.name}
                    result={<span>{SIMULATED_REPLY.tool.result}</span>}
                    status={phase === "tool" ? "running" : "success"}
                    summary={SIMULATED_REPLY.tool.summary}
                  />
                )}

                {phase === "streaming" ? (
                  <AIResponse
                    citations={[...SIMULATED_REPLY.citations]}
                    isStreaming
                    text={streamed}
                  />
                ) : (
                  <AILoader label="Thinking" showElapsed variant="dots" />
                )}
              </div>
            </AIMessage>
          )}
        </div>
      </AIConversation>

      <div className="border-border/60 border-t px-4 py-3">
        <div className="mx-auto w-full max-w-2xl">
          <AIPromptInput
            attachments={draftAttachments}
            maxLength={2000}
            onAttach={() => {
              // Stands in for a file dialog: adds the next unattached file, so
              // the control does something real instead of miming it.
              setDraftAttachments((current) => {
                const next = ATTACHABLE_FILES.find(
                  (file) => !current.some((item) => item.id === file.id)
                );
                return next ? [...current, next] : current;
              });
            }}
            onRemoveAttachment={(id) =>
              setDraftAttachments((current) =>
                current.filter((file) => file.id !== id)
              )
            }
            onStop={stop}
            onSubmit={send}
            placeholder="Ask anything about the shop…"
            state={isBusy ? "streaming" : "idle"}
          >
            <ModelPicker onSelect={setModel} value={model} />
          </AIPromptInput>
          <p className="pt-2 text-center text-muted-foreground text-xs">
            Simulated responses. Nothing is sent anywhere.
          </p>
        </div>
      </div>
    </section>
  );
};

/**
 * One transcript turn.
 *
 * Every assistant part is optional and rendered in the order an agent produces
 * it: thinking, tools, plan, changes, artifact, prose, then what it read. New AI
 * components slot in as one more branch here.
 */
const ChatTurnView = ({
  onSuggestion,
  turn,
}: {
  onSuggestion: (value: string) => void;
  turn: ChatTurn;
}) => {
  if (turn.from === "user") {
    return (
      <AIMessage copyText={turn.text} from="user" timestamp={turn.timestamp}>
        <span className="flex flex-col gap-2">
          {turn.text}
          {turn.attachments && turn.attachments.length > 0 && (
            <span className="flex flex-wrap justify-end gap-1.5">
              {turn.attachments.map((file) => (
                <span
                  className="flex items-center gap-1.5 rounded-lg bg-background/15 px-2 py-1 text-xs"
                  key={file.id}
                >
                  <Paperclip aria-hidden="true" size={11} />
                  {file.name}
                  <span className="opacity-70">{formatBytes(file.size)}</span>
                </span>
              ))}
            </span>
          )}
        </span>
      </AIMessage>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <AIMessage
        avatar={<SiriOrb size="26px" state="done" />}
        bubble={false}
        copyText={turn.text}
        from="assistant"
        onRetry={() => {
          // A replayed transcript has nothing to retry against.
        }}
        onVote={() => {
          // Demo only — no telemetry leaves the page.
        }}
        timestamp={turn.timestamp}
      >
        <div className="flex flex-col gap-3">
          {turn.reasoning && (
            <AIReasoning collapseWhenDone duration={4}>
              {turn.reasoning}
            </AIReasoning>
          )}

          {turn.tool && (
            <AIToolCall
              args={<code>{turn.tool.args}</code>}
              name={turn.tool.name}
              result={<span>{turn.tool.result}</span>}
              status="success"
              summary={turn.tool.summary}
            />
          )}

          {turn.tasks && (
            <AITaskList label={turn.tasks.label} tasks={turn.tasks.tasks} />
          )}

          {turn.diff && (
            <AIDiff lines={turn.diff.lines} title={turn.diff.title} />
          )}

          {turn.artifact && (
            <AIArtifact
              code={
                <pre className="whitespace-pre-wrap">{turn.artifact.code}</pre>
              }
              copyText={turn.artifact.code}
              preview={<SummerBannerPreview />}
              title={turn.artifact.title}
            />
          )}

          {turn.text && (
            <AIResponse citations={turn.citations} text={turn.text} />
          )}

          {turn.sources && <AISources sources={turn.sources} />}
        </div>
      </AIMessage>

      {turn.approval && (
        <AIApproval
          onDecide={() => {
            // Demo only.
          }}
          options={turn.approval.options}
          question={turn.approval.question}
        />
      )}

      {turn.suggestions && (
        <AISuggestions
          label="Follow-ups"
          onSelect={(suggestion) => onSuggestion(suggestion.label)}
          suggestions={turn.suggestions}
        />
      )}
    </div>
  );
};

const KIB = 1024;
const MIB = KIB * KIB;

const formatBytes = (size?: number) => {
  if (!size) {
    return "";
  }
  return size >= MIB
    ? `${(size / MIB).toFixed(1)} MB`
    : `${Math.round(size / KIB)} KB`;
};

/**
 * Model picker for the composer.
 *
 * Small enough to keep local: the template should not drag a popover library in
 * for one menu, and the pattern is the same one the sidebar's account menu uses.
 */
const ModelPicker = ({
  onSelect,
  value,
}: {
  onSelect: (label: string) => void;
  value: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-muted-foreground text-xs transition-colors hover:bg-muted hover:text-foreground"
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        {value}
        <ChevronDown aria-hidden="true" size={12} />
      </button>

      {isOpen && (
        <div
          className="absolute bottom-full left-0 z-10 mb-2 w-52 overflow-hidden rounded-xl border border-border/60 bg-background p-1 shadow-black/10 shadow-lg"
          role="menu"
        >
          {MODELS.map((option) => (
            <button
              className={cn(
                "flex w-full flex-col rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-muted",
                option.label === value
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
              key={option.id}
              onClick={() => {
                onSelect(option.label);
                setIsOpen(false);
              }}
              role="menuitem"
              type="button"
            >
              <span className="text-sm">{option.label}</span>
              <span className="text-muted-foreground text-xs">
                {option.note}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/** The artifact's rendered pane — the real banner, not a grey box. */
const SummerBannerPreview = () => (
  <section className="rounded-2xl bg-gradient-to-br from-pink-200 to-sky-200 p-6 text-neutral-900">
    <p className="text-[0.65rem] uppercase tracking-widest">Summer 2026</p>
    <h3 className="mt-1.5 font-semibold text-2xl">Two scoops, one price</h3>
    <p className="mt-2 max-w-sm text-sm">
      Every weekday before 5pm, all summer.
    </p>
  </section>
);

export default ChatThread;
