"use client";

import GravityLetters from "@repo/smoothui/components/gravity-letters";

export default function GravityLettersDemo() {
  return (
    <div className="flex w-full flex-col items-center gap-8 px-4 py-8">
      <GravityLetters
        className="h-40 w-full max-w-xl font-bold text-5xl text-foreground"
        text="Gravity Letters"
        trigger="hover"
      />
      <p className="text-muted-foreground text-sm">
        Hover the headline above to watch it fall — move away to reform it.
      </p>
    </div>
  );
}
