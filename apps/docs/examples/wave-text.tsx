"use client";

import WaveText from "@repo/smoothui/components/wave-text";

const Example = () => (
  <div className="flex min-h-[300px] flex-col items-center justify-center space-y-8">
    <div className="space-y-4 text-center">
      <h2 className="mb-4 font-bold text-2xl">Wave Text Examples</h2>

      <div className="space-y-6">
        <div className="font-bold text-3xl">
          <WaveText amplitude={12} speed={0.2}>
            SmoothUI Components
          </WaveText>
        </div>

        <div className="text-xl">
          <WaveText amplitude={8} speed={0.3}>
            Beautiful animations made easy
          </WaveText>
        </div>

        <div className="text-gray-600 text-lg dark:text-gray-300">
          <WaveText amplitude={6} speed={0.4}>
            Hover over the text to see the wave effect!
          </WaveText>
        </div>
      </div>
    </div>
  </div>
);

export default Example;
