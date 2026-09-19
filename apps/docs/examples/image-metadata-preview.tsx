"use client";

import {
  METADATA_DESCRIPTION,
  METADATA_DETAILS,
  METADATA_SCENE,
} from "@docs/examples/shared/demo-fixtures";
import ImageMetadataPreview from "@repo/smoothui/components/image-metadata-preview";

const Example = () => {
  const handleShare = () => {
    console.log("Share clicked!");
  };

  return (
    <div className="flex min-h-[600px] items-center justify-center">
      <ImageMetadataPreview
        alt={METADATA_SCENE.alt}
        description={METADATA_DESCRIPTION}
        filename={`${METADATA_SCENE.id}.webp`}
        imageSrc={`${METADATA_SCENE.src}?tr=w-800,f-auto`}
        metadata={METADATA_DETAILS}
        onShare={handleShare}
      />
    </div>
  );
};

export default Example;
