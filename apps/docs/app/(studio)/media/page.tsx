import { MediaLibrary } from "@docs/components/media/media-library";
import { mediaCatalog } from "@docs/lib/media-catalog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  description: "Browse SmoothUI's existing reusable demo imagery.",
  robots: { follow: false, index: false },
  title: "Image library",
};

export default function MediaPage() {
  return <MediaLibrary assets={mediaCatalog} />;
}
