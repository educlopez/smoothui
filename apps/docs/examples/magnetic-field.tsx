"use client";

import MagneticField, {
  type MagneticFieldMode,
} from "@repo/smoothui/components/magnetic-field";
import { useState } from "react";

const MODES: MagneticFieldMode[] = ["attract", "repel", "orbit"];

export default function MagneticFieldDemo() {
  const [mode, setMode] = useState<MagneticFieldMode>("attract");

  return (
    <div className="relative flex w-full max-w-2xl flex-col gap-6 overflow-hidden rounded-2xl border border-foreground/10 bg-background p-8">
      <div className="flex flex-wrap gap-2">
        {MODES.map((value) => (
          <button
            className={
              value === mode
                ? "rounded-md border border-brand bg-brand/10 px-3 py-1.5 text-brand text-xs capitalize"
                : "rounded-md border border-foreground/10 px-3 py-1.5 text-muted-foreground text-xs capitalize hover:bg-muted/60"
            }
            key={value}
            onClick={() => setMode(value)}
            type="button"
          >
            {value}
          </button>
        ))}
      </div>
      <MagneticField
        className="flex min-h-64 flex-wrap items-center justify-center gap-6"
        mode={mode}
        radius={140}
        rotate
        strength={0.4}
      >
        {["Design", "Motion", "Code", "Ship"].map((label) => (
          <div
            className="flex h-20 w-20 items-center justify-center rounded-2xl border border-foreground/10 bg-muted/40 font-medium text-sm"
            data-magnetic
            key={label}
          >
            {label}
          </div>
        ))}
      </MagneticField>
    </div>
  );
}
