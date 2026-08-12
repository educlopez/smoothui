"use client";

import MorphIcon, {
  MORPH_ICON_VARIANTS,
} from "@repo/smoothui/components/morph-icon";
import { useState } from "react";

export default function MorphIconDemo() {
  const [activeMap, setActiveMap] = useState<Record<string, boolean>>({});

  const toggle = (variant: string) => {
    setActiveMap((previous) => ({
      ...previous,
      [variant]: !previous[variant],
    }));
  };

  return (
    <div className="grid grid-cols-2 gap-4 px-4 py-8 sm:grid-cols-4">
      {MORPH_ICON_VARIANTS.map((variant) => (
        <button
          className="flex flex-col items-center gap-2 rounded-xl border border-foreground/10 bg-background p-4 outline-none transition-colors hover:bg-foreground/5 focus-visible:ring-2 focus-visible:ring-brand"
          key={variant}
          onClick={() => toggle(variant)}
          type="button"
        >
          <MorphIcon
            active={Boolean(activeMap[variant])}
            label={variant}
            size={28}
            variant={variant}
          />
          <span className="text-muted-foreground text-xs capitalize">
            {variant}
          </span>
        </button>
      ))}
    </div>
  );
}
