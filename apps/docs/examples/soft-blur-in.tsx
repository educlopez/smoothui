"use client";

import SoftBlurIn from "@repo/smoothui/components/soft-blur-in";

const SoftBlurInDemo = () => (
  <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 text-center">
    <SoftBlurIn className="font-bold text-4xl tracking-tight">
      Think different.
    </SoftBlurIn>
    <SoftBlurIn className="text-lg text-muted-foreground" delay={400}>
      Per-character blur reveal.
    </SoftBlurIn>
  </div>
);

export default SoftBlurInDemo;
