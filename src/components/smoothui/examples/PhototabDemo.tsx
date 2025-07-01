import { Dog, Map as MapIcon, User } from "lucide-react"

import { Phototab, PhototabTab } from "../ui/Phototab"

// Placeholder images (replace with your own if available)
const Images = [
  "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?=webp&fit=crop&w=400&q=80&fit=max",
  "https://images.unsplash.com/photo-1587300003388-59208cc962cb?=webp&fit=crop&w=400&q=80&fit=max",
  "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?=webp&fit=crop&w=400&q=80&fit=max",
]

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
]

export default function PhototabDemo() {
  return (
    <div className="mx-auto max-w-md">
      <Phototab tabs={tabs} defaultTab="one" />
    </div>
  )
}
