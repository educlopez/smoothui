"use client";

import MaskRevealUp from "@repo/smoothui/components/mask-reveal-up";

const MaskRevealUpDemo = () => (
  <div className="flex min-h-[300px] flex-col items-center justify-center gap-6 text-center">
    <MaskRevealUp className="font-bold text-4xl tracking-tight">
      {"Designed for\nthe planet."}
    </MaskRevealUp>
    <MaskRevealUp
      className="text-lg text-muted-foreground"
      delay={300}
      lines={["Per-line masked reveal.", "Apple section transitions."]}
    />
  </div>
);

export default MaskRevealUpDemo;
