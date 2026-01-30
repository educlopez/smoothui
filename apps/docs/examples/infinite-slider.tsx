"use client";

import InfiniteSlider from "@repo/smoothui/components/infinite-slider";

const InfiniteSliderDemo = () => {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-8">
      {/* Basic horizontal slider */}
      <div className="w-full max-w-md">
        <InfiniteSlider gap={16} speed={50}>
          {Array.from({ length: 5 }, (_, i) => (
            <div
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground"
              key={`basic-${i + 1}`}
            >
              {i + 1}
            </div>
          ))}
        </InfiniteSlider>
      </div>

      {/* Slider with hover pause */}
      <div className="w-full max-w-md">
        <InfiniteSlider gap={16} speed={50} speedOnHover={0}>
          {Array.from({ length: 5 }, (_, i) => (
            <div
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-brand text-white"
              key={`hover-${i + 1}`}
            >
              {i + 1}
            </div>
          ))}
        </InfiniteSlider>
      </div>

      {/* Reverse direction */}
      <div className="w-full max-w-md">
        <InfiniteSlider gap={16} reverse speed={50}>
          {Array.from({ length: 5 }, (_, i) => (
            <div
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground"
              key={`reverse-${i + 1}`}
            >
              {i + 1}
            </div>
          ))}
        </InfiniteSlider>
      </div>
    </div>
  );
};

export default InfiniteSliderDemo;
