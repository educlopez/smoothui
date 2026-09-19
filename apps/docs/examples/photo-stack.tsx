"use client";

import PhotoStack, {
  type PhotoStackPhoto,
} from "@repo/smoothui/components/photo-stack";

import { castAnimals, castPeople } from "@smoothui/data/cast";

const photos: PhotoStackPhoto[] = [
  castPeople[0],
  castPeople[3],
  castPeople[13],
  ...castAnimals.slice(0, 1),
].map((image) => ({
  alt: image.alt,
  id: image.id,
  name: image.name,
  role: image.role,
  src: `${image.src}?tr=w-640,h-800,f-auto`,
}));

export default function PhotoStackDemo() {
  return (
    <div className="flex min-h-80 items-center justify-center py-6">
      <PhotoStack photos={photos} />
    </div>
  );
}
