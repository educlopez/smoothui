"use client";

import SpringScaleIn from "@repo/smoothui/components/spring-scale-in";

const SpringScaleInDemo = () => (
  <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 text-center">
    <SpringScaleIn className="font-bold text-4xl tracking-tight">
      Think different.
    </SpringScaleIn>
    <SpringScaleIn className="text-lg text-muted-foreground" delay={400}>
      Per-word spring scale reveal.
    </SpringScaleIn>
  </div>
);

export default SpringScaleInDemo;
