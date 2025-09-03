"use client"

import ScrollableCardStack from "../ui/ScrollableCardStack"

export default function ScrollableCardStackDemo() {
  const cardData = [
    {
      id: "siriorb",
      name: "Edu Calvo",
      handle: "@educalvolpz",
      avatar: "https://github.com/educlopez.png",
      video:
        "https://res.cloudinary.com/dyzxnud9z/video/upload/smoothui/siriorb.mp4",
      href: "https://x.com/educalvolpz",
    },
    {
      id: "richpopover",
      name: "Edu Calvo",
      handle: "@educalvolpz",
      avatar: "https://github.com/educlopez.png",
      video:
        "https://res.cloudinary.com/dyzxnud9z/video/upload/smoothui/richpopover.mp4",
      href: "https://x.com/educalvolpz",
    },
    {
      id: "sparkbites",
      name: "Edu Calvo",
      handle: "@educalvolpz",
      avatar: "https://github.com/educlopez.png",
      video:
        "https://res.cloudinary.com/dyzxnud9z/video/upload/smoothui/sparkbites.mp4",
      href: "https://x.com/educalvolpz",
    },
    {
      id: "svgl",
      name: "Pheralb",
      handle: "@pheralb",
      avatar: "https://github.com/pheralb.png",
      video:
        "https://res.cloudinary.com/dyzxnud9z/video/upload/smoothui/svgl.mp4",
      href: "https://x.com/pheralb",
    },
  ]

  return (
    <div className="mx-auto w-full max-w-md">
      <ScrollableCardStack
        items={cardData}
        cardHeight={384}
        perspective={1000}
        transitionDuration={180}
        className="mx-auto"
      />
    </div>
  )
}
