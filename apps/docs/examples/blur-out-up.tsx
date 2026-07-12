"use client";

import BlurOutUp from "@repo/smoothui/components/blur-out-up";

const BlurOutUpDemo = () => (
  <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 text-center">
    <BlurOutUp className="font-bold text-4xl tracking-tight">
      Think different.
    </BlurOutUp>
    <BlurOutUp className="text-lg text-muted-foreground" delay={400}>
      Per-word blur reveal.
    </BlurOutUp>
  </div>
);

export default BlurOutUpDemo;
