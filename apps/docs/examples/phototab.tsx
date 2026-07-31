import Phototab, { type PhototabTab } from "@repo/smoothui/components/phototab";
import { getImageKitUrl } from "@smoothui/data";
import { Dog, Map as MapIcon, User } from "lucide-react";

// Placeholder images (replace with your own if available)
const Images = [
  getImageKitUrl("/images/girl-summer.webp", {
    format: "auto",
    height: 300,
    quality: 80,
    width: 600,
  }),
  getImageKitUrl("/images/dog-white.webp", {
    format: "auto",
    height: 300,
    quality: 80,
    width: 600,
  }),
  getImageKitUrl("/images/surf.webp", {
    format: "auto",
    height: 300,
    quality: 80,
    width: 600,
  }),
];

const tabs: PhototabTab[] = [
  {
    icon: <User />,
    image: Images[0],
    name: "one",
  },
  {
    icon: <Dog />,
    image: Images[1],
    name: "two",
  },
  {
    icon: <MapIcon />,
    image: Images[2],
    name: "three",
  },
];

export default function PhototabDemo() {
  return (
    <div className="mx-auto max-w-md">
      <Phototab defaultTab="one" height={300} tabs={tabs} />
    </div>
  );
}
