"use client";

import ButtonCopy from "@repo/smoothui/components/button-copy";

const Example = () => {
  const handleCopy = async () => {
    // Simulate async copy operation
    await navigator.clipboard.writeText("Hello from SmoothUI!");
  };

  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <ButtonCopy duration={2000} loadingDuration={1000} onCopy={handleCopy} />
    </div>
  );
};

export default Example;
