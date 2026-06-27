"use client";

import StaggerFromEdges from "@repo/smoothui/components/stagger-from-edges";

const StaggerFromEdgesDemo = () => (
  <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 text-center">
    <StaggerFromEdges className="font-bold text-4xl tracking-tight">
      Converge.
    </StaggerFromEdges>
    <StaggerFromEdges className="text-lg text-muted-foreground" delay={500}>
      Edges meet center.
    </StaggerFromEdges>
  </div>
);

export default StaggerFromEdgesDemo;
