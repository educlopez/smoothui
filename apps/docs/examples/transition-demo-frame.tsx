"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { ArrowRight } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { type ReactNode, useEffect, useRef, useState } from "react";

export type TransitionDemoScene = "editorial" | "subject" | "signal";

interface TransitionRenderProps {
  children: ReactNode;
  className: string;
  transitionKey: string;
}

interface TransitionDemoFrameProps {
  renderTransition: (props: TransitionRenderProps) => ReactNode;
  scene: TransitionDemoScene;
  toolbar?: ReactNode;
}

const AUTOPLAY_DELAY_MS = 640;
const STAGE_CLASS =
  "min-h-[22rem] w-full overflow-hidden rounded-2xl border border-black/10 shadow-custom";

const scenes = {
  editorial: [
    { id: "morning", label: "Morning" },
    { id: "night", label: "Night" },
  ],
  signal: [
    { id: "draft", label: "Draft" },
    { id: "published", label: "Published" },
  ],
  subject: [
    { id: "mark", label: "Mark" },
    { id: "seal", label: "Seal" },
  ],
} as const;

const controlClass =
  "rounded-full border px-2.5 py-1 font-medium text-xs shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const EditorialScene = ({ night }: { night: boolean }) => (
  <div
    className="grid min-h-[22rem] grid-cols-[minmax(0,1.4fr)_minmax(4.75rem,0.6fr)]"
    style={{
      background: night ? "#14120f" : "#f3eee6",
      color: night ? "#f6f1e8" : "#1a1612",
    }}
  >
    <div className="flex flex-col justify-between gap-8 p-8 sm:p-10">
      <p className="font-medium text-[11px] uppercase tracking-[0.22em] opacity-60">
        {night ? "Night edition" : "Morning edition"}
      </p>
      <h3 className="max-w-[10ch] text-balance font-semibold text-4xl tracking-[-0.045em] sm:text-6xl">
        {night ? "After dark." : "In print."}
      </h3>
      <p className="text-sm opacity-70">
        {night ? "Field notes from the coast" : "Issue 04 · The atlas"}
      </p>
    </div>
    <div
      aria-hidden="true"
      className="min-h-full"
      style={{ background: night ? "var(--color-brand)" : "#1a1612" }}
    />
  </div>
);

const SubjectScene = ({ night }: { night: boolean }) => (
  <div
    className="flex min-h-[22rem] flex-col items-center justify-center gap-6 px-8"
    style={{ background: night ? "#121016" : "#f7f4ef" }}
  >
    <div
      aria-hidden="true"
      className="size-40 rounded-full sm:size-48"
      style={{
        background: night ? "var(--color-brand)" : "#16141a",
        boxShadow: night
          ? "0 0 0 18px color-mix(in oklab, var(--color-brand) 22%, transparent)"
          : "0 0 0 18px rgb(22 20 26 / 0.06)",
      }}
    />
    <p
      className="font-medium text-lg tracking-[-0.03em]"
      style={{ color: night ? "#f6f1e8" : "#1a1612" }}
    >
      {night ? "Seal" : "Mark"}
    </p>
  </div>
);

const signalBars = {
  draft: [
    { color: "var(--color-brand)", width: "100%" },
    { color: "#1a1612", width: "68%" },
    { color: "#e2a15a", width: "42%" },
  ],
  published: [
    { color: "#7ddec8", width: "100%" },
    { color: "var(--color-brand)", width: "62%" },
    { color: "#f4efe6", width: "34%" },
  ],
} as const;

const SignalScene = ({ published }: { published: boolean }) => {
  const bars = published ? signalBars.published : signalBars.draft;

  return (
    <div
      className="flex min-h-[22rem] flex-col justify-between p-8 sm:p-10"
      style={{
        background: published ? "#0e1c24" : "#f4efe6",
        color: published ? "#f6f1e8" : "#1a1612",
      }}
    >
      <div className="flex items-start justify-between gap-6">
        <p className="font-medium text-[11px] uppercase tracking-[0.22em] opacity-60">
          {published ? "Published" : "Draft"}
        </p>
        <p className="font-semibold text-6xl tracking-[-0.05em] sm:text-7xl">
          {published ? "02" : "01"}
        </p>
      </div>
      <div
        className={cn(
          "flex flex-col gap-2",
          published ? "items-end" : "items-start"
        )}
      >
        {bars.map((bar) => (
          <div
            className="h-8 rounded-md"
            key={bar.color}
            style={{ background: bar.color, width: bar.width }}
          />
        ))}
      </div>
    </div>
  );
};

const SceneView = ({
  night,
  scene,
}: {
  night: boolean;
  scene: TransitionDemoScene;
}) => {
  if (scene === "editorial") {
    return <EditorialScene night={night} />;
  }
  if (scene === "subject") {
    return <SubjectScene night={night} />;
  }
  return <SignalScene published={night} />;
};

export const TransitionDemoFrame = ({
  renderTransition,
  scene,
  toolbar,
}: TransitionDemoFrameProps) => {
  const shouldReduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [hasAutoplayed, setHasAutoplayed] = useState(false);
  const states = scenes[scene];
  const current = states[index] ?? states[0];
  const next = states[(index + 1) % states.length] ?? states[0];

  useEffect(() => {
    if (shouldReduceMotion || hasAutoplayed) {
      return;
    }
    const node = rootRef.current;
    if (!node) {
      return;
    }

    let timer = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return;
        }
        observer.disconnect();
        timer = window.setTimeout(() => {
          setHasAutoplayed(true);
          setIndex(1);
        }, AUTOPLAY_DELAY_MS);
      },
      { threshold: 0.55 }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [hasAutoplayed, shouldReduceMotion]);

  const goTo = (nextIndex: number) => {
    setHasAutoplayed(true);
    setIndex(nextIndex);
  };

  return (
    <div
      className="flex w-full max-w-[720px] flex-col items-center gap-3"
      ref={rootRef}
    >
      {renderTransition({
        children: <SceneView night={index === 1} scene={scene} />,
        className: STAGE_CLASS,
        transitionKey: `${scene}-${current.id}`,
      })}
      {toolbar ? (
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {toolbar}
        </div>
      ) : null}
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {states.map((state, stateIndex) => (
          <button
            aria-pressed={index === stateIndex}
            className={cn(
              controlClass,
              index === stateIndex
                ? "border-brand bg-brand text-[#1a1612]"
                : "bg-background text-muted-foreground hover:bg-muted"
            )}
            key={state.id}
            onClick={() => goTo(stateIndex)}
            type="button"
          >
            {state.label}
          </button>
        ))}
        <button
          className={cn(
            controlClass,
            "inline-flex items-center gap-1.5 bg-background px-3 py-1.5 text-foreground hover:bg-muted"
          )}
          onClick={() => goTo((index + 1) % states.length)}
          type="button"
        >
          Show {next.label}
          <ArrowRight aria-hidden="true" className="size-3" />
        </button>
      </div>
    </div>
  );
};
