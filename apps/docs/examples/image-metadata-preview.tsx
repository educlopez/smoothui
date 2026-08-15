"use client";

import ImageMetadataPreview from "@repo/smoothui/components/image-metadata-preview";

const Example = () => {
  const sampleMetadata = {
    by: "John Doe",
    created: "2024-01-15",
    source: "https://example.com/source",
    updated: "2024-01-20",
  };

  const handleShare = () => {
    console.log("Share clicked!");
  };

  return (
    <div className="flex min-h-[600px] items-center justify-center">
      <ImageMetadataPreview
        alt="Mountain landscape"
        description="Beautiful mountain landscape with snow-capped peaks"
        filename="desert-canyon.jpg"
        imageSrc="https://ik.imagekit.io/16u211libb/smoothui/scenes/rust-peak.webp?tr=w-800,f-auto"
        metadata={sampleMetadata}
        onShare={handleShare}
      />
    </div>
  );
};

export default Example;
