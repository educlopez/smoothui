"use client"

import ScrollableCardStack from "../ui/ScrollableCardStack"

export default function ScrollableCardStackDemo() {
  const cardData = [
    {
      id: "siriorb",
      name: "Edu Calvo",
      handle: "@educalvolpz",
      avatar: "https://github.com/educlopez.png",
      video: "/videos/siriorb.mp4",
      href: "https://x.com/educalvolpz",
    },
    {
      id: "richpopover",
      name: "Edu Calvo",
      handle: "@educalvolpz",
      avatar: "https://github.com/educlopez.png",
      video: "/videos/richpopover.mp4",
      href: "https://x.com/educalvolpz",
    },
    {
      id: "sparkbites",
      name: "Edu Calvo",
      handle: "@educalvolpz",
      avatar: "https://github.com/educlopez.png",
      video: "/videos/sparkbites.mp4",
      href: "https://x.com/educalvolpz",
    },
    {
      id: "svgl",
      name: "Pheralb",
      handle: "@pheralb",
      avatar: "https://github.com/pheralb.png",
      video: "/videos/svgl.mp4",
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
