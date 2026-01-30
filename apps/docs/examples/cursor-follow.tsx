"use client";

import CursorFollow from "@repo/smoothui/components/cursor-follow";
import { getImageKitUrl } from "@smoothui/data";
import Image from "next/image";

const images = [
  {
    id: 1,
    src: getImageKitUrl("/images/personchair.webp", {
      width: 384,
      quality: 80,
      format: "auto",
    }),
    label: "Portrait of a person sitting in a chair",
  },
  {
    id: 2,
    src: getImageKitUrl("/images/youngman.webp", {
      width: 384,
      quality: 80,
      format: "auto",
    }),
    label: "A young man with curly hair",
  },
];

const CursorFollowDemo = () => (
  <CursorFollow>
    <div className="flex flex-row items-center justify-center gap-8 py-8">
      {images.map((img) => (
        <div className="flex flex-col items-center" key={img.id}>
          <Image
            alt={img.label}
            className="aspect-[9/16] w-48 rounded-xl border-background object-cover transition-transform duration-200 hover:scale-105"
            data-cursor-text={img.label}
            height={341}
            src={img.src}
            style={{ cursor: "none" }}
            width={192}
          />
        </div>
      ))}
    </div>
  </CursorFollow>
);

export default CursorFollowDemo;
