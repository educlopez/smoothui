"use client";

import DepthParallaxWords from "@repo/smoothui/components/depth-parallax-words";

const DepthParallaxWordsDemo = () => (
  <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 text-center">
    <DepthParallaxWords className="font-bold text-4xl tracking-tight">
      Think different.
    </DepthParallaxWords>
    <DepthParallaxWords className="text-lg text-muted-foreground" delay={400}>
      Per-word depth parallax reveal.
    </DepthParallaxWords>
  </div>
);

export default DepthParallaxWordsDemo;
