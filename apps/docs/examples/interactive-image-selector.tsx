"use client";

import InteractiveImageSelector, {
  type ImageData,
} from "@repo/smoothui/components/interactive-image-selector";
import { getImageKitUrl } from "@smoothui/data";
import { useState } from "react";

const demoImages: ImageData[] = [
  {
    id: 1,
    src: getImageKitUrl("/images/womanorange.webp"),
  },
  {
    id: 2,
    src: getImageKitUrl("/images/girl-nature.webp"),
  },
  {
    id: 3,
    src: getImageKitUrl("/images/metrowoman.webp"),
  },
  {
    id: 4,
    src: getImageKitUrl("/images/designerworking.webp"),
  },
  {
    id: 5,
    src: getImageKitUrl("/images/girlglass.webp"),
  },
  {
    id: 6,
    src: getImageKitUrl("/images/manup.webp"),
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
