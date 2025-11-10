"use client";

import ClipCornersButton from "@repo/smoothui/components/clip-corners-button";

const Example = () => (
  <div className="flex min-h-[200px] items-center justify-center">
    <ClipCornersButton onClick={() => console.log("Button clicked!")}>
      Click Me
    </ClipCornersButton>
  </div>
);

export default Example;
