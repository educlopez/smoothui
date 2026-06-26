"use client";

import PhotoStack, {
  type PhotoStackPhoto,
} from "@repo/smoothui/components/photo-stack";
import { getImageKitUrl } from "@smoothui/data";

const photo = (path: string) =>
  getImageKitUrl(path, {
    width: 448,
    height: 576,
    quality: 80,
    format: "auto",
  });

const photos: PhotoStackPhoto[] = [
  {
    id: "girl",
    src: photo("/images/girl-summer.webp"),
    alt: "Person in summer light",
    name: "Mara Okonkwo",
    role: "Design engineer",
  },
  {
    id: "dog",
    src: photo("/images/dog-white.webp"),
    alt: "White dog",
    name: "Noa Bergström",
    role: "Frontend lead",
  },
  {
    id: "surf",
    src: photo("/images/surf.webp"),
    alt: "Surfer on a wave",
    name: "Ines Duarte",
    role: "Solo founder",
  },
];

export default function PhotoStackDemo() {
  return (
    <div className="flex min-h-80 items-center justify-center py-6">
      <PhotoStack photos={photos} />
    </div>
  );
}
