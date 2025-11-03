"use client";

import ScrambleHover from "@repo/smoothui/components/scramble-hover";

const Example = () => (
  <div className="flex min-h-[300px] flex-col items-center justify-center space-y-8">
    <div className="space-y-6 text-center">
      <h2 className="mb-4 font-bold text-2xl">Scramble Hover Examples</h2>

      <div className="space-y-4">
        <div className="font-bold text-3xl">
          <ScrambleHover duration={800} speed={50}>
            Hover over this text!
          </ScrambleHover>
        </div>

        <div className="text-xl">
          <ScrambleHover duration={600} speed={30}>
            Watch the characters scramble
          </ScrambleHover>
        </div>

        <div className="text-lg">
          <ScrambleHover duration={1000} speed={40}>
            SmoothUI makes it easy
          </ScrambleHover>
        </div>

        <div className="text-gray-600 text-sm dark:text-gray-300">
          <ScrambleHover duration={500} speed={20}>
            Try hovering over any of these texts above!
          </ScrambleHover>
        </div>
      </div>
    </div>
  </div>
);

export default Example;
