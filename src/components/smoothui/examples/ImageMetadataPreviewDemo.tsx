"use client"

import ImageMetadataPreview from "@/components/smoothui/ui/ImageMetadataPreview"

const demoMetadata = {
  created: "2 yrs ago",
  updated: "2 yrs ago",
  by: "Edu Calvo",
  source: "95d2a403ff12d7e3b",
}

const demoImage =
  "https://res.cloudinary.com/dyzxnud9z/image/upload/w_400,ar_1:1,c_fill,g_auto/v1758263954/smoothui/cat.webp"

const ImageMetadataPreviewDemo = () => (
  <div className="flex h-full w-full items-center justify-center">
    <ImageMetadataPreview
      imageSrc={demoImage}
      alt="Scenario with orange black colors"
      filename="cat.raw"
      description="Cat image"
      metadata={demoMetadata}
    />
  </div>
)

export default ImageMetadataPreviewDemo
