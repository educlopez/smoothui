import Phototab, { type PhototabTab } from "@repo/smoothui/components/phototab";
import { getImageKitUrl } from "@smoothui/data";
import { Dog, Map as MapIcon, User } from "lucide-react";

// Placeholder images (replace with your own if available)
const Images = [
  getImageKitUrl("/images/girl-summer.webp", {
    width: 600,
    height: 300,
    quality: 80,
    format: "auto",
  }),
  getImageKitUrl("/images/dog-white.webp", {
    width: 600,
    height: 300,
    quality: 80,
    format: "auto",
  }),
  getImageKitUrl("/images/surf.webp", {
    width: 600,
    height: 300,
    quality: 80,
    format: "auto",
  }),
];

const tabs: PhototabTab[] = [
  {
    name: "one",
    image: Images[0],
    icon: <User />,
  },
  {
    name: "two",
    image: Images[1],
    icon: <Dog />,
  },
  {
    name: "three",
    image: Images[2],
    icon: <MapIcon />,
  },
];

export default function PhototabDemo() {
  return (
    <div className="mx-auto max-w-md">
      <Phototab defaultTab="one" height={300} tabs={tabs} />
    </div>
  );
}
