"use client";

import Slider from "@repo/smoothui/components/slider";
import { useState } from "react";

const FeaturesDemo = () => {
  const [value, setValue] = useState(40);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-3 p-8">
      <Slider
        aria-label="Volume"
        className="w-full max-w-xs"
        onValueChange={setValue}
        value={value}
      />
      <p className="text-muted-foreground text-sm tabular-nums">{value}</p>
    </div>
  );
};

const DisabledDemo = () => (
  <div className="flex w-full items-center justify-center p-8">
    <Slider
      aria-label="Disabled volume"
      className="w-full max-w-xs"
      defaultValue={60}
      disabled
    />
  </div>
);

export const demoScenes = {
  Disabled: DisabledDemo,
  Features: FeaturesDemo,
};

export default function SliderDemo() {
  return <FeaturesDemo />;
}
