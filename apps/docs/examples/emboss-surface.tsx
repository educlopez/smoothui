"use client";

import EmbossSurface, {
  type EmbossSurfaceVariant,
} from "@repo/smoothui/components/emboss-surface";
import { Fingerprint } from "lucide-react";

interface VariantCard {
  copy: string;
  depth: number;
  label: string;
  softness: number;
  variant: EmbossSurfaceVariant;
}

const VARIANTS: VariantCard[] = [
  {
    copy: "Raised relief, light from the upper left.",
    depth: 2,
    label: "Emboss",
    softness: 0.5,
    variant: "emboss",
  },
  {
    copy: "The same relief, pressed into the surface.",
    depth: 2,
    label: "Deboss",
    softness: 0.5,
    variant: "deboss",
  },
  {
    copy: "Soft specular lighting through an SVG filter.",
    depth: 3,
    label: "Plaster",
    softness: 0.8,
    variant: "plaster",
  },
  {
    copy: "Hard-edged die strike with a metallic falloff.",
    depth: 2,
    label: "Metal stamp",
    softness: 0.2,
    variant: "metal-stamp",
  },
];

const EmbossSurfaceDemo = () => (
  <div className="mx-auto w-full max-w-4xl px-4 py-8">
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {VARIANTS.map((item) => (
        <EmbossSurface
          className="rounded-2xl border border-foreground/10 p-6"
          depth={item.depth}
          key={item.variant}
          lightAngle={135}
          softness={item.softness}
          variant={item.variant}
        >
          <p className="font-semibold text-2xl tracking-tight">{item.label}</p>
          <p className="mt-2 text-muted-foreground text-sm">{item.copy}</p>
        </EmbossSurface>
      ))}
    </div>

    <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
      <EmbossSurface
        as="h2"
        className="rounded-2xl border border-foreground/10 p-8 text-center font-bold text-3xl tracking-tight"
        depth={3}
        interactive
        variant="emboss"
      >
        Move your pointer
      </EmbossSurface>

      <EmbossSurface
        className="flex items-center justify-center gap-3 rounded-2xl border border-foreground/10 p-8"
        depth={2}
        lightAngle={45}
        softness={0.35}
        variant="metal-stamp"
      >
        <Fingerprint aria-hidden="true" className="size-8" />
        <span className="font-semibold text-lg">Struck in metal</span>
      </EmbossSurface>
    </div>
  </div>
);

export default EmbossSurfaceDemo;
