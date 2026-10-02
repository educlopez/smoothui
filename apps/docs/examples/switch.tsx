"use client";

import Switch from "@repo/smoothui/components/switch";
import { useState } from "react";

const FeaturesDemo = () => {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex items-center gap-3">
        <Switch checked={enabled} id="airplane" onCheckedChange={setEnabled} />
        <label
          className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          htmlFor="airplane"
        >
          Airplane mode
        </label>
      </div>
    </div>
  );
};

const DisabledDemo = () => (
  <div className="flex items-center justify-center p-8">
    <div className="flex items-center gap-3">
      <Switch disabled id="notifications" />
      <label
        className="font-medium text-muted-foreground text-sm leading-none"
        htmlFor="notifications"
      >
        Notifications
      </label>
    </div>
  </div>
);

export const demoScenes = {
  Disabled: DisabledDemo,
  Features: FeaturesDemo,
};

export default function SwitchDemo() {
  return <FeaturesDemo />;
}
