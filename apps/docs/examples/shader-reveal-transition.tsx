"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import ShaderRevealTransition, {
  type ShaderRevealVariant,
} from "@repo/smoothui/components/shader-reveal-transition";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

const VARIANTS: { label: string; value: ShaderRevealVariant }[] = [
  { label: "Noise", value: "noise" },
  { label: "Zoom", value: "zoom" },
  { label: "Circle", value: "circle" },
  { label: "Wipe", value: "wipe" },
  { label: "Luma", value: "luma" },
  { label: "Planetary", value: "planetary" },
  { label: "Stripes", value: "stripes" },
  { label: "Push", value: "push" },
];

const STATES = [
  {
    id: "dashboard",
    eyebrow: "Dashboard",
    title: "Revenue is ready to review.",
  },
  {
    id: "landing",
    eyebrow: "Landing",
    title: "The section has been published.",
  },
] as const;

const ShaderRevealTransitionDemo = () => {
  const [variant, setVariant] = useState<ShaderRevealVariant>("noise");
  const [index, setIndex] = useState(0);
  const current = STATES[index];

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <ShaderRevealTransition
        className="min-h-[320px] w-full max-w-[560px] rounded-2xl border bg-background text-foreground shadow-custom"
        transitionKey={current.id}
        variant={variant}
      >
        <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 p-8 text-center">
          <span className="font-medium text-brand text-xs uppercase tracking-wide">
            {current.eyebrow}
          </span>
          <h3 className="text-balance font-semibold text-2xl tracking-[-0.02em]">
            {current.title}
          </h3>
        </div>
      </ShaderRevealTransition>

      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {VARIANTS.map((item) => (
          <button
            aria-pressed={variant === item.value}
            className={cn(
              "rounded-full border px-2.5 py-1 font-medium text-xs shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              variant === item.value
                ? "border-brand bg-brand text-brand-foreground"
                : "bg-background text-muted-foreground hover:bg-muted"
            )}
            key={item.value}
            onClick={() => setVariant(item.value)}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>

      <button
        className="inline-flex items-center gap-1.5 rounded-full border bg-background px-4 py-2 font-medium text-sm shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        onClick={() => setIndex((value) => (value + 1) % STATES.length)}
        type="button"
      >
        Trigger transition
        <ArrowRight className="size-3.5" />
      </button>
    </div>
  );
};

export default ShaderRevealTransitionDemo;
