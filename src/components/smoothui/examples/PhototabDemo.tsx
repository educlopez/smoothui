import { Dog, Map as MapIcon, User } from "lucide-react"

import Phototab, { PhototabTab } from "@/components/smoothui/ui/Phototab"

// Placeholder images (replace with your own if available)
const Images = [
  "https://images.unsplash.com/photo-1505937059382-aab581fd88c8?=webp&fit=crop&w=800&fit=max",
  "https://images.unsplash.com/photo-1705054476413-4aed25209459?=webp&fit=crop&w=800&fit=max",
  "https://images.unsplash.com/photo-1591282063405-1752516fd16e?=webp&fit=crop&w=800&fit=max",
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
