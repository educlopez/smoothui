"use client";

import InteractiveImageSelector, {
  type ImageData,
} from "@repo/smoothui/components/interactive-image-selector";
import { useState } from "react";

const demoImages: ImageData[] = [
  {
    id: 1,
    src: "https://res.cloudinary.com/dyzxnud9z/image/upload/w_300,ar_1:1,c_fill,g_auto/v1758270763/smoothui/womanorange.webp",
  },
  {
    id: 2,
    src: "https://res.cloudinary.com/dyzxnud9z/image/upload/w_300,ar_1:1,c_fill,g_auto/v1758209962/smoothui/girl-nature.webp",
  },
  {
    id: 3,
    src: "https://res.cloudinary.com/dyzxnud9z/image/upload/w_300,ar_1:1,c_fill,g_auto/v1758271088/smoothui/metrowoman.webp",
  },
  {
    id: 4,
    src: "https://res.cloudinary.com/dyzxnud9z/image/upload/w_300,ar_1:1,c_fill,g_auto/v1758271134/smoothui/designerworking.webp",
  },
  {
    id: 5,
    src: "https://res.cloudinary.com/dyzxnud9z/image/upload/w_300,ar_1:1,c_fill,g_auto/v1758271305/smoothui/girlglass.webp",
  },
  {
    id: 6,
    src: "https://res.cloudinary.com/dyzxnud9z/image/upload/w_300,ar_1:1,c_fill,g_auto/v1758271369/smoothui/manup.webp",
  },
];

const InteractiveImageSelectorDemo = () => {
  const [selected, setSelected] = useState<number[]>([]);
  const [images, setImages] = useState<ImageData[]>(demoImages);

  return (
    <InteractiveImageSelector
      images={images}
      onChange={setSelected}
      onDelete={(deleted) =>
        setImages((imgs) => imgs.filter((img) => !deleted.includes(img.id)))
      }
      onShare={(selected) => alert(`Share images: ${selected.join(", ")}`)}
      selectable={false}
      selectedImages={selected}
    />
  );
};

export default InteractiveImageSelectorDemo;
