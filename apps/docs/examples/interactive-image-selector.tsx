"use client";

import InteractiveImageSelector, {
  type ImageData,
} from "@repo/smoothui/components/interactive-image-selector";
import { castPeople } from "@smoothui/data/cast";
import { useEffect, useState } from "react";

/**
 * Five generated Troupe portraits with a consistent photographic treatment.
 */
const demoImages: ImageData[] = castPeople
  .slice(0, 5)
  .map((portrait, index) => ({
    id: index + 1,
    src: `${portrait.src}?tr=w-400,h-400,q-80,f-auto`,
  }));

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
      {notification ? (
        <div className="absolute top-4 right-4 z-50 rounded-lg border bg-background px-4 py-2 text-sm shadow-lg">
          {notification}
        </div>
      ) : null}
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
