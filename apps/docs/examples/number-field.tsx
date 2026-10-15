"use client";

import NumberField from "@repo/smoothui/components/number-field";
import { useState } from "react";

const FeaturesDemo = () => {
  const [value, setValue] = useState<number | null>(4);

  return (
    <div className="flex items-center justify-center p-8">
      <NumberField
        label="Quantity"
        max={99}
        min={0}
        onValueChange={setValue}
        value={value}
      />
    </div>
  );
};

const DisabledDemo = () => (
  <div className="flex items-center justify-center p-8">
    <NumberField defaultValue={12} disabled label="Seats" />
  </div>
);

export const demoScenes = {
  Disabled: DisabledDemo,
  Features: FeaturesDemo,
};

export default function NumberFieldDemo() {
  return <FeaturesDemo />;
}
