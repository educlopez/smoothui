"use client"

import { useState } from "react"

import ExpandableCards, {
  type Card,
} from "@/components/smoothui/ui/ExpandableCards"
import { getAllPeople, getAvatarUrl } from "@/app/doc/data/peopleData"

const ExpandableCardsDemo = () => {
  const [selected, setSelected] = useState<number | null>(null)
  const people = getAllPeople()

  const demoCards: Card[] = [
    {
      id: 1,
      title: "Summer Opening",
      image:
        "https://res.cloudinary.com/dyzxnud9z/image/upload/w_400,ar_1:1,c_fill,g_auto/v1758210208/smoothui/summer-opening.webp",
      content:
        "Join us for the Summer Opening event, where we celebrate the start of a vibrant season filled with art and culture.",
      author: {
        name: people[0]?.name || "Eduardo Calvo",
        role: people[0]?.role || "CEO & Founder",
        image: getAvatarUrl(people[0]?.avatar || "", 96),
      },
    },
    {
      id: 2,
      title: "Fashion",
      image:
        "https://res.cloudinary.com/dyzxnud9z/image/upload/w_400,ar_1:1,c_fill,g_auto/v1758210208/smoothui/fashion.webp",
      content:
        "Explore the latest trends in fashion at our exclusive showcase, featuring renowned designers and unique styles.",
      author: {
        name: people[1]?.name || "Sarah Chen",
        role: people[1]?.role || "Head of Design",
        image: getAvatarUrl(people[1]?.avatar || "", 96),
      },
    },
    {
      id: 3,
      title: "Gallery Art",
      image:
        "https://res.cloudinary.com/dyzxnud9z/image/upload/w_400,ar_1:1,c_fill,g_auto/v1758210809/smoothui/galleryart.webp",
      content:
        "Immerse yourself in the world of art at our gallery, showcasing stunning pieces from emerging and established artists.",
      author: {
        name: people[2]?.name || "Marcus Johnson",
        role: people[2]?.role || "Lead Developer",
        image: getAvatarUrl(people[2]?.avatar || "", 96),
      },
    },
    {
      id: 4,
      title: "Dreams",
      image:
        "https://res.cloudinary.com/dyzxnud9z/image/upload/w_400,ar_1:1,c_fill,g_auto/v1758210809/smoothui/dreams.webp",
      content:
        "Join us on a journey through dreams, exploring the subconscious and the art of dreaming.",
      author: {
        name: people[3]?.name || "Emily Rodriguez",
        role: people[3]?.role || "Product Manager",
        image: getAvatarUrl(people[3]?.avatar || "", 96),
      },
    },
  ]

  return (
    <ExpandableCards
      cards={demoCards}
      selectedCard={selected}
      onSelect={setSelected}
    />
  )
}

export default ExpandableCardsDemo
