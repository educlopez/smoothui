"use client";

import ScaleDownFade from "@repo/smoothui/components/scale-down-fade";

const ScaleDownFadeDemo = () => (
  <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 text-center">
    <ScaleDownFade className="font-bold text-4xl tracking-tight">
      Polished.
    </ScaleDownFade>
    <ScaleDownFade className="text-lg text-muted-foreground" delay={300}>
      Subtle premium settle-in.
    </ScaleDownFade>
  </div>
);

export default ScaleDownFadeDemo;
