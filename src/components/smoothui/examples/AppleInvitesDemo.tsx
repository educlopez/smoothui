"use client"

import React, { useState } from "react"

import AppleInvites, { Event } from "@/components/smoothui/ui/AppleInvites"

const demoEvents: Event[] = [
  {
    id: 1,
    title: "Yoga",
    subtitle: "Sat, June 14, 6:00 AM",
    location: "Central Park",
    image:
      "https://images.unsplash.com/photo-1593164842264-854604db2260?=jpg&fit=crop&w=640&q=80&fit=max",
    badge: "Hosting",
    participants: [{ avatar: "https://github.com/educlopez.png" }],
  },
  {
    id: 2,
    title: "Tyler Turns 3!",
    subtitle: "Sat, June 14, 3:00 PM",
    location: "Central Park",
    image:
      "https://images.unsplash.com/photo-1524293568345-75d62c3664f7?=jpg&fit=crop&w=640&q=80&fit=max",
    badge: "Going",
    participants: [{ avatar: "https://github.com/educlopez.png" }],
  },
  {
    id: 3,
    title: "Golf party",
    subtitle: "Sun, April 15, 9:00 AM",
    location: "Golf Park",
    image:
      "https://images.unsplash.com/photo-1592919505780-303950717480?=jpg&fit=crop&w=640&q=80&fit=max",
    badge: "Going",
    participants: [{ avatar: "https://github.com/educlopez.png" }],
  },
  {
    id: 4,
    title: "Movie Night",
    subtitle: "Fri, June 20, 8:00 PM",
    location: "Cine Town",
    image:
      "https://images.unsplash.com/photo-1571947453052-1e72ce0d19b9?=jpg&fit=crop&w=640&q=80&fit=max",
    badge: "Interested",
    participants: [{ avatar: "https://github.com/educlopez.png" }],
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
