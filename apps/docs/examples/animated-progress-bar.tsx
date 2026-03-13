"use client";

import SmoothButton from "@repo/smoothui/components/smooth-button";
import AnimatedProgressBar from "@repo/smoothui/components/animated-progress-bar";
import { useState } from "react";

export default function AnimatedProgressBarDemo() {
  const [value, setValue] = useState(40);
  const [refreshKey, _setRefreshKey] = useState(0);
  return (
    <div className="relative max-w-xs space-y-6">
      <AnimatedProgressBar
        key={refreshKey}
        label={`Progress: ${value}%`}
        value={value}
      />
      <AnimatedProgressBar
        color="#22d3ee"
        key={refreshKey + 1000}
        label="Custom Color"
        value={value}
      />
      <div className="mt-4 flex gap-2">
        <SmoothButton
          onClick={() => setValue((v) => (v >= 100 ? 0 : v + 10))}
          size="sm"
          variant="outline"
        >
          Increase
        </SmoothButton>
      </div>
    </div>
  );
}
