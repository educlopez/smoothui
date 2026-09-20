"use client";

import EmbossSurface, {
  type EmbossSurfaceVariant,
} from "@repo/smoothui/components/emboss-surface";
import { Fingerprint } from "lucide-react";

const EmbossScene = ({
  variant,
  label,
}: {
  variant: EmbossSurfaceVariant;
  label: string;
}) => (
  <div className="flex items-center justify-center p-8">
    <EmbossSurface
      className="rounded-2xl border border-foreground/10 px-10 py-8 text-center"
      depth={2}
      lightAngle={135}
      softness={variant === "plaster" ? 0.8 : 0.5}
      variant={variant}
    >
      <p className="font-semibold text-2xl tracking-tight">{label}</p>
    </EmbossSurface>
  </div>
);

const EmbossDemo = () => <EmbossScene label="Emboss" variant="emboss" />;
const DebossDemo = () => <EmbossScene label="Deboss" variant="deboss" />;
const PlasterDemo = () => <EmbossScene label="Plaster" variant="plaster" />;
const MetalStampDemo = () => (
  <EmbossScene label="Metal stamp" variant="metal-stamp" />
);

const InteractiveDemo = () => (
  <div className="flex items-center justify-center p-8">
    <EmbossSurface
      as="h2"
      className="rounded-2xl border border-foreground/10 px-10 py-8 text-center font-bold text-3xl tracking-tight"
      depth={3}
      interactive
      variant="emboss"
    >
      Move your pointer
    </EmbossSurface>
  </div>
);

const IconDemo = () => (
  <div className="flex items-center justify-center p-8">
    <EmbossSurface
      className="flex items-center justify-center gap-3 rounded-2xl border border-foreground/10 px-10 py-8"
      depth={2}
      lightAngle={45}
      softness={0.35}
      variant="metal-stamp"
    >
      <Fingerprint aria-hidden="true" className="size-8" />
      <span className="font-semibold text-lg">Struck in metal</span>
    </EmbossSurface>
  </div>
);

export const demoScenes = {
  Deboss: DebossDemo,
  Emboss: EmbossDemo,
  Features: EmbossDemo,
  Icon: IconDemo,
  Interactive: InteractiveDemo,
  "Metal Stamp": MetalStampDemo,
  Plaster: PlasterDemo,
};

export default function EmbossSurfaceDemo() {
  return <EmbossDemo />;
}
