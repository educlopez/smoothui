"use client";

import Progress from "@repo/smoothui/components/progress";
import { useEffect, useState } from "react";

const PROGRESS_TICK_MS = 900;
const PROGRESS_STEP = 12;

const FeaturesDemo = () => {
  const [value, setValue] = useState(24);

  useEffect(() => {
    const id = window.setInterval(() => {
      setValue((current) => (current >= 100 ? 8 : current + PROGRESS_STEP));
    }, PROGRESS_TICK_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="flex w-full max-w-sm flex-col gap-6 p-8">
      <Progress
        label="Uploading assets"
        showValue
        value={Math.min(value, 100)}
      />
      <Progress aria-label="Storage used" size="sm" value={62} />
    </div>
  );
};

const IndeterminateDemo = () => (
  <div className="flex w-full max-w-sm flex-col gap-6 p-8">
    <Progress label="Preparing export" value={null} />
    <Progress aria-label="Loading" size="lg" value={null} />
  </div>
);

export const demoScenes = {
  Features: FeaturesDemo,
  Indeterminate: IndeterminateDemo,
};

export default function ProgressDemo() {
  return <FeaturesDemo />;
}
