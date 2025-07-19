"use client"

import React from "react"

import ImageMetadataPreview from "@/components/smoothui/ui/ImageMetadataPreview"

const demoMetadata = {
  created: "2 yrs ago",
  updated: "2 yrs ago",
  by: "Edu Calvo",
  source: "95d2a403ff12d7e3b",
}

const demoImage =
  "https://images.unsplash.com/photo-1594063596316-aa5f41ceb8dc?=jpg&fit=crop&w=600&q=80&fit=max"

const ImageMetadataPreviewDemo = () => (
  <div className="flex h-full w-full items-center justify-center">
    <ImageMetadataPreview
      imageSrc={demoImage}
      alt="Scenario with orange black colors"
      filename="screenshot 2024-06-12 at 20.00.22"
      description="No description"
      metadata={demoMetadata}
      onShare={() => alert("Share clicked!")}
    />
  </div>
)

export default ImageMetadataPreviewDemo
