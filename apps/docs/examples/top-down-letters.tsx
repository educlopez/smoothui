"use client";

import TopDownLetters from "@repo/smoothui/components/top-down-letters";

const TopDownLettersDemo = () => (
  <div className="flex min-h-[300px] flex-col items-center justify-center gap-6 text-center">
    <TopDownLetters className="font-bold text-5xl tracking-tight">
      Create.
    </TopDownLetters>
    <TopDownLetters className="font-semibold text-3xl" delay={600}>
      Ship.
    </TopDownLetters>
  </div>
);

export default TopDownLettersDemo;
