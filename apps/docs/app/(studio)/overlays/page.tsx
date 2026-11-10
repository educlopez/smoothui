import { OverlayLab } from "@docs/components/overlays/overlay-lab";
import type { Metadata } from "next";

export const metadata: Metadata = {
  description: "Every SmoothUI overlay surface on one page, for review.",
  robots: { follow: false, index: false },
  title: "Overlay surfaces",
};

export default function OverlaysPage() {
  return <OverlayLab />;
}
