"use client";

import ComparisonSlider from "@repo/smoothui/components/comparison-slider";

const ComparisonSliderDemo = () => {
  return (
    <div className="flex w-full max-w-4xl flex-col gap-8">
      {/* Default horizontal slider */}
      <div className="flex flex-col gap-2">
        <h3 className="font-medium text-sm text-muted-foreground">
          Horizontal (Default)
        </h3>
        <ComparisonSlider
          beforeImage="https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&auto=format&fit=crop"
          afterImage="https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&auto=format&fit=crop&sat=-100"
          beforeLabel="Color"
          afterLabel="Grayscale"
        />
      </div>

      {/* Vertical slider */}
      <div className="flex flex-col gap-2">
        <h3 className="font-medium text-sm text-muted-foreground">
          Vertical Orientation
        </h3>
        <ComparisonSlider
          beforeImage="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop"
          afterImage="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop&sat=-100"
          orientation="vertical"
          className="max-h-[400px]"
        />
      </div>

      {/* Custom initial position with custom labels */}
      <div className="flex flex-col gap-2">
        <h3 className="font-medium text-sm text-muted-foreground">
          Custom Initial Position (25%)
        </h3>
        <ComparisonSlider
          beforeImage="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&auto=format&fit=crop"
          afterImage="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&auto=format&fit=crop&sat=-100"
          beforeLabel="Original"
          afterLabel="Edited"
          initialPosition={25}
        />
      </div>
    </div>
  );
};

export default ComparisonSliderDemo;
