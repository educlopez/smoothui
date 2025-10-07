"use client"

import { getAllPeople, getAvatarUrl } from "@/app/doc/data/peopleData"

import ScrollableCardStack from "../ui/ScrollableCardStack"

export default function ScrollableCardStackDemo() {
  const people = getAllPeople()

  const cardData = [
    {
      id: "siriorb",
      name: people[0]?.name || "Edu Calvo",
      handle: "@educalvolpz",
      avatar:
        "https://res.cloudinary.com/dyzxnud9z/image/upload/w_40,h_40,c_fill,g_auto/v1759818651/smoothui/educalvolpz.jpg", // Keep educlopez as requested
      video:
        "https://res.cloudinary.com/dyzxnud9z/video/upload/smoothui/siriorb.mp4",
      href: "https://x.com/educalvolpz",
    },
    {
      id: "richpopover",
      name: people[1]?.name || "Sarah Chen",
      handle: `@${people[1]?.name?.toLowerCase().replace(/\s+/g, "") || "sarahchen"}`,
      avatar: getAvatarUrl(people[1]?.avatar || "", 40),
      video:
        "https://res.cloudinary.com/dyzxnud9z/video/upload/smoothui/richpopover.mp4",
      href: `https://x.com/${people[1]?.name?.toLowerCase().replace(/\s+/g, "") || "sarahchen"}`,
    },
    {
      id: "sparkbites",
      name: people[2]?.name || "Marcus Johnson",
      handle: `@${people[2]?.name?.toLowerCase().replace(/\s+/g, "") || "marcusj"}`,
      avatar: getAvatarUrl(people[2]?.avatar || "", 40),
      video:
        "https://res.cloudinary.com/dyzxnud9z/video/upload/smoothui/sparkbites.mp4",
      href: `https://x.com/${people[2]?.name?.toLowerCase().replace(/\s+/g, "") || "marcusj"}`,
    },
    {
      id: "svgl",
      name: people[3]?.name || "Emily Rodriguez",
      handle: `@${people[3]?.name?.toLowerCase().replace(/\s+/g, "") || "emilyrodriguez"}`,
      avatar: getAvatarUrl(people[3]?.avatar || "", 40),
      video:
        "https://res.cloudinary.com/dyzxnud9z/video/upload/smoothui/svgl.mp4",
      href: `https://x.com/${people[3]?.name?.toLowerCase().replace(/\s+/g, "") || "emilyrodriguez"}`,
    },
  ]

  return (
    <div className="mx-auto w-full max-w-md">
      <ScrollableCardStack
        items={cardData}
        cardHeight={200}
        perspective={1200}
        transitionDuration={200}
        className="mx-auto"
      />
    </div>
  )
}
