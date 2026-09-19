"use client";

import MotionLoader, {
  MOTION_LOADER_VARIANTS,
} from "@repo/smoothui/components/motion-loader";

const LOADER_SIZE = 44;

export default function MotionLoaderDemo() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {MOTION_LOADER_VARIANTS.map((variant) => (
          <div
            className="flex flex-col items-center gap-3 rounded-2xl border border-foreground/20 bg-background p-5 text-foreground"
            key={variant}
          >
            <div className="flex h-14 items-center justify-center">
              <MotionLoader
                label={`Loading ${variant}`}
                size={LOADER_SIZE}
                variant={variant}
              />
            </div>
            <span className="text-muted-foreground text-xs">{variant}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-6 rounded-2xl border border-foreground/20 bg-background p-5">
        <span className="text-brand">
          <MotionLoader label="Loading brand" variant="comet" />
        </span>
        <MotionLoader
          className="text-muted-foreground"
          label="Loading small"
          size={20}
          variant="dot-ring"
        />
        <MotionLoader label="Loading fast" speed={2} variant="wave-bars" />
        <MotionLoader label="Loading large" size={64} variant="morph-ring" />
      </div>
    </div>
  );
}
