"use client";

import SwitchboardCard from "@repo/smoothui/components/switchboard-card";

// NEXT pattern: 5 rows x 18 columns
// N: columns 0-4 (5 cols), gap: 1 (col 5), E: columns 6-9 (4 cols), gap: 1 (col 10), X: columns 11-15 (5 cols), gap: 0, T: columns 15-17 (3 cols)
const nextPattern = [
  [1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1],
  [1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0],
  [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
  [1, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0],
  [1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0],
];

export default function SwitchboardCardDemo() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Random lights - animates but never stays permanently high */}
        <SwitchboardCard
          columns={18}
          randomLights
          rows={5}
          subtitle="Dynamic animated lights that cycle through states."
          title="Random Lights"
          variant="default"
        />

        {/* NEXT pattern using gridPattern */}
        <SwitchboardCard
          columns={18}
          gridPattern={nextPattern}
          rows={5}
          subtitle="The power of full-stack to the frontend."
          title="Next.js"
          variant="default"
        />
      </div>
    </div>
  );
}
