"use client";

import BorderBeam from "@repo/smoothui/components/border-beam";
import SmoothButton from "@repo/smoothui/components/smooth-button";
import { Pause, Play } from "lucide-react";
import { useState } from "react";

const beamInner =
  "flex min-h-[120px] min-w-[180px] items-center justify-center p-6";

const TightCornersDemo = () => (
  <div className="flex items-center justify-center p-8">
    <BorderBeam className="bg-background" duration={5} radius={6} size={84}>
      <div className={beamInner} />
    </BorderBeam>
  </div>
);

const PillDemo = () => (
  <div className="flex items-center justify-center p-8">
    <BorderBeam
      borderWidth={1.5}
      className="bg-background"
      duration={4.5}
      radius={999}
    >
      <div className={beamInner} />
    </BorderBeam>
  </div>
);

const SquircleDemo = () => (
  <div className="flex items-center justify-center p-8">
    <BorderBeam duration={6} radius="squircle" size={92}>
      <div className={beamInner} />
    </BorderBeam>
  </div>
);

const TwoBeamsDemo = () => (
  <div className="flex items-center justify-center p-8">
    <BorderBeam
      beams={2}
      borderWidth={2}
      className="bg-background"
      duration={7}
      radius={20}
      size={76}
    >
      <div className={beamInner} />
    </BorderBeam>
  </div>
);

const CustomColorsDemo = () => (
  <div className="flex items-center justify-center p-8">
    <BorderBeam
      borderWidth={1.5}
      className="bg-background"
      colorFrom="var(--color-amber)"
      colorTo="var(--color-green)"
      duration={5.5}
      radius={20}
      size={96}
    >
      <div className={beamInner} />
    </BorderBeam>
  </div>
);

const ReverseDemo = () => {
  const [isActive, setIsActive] = useState(true);

  return (
    <div className="flex items-center justify-center p-8">
      <BorderBeam
        active={isActive}
        className="bg-background"
        duration={4}
        pauseOnHover
        radius={20}
        reverse
      >
        <div className={`${beamInner} flex-col gap-3`}>
          <SmoothButton
            aria-pressed={isActive}
            color="accent"
            onClick={() => setIsActive((value) => !value)}
            prefix={isActive ? <Pause /> : <Play />}
            shape="pill"
            size="xs"
            variant="outline"
          >
            {isActive ? "Stop" : "Start"}
          </SmoothButton>
        </div>
      </BorderBeam>
    </div>
  );
};

export const demoScenes = {
  "Custom Colors": CustomColorsDemo,
  Features: TightCornersDemo,
  Pill: PillDemo,
  Reverse: ReverseDemo,
  Squircle: SquircleDemo,
  "Tight Corners": TightCornersDemo,
  "Two Beams": TwoBeamsDemo,
};

export default function BorderBeamDemo() {
  return <TightCornersDemo />;
}
