"use client";

import TypewriterText from "@repo/smoothui/components/typewriter-text";

const Example = () => (
  <div className="flex min-h-[200px] flex-col items-center justify-center space-y-8">
    <div className="text-center">
      <h2 className="mb-4 font-bold text-2xl">Typewriter Effect Examples</h2>

      <div className="space-y-4">
        <div className="text-lg">
          <TypewriterText speed={100}>
            Welcome to SmoothUI! This is a typewriter effect.
          </TypewriterText>
        </div>

        <div className="text-lg">
          <TypewriterText loop={true} speed={50}>
            This text loops continuously with a faster speed.
          </TypewriterText>
        </div>

        <div className="text-gray-600 text-sm dark:text-gray-300">
          <TypewriterText speed={30}>
            Perfect for creating engaging user experiences and dynamic content.
          </TypewriterText>
        </div>
      </div>
    </div>
  </div>
);

export default Example;
