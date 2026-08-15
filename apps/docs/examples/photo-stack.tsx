"use client";

import PhotoStack, {
  type PhotoStackPhoto,
} from "@repo/smoothui/components/photo-stack";

const photos: PhotoStackPhoto[] = [
  {
    alt: "A rust-red mountain against a pale sky",
    id: "canyon",
    name: "Rust Peak",
    role: "Golden hour",
    src: "https://ik.imagekit.io/16u211libb/smoothui/scenes/rust-peak.webp?tr=w-640,h-800,f-auto",
  },
  {
    alt: "A mountainside catching low golden light",
    id: "palms",
    name: "Golden Ridge",
    role: "Summer haze",
    src: "https://ik.imagekit.io/16u211libb/smoothui/scenes/golden-ridge.webp?tr=w-640,h-800,f-auto",
  },
  {
    alt: "A vast moon rising over a wooded valley",
    id: "lights",
    name: "Moonrise",
    role: "After dark",
    src: "https://ik.imagekit.io/16u211libb/smoothui/scenes/moonrise-valley.webp?tr=w-640,h-800,f-auto",
  },
];

export default function PhotoStackDemo() {
  return (
    <div className="flex min-h-80 items-center justify-center py-6">
      <PhotoStack photos={photos} />
    </div>
  );
}
