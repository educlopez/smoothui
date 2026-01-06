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
    <div className="mx-auto w-full max-w-5xl px-2 py-4 md:px-4 md:py-8">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-2 md:gap-8">
        {/* Random lights - animates but never stays permanently high */}
        <div className="hidden md:block">
          <SwitchboardCard
            columns={18}
            randomLights
            rows={5}
            subtitle="Dynamic animated lights that cycle through states."
            title="Random Lights"
            variant="default"
          />
        </div>

        {/* NEXT pattern using gridPattern */}
        <div className="col-span-2 flex justify-center md:col-span-1">
          <div className="origin-center scale-[0.6] md:scale-100">
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
      </div>
    </div>
  );
}
