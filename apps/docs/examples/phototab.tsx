import Phototab, { type PhototabTab } from "@repo/smoothui/components/phototab";
import { Dog, Map as MapIcon, User } from "lucide-react";

// Placeholder images (replace with your own if available)
const Images = [
  "https://res.cloudinary.com/dyzxnud9z/image/upload/w_500,ar_1:1,c_fill,g_auto/v1758209510/smoothui/girl-summer.webp",
  "https://res.cloudinary.com/dyzxnud9z/image/upload/w_500,ar_1:1,c_fill,g_auto/v1758209666/smoothui/dog-white.webp",
  "https://res.cloudinary.com/dyzxnud9z/image/upload/w_500,ar_1:1,c_fill,g_auto/v1758210029/smoothui/surf.webp",
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
