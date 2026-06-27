"use client";

import BottomUpLetters from "@repo/smoothui/components/bottom-up-letters";

const BottomUpLettersDemo = () => (
  <div className="flex min-h-[300px] flex-col items-center justify-center gap-6 text-center">
    <BottomUpLetters className="font-bold text-5xl tracking-tight">
      Design.
    </BottomUpLetters>
    <BottomUpLetters className="font-semibold text-3xl" delay={600}>
      Build.
    </BottomUpLetters>
  </div>
);

export default BottomUpLettersDemo;
