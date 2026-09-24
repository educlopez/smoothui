"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import ShaderRevealTransition, {
  type ShaderRevealVariant,
} from "@repo/smoothui/components/shader-reveal-transition";
import { useState } from "react";
import { TransitionDemoFrame } from "./transition-demo-frame";

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

const chipClass =
  "rounded-full border px-2.5 py-1 font-medium text-xs shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const ShaderRevealTransitionDemo = () => {
  const [variant, setVariant] = useState<ShaderRevealVariant>("noise");

  return (
    <TransitionDemoFrame
      renderTransition={({ children, className, transitionKey }) => (
        <ShaderRevealTransition
          className={className}
          transitionKey={transitionKey}
          variant={variant}
        >
          {children}
        </ShaderRevealTransition>
      )}
      scene="editorial"
      toolbar={VARIANTS.map((item) => (
        <button
          aria-pressed={variant === item.value}
          className={cn(
            chipClass,
            variant === item.value
              ? "border-brand bg-brand text-[#1a1612]"
              : "bg-background text-muted-foreground hover:bg-muted"
          )}
          key={item.value}
          onClick={() => setVariant(item.value)}
          type="button"
        >
          {item.label}
        </button>
      ))}
    />
  );
};

export default ShaderRevealTransitionDemo;
