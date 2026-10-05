"use client";

import SmoothButton from "@repo/smoothui/components/smooth-button";
import Tooltip from "@repo/smoothui/components/tooltip";

const FeaturesDemo = () => (
  <div className="flex items-center justify-center gap-4 p-8">
    <Tooltip content="Add to library" side="top">
      <SmoothButton type="button" variant="outline">
        Hover me
      </SmoothButton>
    </Tooltip>
  </div>
);

export const demoScenes = {
  Features: FeaturesDemo,
};

export default function TooltipDemo() {
  return <FeaturesDemo />;
}
