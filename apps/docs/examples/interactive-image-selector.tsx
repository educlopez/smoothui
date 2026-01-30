"use client";

import InteractiveImageSelector, {
  type ImageData,
} from "@repo/smoothui/components/interactive-image-selector";
import { getImageKitUrl } from "@smoothui/data";
import { useEffect, useState } from "react";

const demoImages: ImageData[] = [
  {
    id: 1,
    src: getImageKitUrl("/images/womanorange.webp", {
      width: 400,
      height: 400,
      quality: 80,
      format: "auto",
    }),
  },
  {
    id: 2,
    src: getImageKitUrl("/images/girl-nature.webp", {
      width: 400,
      height: 400,
      quality: 80,
      format: "auto",
    }),
  },
  {
    id: 3,
    src: getImageKitUrl("/images/metrowoman.webp", {
      width: 400,
      height: 400,
      quality: 80,
      format: "auto",
    }),
  },
  {
    id: 4,
    src: getImageKitUrl("/images/designerworking.webp", {
      width: 400,
      height: 400,
      quality: 80,
      format: "auto",
    }),
  },
  {
    id: 5,
    src: getImageKitUrl("/images/girlglass.webp", {
      width: 400,
      height: 400,
      quality: 80,
      format: "auto",
    }),
  },
  {
    id: 6,
    src: getImageKitUrl("/images/manup.webp", {
      width: 400,
      height: 400,
      quality: 80,
      format: "auto",
    }),
  },
];

const InteractiveImageSelectorDemo = () => {
  const [selected, setSelected] = useState<number[]>([]);
  const [images, setImages] = useState<ImageData[]>(demoImages);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <>
      {notification && (
        <div className="absolute top-4 right-4 z-50 rounded-lg border bg-background px-4 py-2 text-sm shadow-lg">
          {notification}
        </div>
      )}
      <InteractiveImageSelector
        images={images}
        onChange={setSelected}
        onDelete={(deleted) =>
          setImages((imgs) => imgs.filter((img) => !deleted.includes(img.id)))
        }
        onShare={(sharedImages) =>
          setNotification(`Share images: ${sharedImages.join(", ")}`)
        }
        selectable={false}
        selectedImages={selected}
      />
    </>
  );
};

export default InteractiveImageSelectorDemo;
