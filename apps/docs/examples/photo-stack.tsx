"use client";

import PhotoStack, {
  type PhotoStackPhoto,
} from "@repo/smoothui/components/photo-stack";

const photos: PhotoStackPhoto[] = [
  {
    id: "canyon",
    src: "/images/figma/bg-9.webp",
    alt: "Desert canyon at sunset",
    name: "Desert Canyon",
    role: "Golden hour",
  },
  {
    id: "palms",
    src: "/images/figma/bg-11.webp",
    alt: "Palm grove in soft light",
    name: "Palm Grove",
    role: "Summer haze",
  },
  {
    id: "lights",
    src: "/images/figma/bg-13.webp",
    alt: "City lights bokeh at night",
    name: "City Lights",
    role: "After dark",
  },
];

export default function PhotoStackDemo() {
  return (
    <div className="flex min-h-80 items-center justify-center py-6">
      <PhotoStack photos={photos} />
    </div>
  );
}
