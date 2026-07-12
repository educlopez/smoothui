"use client";

import MicroScaleFade from "@repo/smoothui/components/micro-scale-fade";

const MicroScaleFadeDemo = () => (
  <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 text-center">
    <MicroScaleFade className="font-bold text-4xl tracking-tight">
      Precision.
    </MicroScaleFade>
    <MicroScaleFade className="text-lg text-muted-foreground" delay={300}>
      Subtle premium scale entrance.
    </MicroScaleFade>
  </div>
);

export default MicroScaleFadeDemo;
