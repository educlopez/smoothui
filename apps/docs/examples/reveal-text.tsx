"use client";

import RevealText from "@repo/smoothui/components/reveal-text";

const Example = () => (
  <div className="flex min-h-[400px] flex-col items-center justify-center space-y-8">
    <div className="space-y-6 text-center">
      <h2 className="mb-4 font-bold text-2xl">Reveal Text Examples</h2>

      <div className="space-y-4">
        <div className="font-bold text-3xl">
          <RevealText delay={0} direction="up">
            Welcome to SmoothUI
          </RevealText>
        </div>

        <div className="text-xl">
          <RevealText delay={200} direction="left">
            Beautiful animations
          </RevealText>
        </div>

        <div className="text-lg">
          <RevealText delay={400} direction="right">
            Made with Framer Motion
          </RevealText>
        </div>

        <div className="text-gray-600 text-sm dark:text-gray-300">
          <RevealText delay={600} direction="down">
            Scroll down to see more examples!
          </RevealText>
        </div>
      </div>
    </div>
  </div>
);

export default Example;
