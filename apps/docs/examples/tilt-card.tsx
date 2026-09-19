"use client";

import {
  sceneAlt,
  sceneSrc,
  TILT_CARD,
  TILT_SCENE,
} from "@docs/examples/shared/demo-fixtures";
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

      {/* The same card the landing canvas shows, so clicking that tile opens a
          page where you can find what you clicked. */}
      <TiltCard
        className="w-64 overflow-hidden rounded-2xl shadow-[0_22px_50px_-26px_rgb(0_0_0/0.65)]"
        glareOpacity={0.32}
        maxTilt={16}
        parallax
        perspective={800}
        scale={1.04}
      >
        <div className="relative h-40 w-full overflow-hidden">
          <img
            alt={sceneAlt(TILT_SCENE)}
            className="h-full w-full scale-110 object-cover"
            data-tilt-depth="0.18"
            draggable={false}
            height={320}
            src={sceneSrc(TILT_SCENE, "w-480,h-320")}
            width={480}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(to_top,oklch(0.16_0.02_264/0.88),oklch(0.16_0.02_264/0.1)_62%)]"
          />
        </div>
        <div className="absolute inset-x-0 bottom-0 p-4" data-tilt-depth="0.55">
          <p className="font-medium text-[10px] text-white/65 uppercase tracking-[0.16em]">
            {TILT_CARD.eyebrow}
          </p>
          <p className="font-semibold text-[17px] text-white leading-tight">
            {TILT_CARD.title}
          </p>
          <p className="text-[11px] text-white/70 tabular-nums">
            {TILT_CARD.meta}
          </p>
        </div>
      </TiltCard>
    </div>
  );
}
