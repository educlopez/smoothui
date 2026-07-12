"use client";

import FocusBlurResolve from "@repo/smoothui/components/focus-blur-resolve";

const FocusBlurResolveDemo = () => (
  <div className="flex min-h-[300px] flex-col items-center justify-center gap-6 text-center">
    <FocusBlurResolve className="font-bold text-5xl tracking-tight">
      Clarity from chaos.
    </FocusBlurResolve>
    <FocusBlurResolve className="text-lg text-muted-foreground" delay={400}>
      Focus pull from heavy blur to crisp.
    </FocusBlurResolve>
  </div>
);

export default FocusBlurResolveDemo;
