"use client";

import PhotoStack, {
  type PhotoStackPhoto,
} from "@repo/smoothui/components/photo-stack";

const photos: PhotoStackPhoto[] = [
  {
    alt: "Desert canyon at sunset",
    id: "canyon",
    name: "Desert Canyon",
    role: "Golden hour",
    src: "/images/figma/bg-9.webp",
  },
  {
    alt: "Palm grove in soft light",
    id: "palms",
    name: "Palm Grove",
    role: "Summer haze",
    src: "/images/figma/bg-11.webp",
  },
  {
    alt: "City lights bokeh at night",
    id: "lights",
    name: "City Lights",
    role: "After dark",
    src: "/images/figma/bg-13.webp",
  },
];

export default function PhotoStackDemo() {
  return (
    <div className="flex min-h-80 items-center justify-center py-6">
      <PhotoStack photos={photos} />
    </div>
  );
}
