"use client";

import AnimatedProgressBar from "@repo/smoothui/components/animated-progress-bar";
import SmoothButton from "@repo/smoothui/components/smooth-button";
import { useState } from "react";

const DefaultDemo = () => {
  const [value, setValue] = useState(40);

  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-4 p-8">
      <AnimatedProgressBar label={`Progress: ${value}%`} value={value} />
      <SmoothButton
        onClick={() =>
          setValue((current) => (current >= 100 ? 0 : current + 10))
        }
        size="sm"
        variant="outline"
      >
        Increase
      </SmoothButton>
    </div>
  );
};

const CustomColorDemo = () => {
  const [value, setValue] = useState(65);

  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-4 p-8">
      <AnimatedProgressBar
        color="#22d3ee"
        label={`Progress: ${value}%`}
        value={value}
      />
      <SmoothButton
        onClick={() =>
          setValue((current) => (current >= 100 ? 0 : current + 10))
        }
        size="sm"
        variant="outline"
      >
        Increase
      </SmoothButton>
    </div>
  );
};

export const demoScenes = {
  "Custom Color": CustomColorDemo,
  Features: DefaultDemo,
};

export default function AnimatedProgressBarDemo() {
  return <DefaultDemo />;
}
