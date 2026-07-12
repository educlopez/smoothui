"use client";

import SmoothButton from "@repo/smoothui/components/smooth-button";
import { ArrowRight, Check, Heart, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

const VARIANTS = ["solid", "soft", "outline", "ghost"] as const;
const COLORS = [
  "accent",
  "neutral",
  "destructive",
  "blue",
  "amber",
  "green",
] as const;

export default function SmoothButtonDemo() {
  const [loading, setLoading] = useState(false);

  const runLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1600);
  };

  return (
    <div className="flex w-full flex-col gap-8">
      {/* Variant × color matrix — the decoupled axes */}
      <div className="flex flex-col gap-3">
        {VARIANTS.map((variant) => (
          <div className="flex flex-wrap items-center gap-2" key={variant}>
            {COLORS.map((color) => (
              <SmoothButton color={color} key={color} variant={variant}>
                {color}
              </SmoothButton>
            ))}
          </div>
        ))}
        <div className="flex flex-wrap items-center gap-2">
          <SmoothButton variant="candy">Candy</SmoothButton>
          <SmoothButton color="blue" variant="candy">
            Candy blue
          </SmoothButton>
          <SmoothButton color="green" variant="candy">
            Candy green
          </SmoothButton>
          <SmoothButton variant="link">Link</SmoothButton>
        </div>
      </div>

      {/* Sizes */}
      <div className="flex flex-wrap items-center gap-2">
        <SmoothButton size="xs" variant="solid">
          xs
        </SmoothButton>
        <SmoothButton size="sm" variant="solid">
          sm
        </SmoothButton>
        <SmoothButton size="default" variant="solid">
          default
        </SmoothButton>
        <SmoothButton size="lg" variant="solid">
          lg
        </SmoothButton>
        <SmoothButton size="icon" variant="solid">
          <Heart />
        </SmoothButton>
        <SmoothButton shape="pill" size="icon" variant="soft">
          <Plus />
        </SmoothButton>
      </div>

      {/* States + slots */}
      <div className="flex flex-wrap items-center gap-2">
        <SmoothButton loading={loading} onClick={runLoading} variant="candy">
          {loading ? "Saving" : "Click to load"}
        </SmoothButton>
        <SmoothButton disabled variant="solid">
          Disabled
        </SmoothButton>
        <SmoothButton color="green" prefix={<Check />} variant="soft">
          Saved
        </SmoothButton>
        <SmoothButton suffix={<ArrowRight />} variant="outline">
          Next
        </SmoothButton>
        <SmoothButton color="destructive" prefix={<Trash2 />} variant="ghost">
          Delete
        </SmoothButton>
        <SmoothButton shape="pill" variant="solid">
          Pill
        </SmoothButton>
      </div>
    </div>
  );
}
