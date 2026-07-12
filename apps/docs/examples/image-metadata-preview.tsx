"use client";

import ImageMetadataPreview from "@repo/smoothui/components/image-metadata-preview";

const Example = () => {
  const sampleMetadata = {
    created: "2024-01-15",
    updated: "2024-01-20",
    by: "John Doe",
    source: "https://example.com/source",
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
        imageSrc="/images/figma/bg-9.webp"
        metadata={sampleMetadata}
        onShare={handleShare}
      />
    </div>
  );
};

export default Example;
