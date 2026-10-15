"use client";

import Meter from "@repo/smoothui/components/meter";

const FeaturesDemo = () => (
  <div className="flex w-full max-w-sm flex-col gap-6 p-8">
    <Meter label="Storage used" showValue value={68} />
    <Meter aria-label="Bandwidth" size="sm" value={34} />
    <Meter label="Seat usage" showValue size="lg" value={92} />
  </div>
);

const QuotaDemo = () => (
  <div className="flex w-full max-w-sm flex-col gap-4 p-8">
    <Meter label="Battery" showValue value={24} />
    <Meter label="Disk" showValue value={81} />
  </div>
);

export const demoScenes = {
  Features: FeaturesDemo,
  Quota: QuotaDemo,
};

export default function MeterDemo() {
  return <FeaturesDemo />;
}
