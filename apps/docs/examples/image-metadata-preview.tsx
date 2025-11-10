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
        filename="mountain-landscape.jpg"
        imageSrc="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=437&fit=crop"
        metadata={sampleMetadata}
        onShare={handleShare}
      />
    </div>
  );
};

export default Example;
