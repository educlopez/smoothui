"use client";

import SiriOrb from "@repo/smoothui/components/siri-orb";

const Example = () => (
  <div className="flex items-center justify-center space-x-8 p-8">
    {/* Default Siri Orb */}
    <div className="text-center">
      <SiriOrb />
      <p className="mt-2 text-gray-600 text-sm dark:text-gray-300">Default</p>
    </div>

    {/* Small Siri Orb */}
    <div className="text-center">
      <SiriOrb size="96px" />
      <p className="mt-2 text-gray-600 text-sm dark:text-gray-300">Small</p>
    </div>

    {/* Custom Colors */}
    <div className="text-center">
      <SiriOrb
        animationDuration={15}
        colors={{
          bg: "oklch(98% 0.01 264.695)",
          c1: "oklch(70% 0.2 120)", // Green
          c2: "oklch(75% 0.18 60)", // Yellow
          c3: "oklch(80% 0.15 300)", // Purple
        }}
        size="128px"
      />
      <p className="mt-2 text-gray-600 text-sm dark:text-gray-300">
        Custom Colors
      </p>
    </div>
  </div>
);

export default Example;
