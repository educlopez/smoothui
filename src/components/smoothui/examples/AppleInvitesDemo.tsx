"use client"

import { useState } from "react"

import AppleInvites from "@/components/smoothui/ui/AppleInvites"
import type { Event } from "@/components/smoothui/ui/AppleInvites"

const demoEvents: Event[] = [
  {
    id: 1,
    title: "Yoga",
    subtitle: "Sat, June 14, 6:00 AM",
    location: "Central Park",
    image:
      "https://res.cloudinary.com/dyzxnud9z/image/upload/w_640,ar_1:1,c_fill,g_auto/v1758265917/smoothui/yogaday.webp",
    badge: "Hosting",
    participants: [{ avatar: "https://github.com/haydenbleasel.png" }],
  },
  {
    id: 2,
    title: "Tyler Turns 3!",
    subtitle: "Sat, June 14, 3:00 PM",
    location: "Central Park",
    image:
      "https://res.cloudinary.com/dyzxnud9z/image/upload/w_640,ar_1:1,c_fill,g_auto/v1758265165/smoothui/park.webp",
    badge: "Going",
    participants: [{ avatar: "https://github.com/educlopez.png" }],
  },
  {
    id: 3,
    title: "Golf party",
    subtitle: "Sun, April 15, 9:00 AM",
    location: "Golf Park",
    image:
      "https://res.cloudinary.com/dyzxnud9z/image/upload/w_640,ar_1:1,c_fill,g_auto/v1758265999/smoothui/golf.webp",
    badge: "Going",
    participants: [{ avatar: "https://github.com/shadcn.png" }],
  },
  {
    id: 4,
    title: "Movie Night",
    subtitle: "Fri, June 20, 8:00 PM",
    location: "Cine Town",
    image:
      "https://res.cloudinary.com/dyzxnud9z/image/upload/w_640,ar_1:1,c_fill,g_auto/v1758265903/smoothui/movie.webp",
    badge: "Interested",
    participants: [{ avatar: "https://github.com/rauchg.png" }],
  },
]

const AppleInvitesDemo = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  return (
    <AppleInvites
      events={demoEvents}
      activeIndex={activeIndex}
      onChange={setActiveIndex}
    />
  )
}

export default AppleInvitesDemo
