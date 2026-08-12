"use client";

import TiltCard from "@repo/smoothui/components/tilt-card";

export default function TiltCardDemo() {
  return (
    <div className="flex w-full flex-wrap items-start justify-center gap-8 px-4 py-8">
      <TiltCard className="w-64 rounded-2xl border border-foreground/20 bg-background p-6">
        <div data-tilt-depth="0.2">
          <h3 className="font-semibold text-foreground text-sm">
            Glare + tilt
          </h3>
          <p className="mt-2 text-muted-foreground text-xs leading-relaxed">
            Move your cursor over this card to see the 3D pointer tilt with a
            soft glare highlight.
          </p>
        </div>
      </TiltCard>

      <TiltCard
        className="w-64 rounded-2xl border border-foreground/20 bg-background p-6"
        maxTilt={18}
        parallax
        scale={1.05}
      >
        <div className="flex flex-col gap-3">
          <div
            className="h-10 w-10 rounded-full bg-brand"
            data-tilt-depth="1"
          />
          <h3
            className="font-semibold text-foreground text-sm"
            data-tilt-depth="0.5"
          >
            Parallax layers
          </h3>
          <p
            className="text-muted-foreground text-xs leading-relaxed"
            data-tilt-depth="0.2"
          >
            Elements with data-tilt-depth move at different rates, adding depth
            to the tilt.
          </p>
        </div>
      </TiltCard>

      <TiltCard
        className="w-64 rounded-2xl border border-foreground/20 bg-background p-6"
        glare={false}
        maxTilt={8}
      >
        <div>
          <h3 className="font-semibold text-foreground text-sm">No glare</h3>
          <p className="mt-2 text-muted-foreground text-xs leading-relaxed">
            A subtler tilt-only variant without the glare overlay.
          </p>
        </div>
      </TiltCard>
    </div>
  );
}
