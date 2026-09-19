"use client";

import PagePreloader, {
  PAGE_PRELOADER_VARIANTS,
  type PagePreloaderVariant,
} from "@repo/smoothui/components/page-preloader";
import { useState } from "react";

const VARIANT_LABELS: Record<PagePreloaderVariant, string> = {
  curtain: "Curtain",
  pixel: "Pixel",
  stairs: "Stairs",
  words: "Words",
};

export default function PagePreloaderDemo() {
  const [variant, setVariant] = useState<PagePreloaderVariant>("curtain");
  const [runId, setRunId] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const handleReplay = () => {
    setIsPlaying(true);
    setRunId((id) => id + 1);
  };

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 py-8">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {PAGE_PRELOADER_VARIANTS.map((item) => (
          <button
            className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
              variant === item
                ? "border-brand bg-brand text-white"
                : "border-foreground/15 bg-background text-foreground hover:bg-foreground/5"
            }`}
            key={item}
            onClick={() => {
              setVariant(item);
              setRunId((id) => id + 1);
              setIsPlaying(true);
            }}
            type="button"
          >
            {VARIANT_LABELS[item]}
          </button>
        ))}
      </div>

      <div className="relative h-72 w-full overflow-hidden rounded-2xl border border-foreground/15">
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-muted p-6 text-center">
          <p className="font-semibold text-foreground text-sm">Page content</p>
          <p className="max-w-xs text-muted-foreground text-xs">
            This box represents your page. The preloader plays once inside it
            and then uncovers this content.
          </p>
        </div>

        <PagePreloader
          container
          duration={1400}
          key={runId}
          onComplete={() => setIsPlaying(false)}
          variant={variant}
        />
      </div>

      <button
        className="mx-auto rounded-full border border-foreground/15 bg-background px-4 py-2 text-foreground text-sm transition-colors hover:bg-foreground/5 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isPlaying}
        onClick={handleReplay}
        type="button"
      >
        Replay
      </button>
    </div>
  );
}
