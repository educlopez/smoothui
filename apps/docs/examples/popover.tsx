"use client";

import Popover from "@repo/smoothui/components/popover";
import SmoothButton from "@repo/smoothui/components/smooth-button";

const FeaturesDemo = () => (
  <div className="flex items-center justify-center p-8">
    <Popover
      side="bottom"
      trigger={
        <SmoothButton type="button" variant="outline">
          Open Popover
        </SmoothButton>
      }
    >
      <div className="space-y-2">
        <p className="font-medium text-sm">Dimensions</p>
        <p className="text-muted-foreground text-sm">
          Set the width and height for the layer. Changes apply immediately.
        </p>
      </div>
    </Popover>
  </div>
);

export const demoScenes = {
  Features: FeaturesDemo,
};

export default function PopoverDemo() {
  return <FeaturesDemo />;
}
