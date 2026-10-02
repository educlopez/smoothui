"use client";

import Badge, { StatusDot } from "@repo/smoothui/components/badge";

const FeaturesDemo = () => (
  <div className="flex flex-wrap items-center gap-2 p-8">
    <Badge>Default</Badge>
    <Badge variant="secondary">Secondary</Badge>
    <Badge variant="outline">Outline</Badge>
    <Badge variant="success">Active</Badge>
    <Badge variant="warning">Pending</Badge>
    <Badge variant="destructive">Failed</Badge>
  </div>
);

const SizesDemo = () => (
  <div className="flex flex-wrap items-center gap-3 p-8">
    <Badge size="sm">Small</Badge>
    <Badge>Medium</Badge>
    <Badge size="sm" variant="outline">
      v2.1
    </Badge>
  </div>
);

const StatusDemo = () => (
  <div className="flex items-center gap-4 p-8">
    <div className="flex items-center gap-2 text-sm">
      <StatusDot pulse status="online" />
      Online
    </div>
    <div className="flex items-center gap-2 text-sm">
      <StatusDot status="away" />
      Away
    </div>
    <div className="flex items-center gap-2 text-sm">
      <StatusDot status="busy" />
      Busy
    </div>
    <div className="flex items-center gap-2 text-sm">
      <StatusDot status="offline" />
      Offline
    </div>
  </div>
);

export const demoScenes = {
  Features: FeaturesDemo,
  Sizes: SizesDemo,
  Status: StatusDemo,
};

export default function BadgeDemo() {
  return <FeaturesDemo />;
}
