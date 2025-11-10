"use client";

import CursorFollow from "@repo/smoothui/components/cursor-follow";

const images = [
  {
    id: 1,
    src: "https://res.cloudinary.com/dyzxnud9z/image/upload/w_600,ar_1:1,c_fill,g_auto/v1758266441/smoothui/personchair.webp",
    label: "Portrait of a person sitting in a chair",
  },
  {
    id: 2,
    src: "https://res.cloudinary.com/dyzxnud9z/image/upload/w_600,ar_1:1,c_fill,g_auto/v1758266959/smoothui/youngman.webp",
    label: "A young man with curly hair",
  },
];

const CursorFollowDemo = () => (
  <CursorFollow>
    <div className="flex flex-row items-center justify-center gap-8 py-8">
      {images.map((img) => (
        <div className="flex flex-col items-center" key={img.id}>
          <img
            alt={img.label}
            className="aspect-[9/16] w-48 rounded-xl border-background object-cover transition-transform duration-200 hover:scale-105"
            data-cursor-text={img.label}
            src={img.src}
            style={{ cursor: "none" }}
          />
        </div>
      ))}
    </div>
  </CursorFollow>
);

export default CursorFollowDemo;
