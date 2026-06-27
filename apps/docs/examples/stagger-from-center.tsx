"use client";

import StaggerFromCenter from "@repo/smoothui/components/stagger-from-center";

const StaggerFromCenterDemo = () => (
  <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 text-center">
    <StaggerFromCenter className="font-bold text-4xl tracking-tight">
      Beautiful.
    </StaggerFromCenter>
    <StaggerFromCenter className="text-lg text-muted-foreground" delay={500}>
      Center-out reveal.
    </StaggerFromCenter>
  </div>
);

export default StaggerFromCenterDemo;
