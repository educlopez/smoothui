"use client";

import Toggle from "@repo/smoothui/components/toggle";
import { Bold, Italic, Underline } from "lucide-react";
import { useState } from "react";

const FeaturesDemo = () => {
  const [pressed, setPressed] = useState(false);

  return (
    <div className="flex items-center justify-center gap-2 p-8">
      <Toggle aria-label="Bold" onPressedChange={setPressed} pressed={pressed}>
        <Bold className="size-4" />
      </Toggle>
      <Toggle aria-label="Italic" defaultPressed>
        <Italic className="size-4" />
      </Toggle>
      <Toggle aria-label="Underline">
        <Underline className="size-4" />
      </Toggle>
    </div>
  );
};

const DisabledDemo = () => (
  <div className="flex items-center justify-center p-8">
    <Toggle aria-label="Disabled" disabled>
      Disabled
    </Toggle>
  </div>
);

export const demoScenes = {
  Disabled: DisabledDemo,
  Features: FeaturesDemo,
};

export default function ToggleDemo() {
  return <FeaturesDemo />;
}
