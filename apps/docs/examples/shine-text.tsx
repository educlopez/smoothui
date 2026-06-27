"use client";

import ShineText from "@repo/smoothui/components/shine-text";

const ShineTextDemo = () => (
  <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 text-center">
    <ShineText className="font-bold text-4xl tracking-tight">
      Shipping soon
    </ShineText>
    <ShineText className="text-lg" duration={2}>
      A light sweep across the text.
    </ShineText>
  </div>
);

export default ShineTextDemo;
