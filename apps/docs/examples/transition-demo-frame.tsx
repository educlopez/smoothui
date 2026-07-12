"use client";

import { ArrowRight, Check, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";

interface TransitionRenderProps {
  children: ReactNode;
  className: string;
  transitionKey: string;
}

interface TransitionDemoFrameProps {
  description: string;
  renderTransition: (props: TransitionRenderProps) => ReactNode;
  title: string;
}

const states = [
  {
    id: "dashboard",
    eyebrow: "Dashboard",
    title: "Revenue is ready to review.",
    description: "A quiet frame for state changes inside product surfaces.",
    primary: "$42.8k",
    secondary: "+12.4%",
    rows: ["MRR", "Activation", "Retention"],
    bars: [72, 48, 84],
  },
  {
    id: "landing",
    eyebrow: "Landing",
    title: "The section has been published.",
    description:
      "A minimal marketing block with just enough structure to read through the shader.",
    primary: "18.2k",
    secondary: "visitors",
    rows: ["Hero", "Pricing", "Proof"],
    bars: [58, 76, 39],
  },
] as const;

export function TransitionDemoFrame({
  description,
  renderTransition,
  title,
}: TransitionDemoFrameProps) {
  const [index, setIndex] = useState(0);
  const current = states[index];

  return renderTransition({
    className:
      "min-h-[420px] w-full rounded-none border-0 bg-background text-foreground shadow-none sm:rounded-2xl sm:border sm:shadow-custom",
    transitionKey: current.id,
    children: (
      <div className="relative min-h-[420px] overflow-hidden bg-background p-4 text-foreground sm:p-6">
        <div className="mx-auto flex min-h-[372px] w-full max-w-[720px] flex-col overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm">
          <div className="flex h-12 items-center justify-between border-b bg-muted/25 px-4 backdrop-blur-sm">
            <div aria-hidden="true" className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-brand" />
              <span className="size-2 rounded-full bg-brand/45" />
              <span className="size-2 rounded-full bg-muted-foreground/30" />
            </div>
            <span className="font-medium text-[11px] text-muted-foreground">
              smoothui.dev/preview
            </span>
            <button
              className="inline-flex items-center gap-1 rounded-full border bg-background/80 px-2.5 py-1 font-medium text-[11px] text-foreground shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              onClick={() => setIndex((value) => (value + 1) % states.length)}
              type="button"
            >
              Transition
              <ArrowRight className="size-3" />
            </button>
          </div>

          <main className="grid flex-1 grid-cols-[1fr_210px] gap-6 p-6 max-sm:grid-cols-1 sm:p-8">
            <section className="flex min-w-0 flex-col justify-between">
              <div>
                <div className="mb-7 inline-flex items-center gap-2 rounded-full border bg-background/70 px-2.5 py-1 text-[12px] text-muted-foreground shadow-sm">
                  <Sparkles className="size-3 text-brand" />
                  {current.eyebrow}
                </div>
                <p className="mb-2 font-medium text-brand text-sm">{title}</p>
                <h3 className="max-w-md text-balance font-semibold text-2xl tracking-[-0.03em] sm:text-3xl">
                  {current.title}
                </h3>
                <p className="mt-3 max-w-md text-muted-foreground text-sm leading-6">
                  {description || current.description}
                </p>
              </div>

              <div className="mt-8 grid max-w-md grid-cols-3 gap-2">
                {current.rows.map((row, rowIndex) => (
                  <div className="rounded-xl border bg-muted/20 p-3" key={row}>
                    <div className="mb-2 flex items-center gap-1.5 text-muted-foreground text-xs">
                      <Check className="size-3 text-brand" />
                      {row}
                    </div>
                    <div className="h-1.5 rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-brand/70"
                        style={{ width: `${current.bars[rowIndex]}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <aside className="flex flex-col justify-between rounded-2xl border bg-muted/20 p-4">
              <div>
                <p className="text-muted-foreground text-xs">Signal</p>
                <div className="mt-2 font-semibold text-4xl tracking-[-0.04em]">
                  {current.primary}
                </div>
                <p className="mt-1 text-muted-foreground text-xs">
                  {current.secondary}
                </p>
              </div>
              <div className="mt-8 space-y-2">
                <div className="h-16 rounded-xl border bg-background/70" />
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-10 rounded-lg bg-brand/15" />
                  <div className="h-10 rounded-lg bg-muted" />
                  <div className="h-10 rounded-lg bg-muted" />
                </div>
              </div>
            </aside>
          </main>
        </div>
      </div>
    ),
  });
}
