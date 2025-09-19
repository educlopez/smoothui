"use client"

import { useState } from "react"

import ExpandableCards, { Card } from "@/components/smoothui/ui/ExpandableCards"

const demoCards: Card[] = [
  {
    id: 1,
    title: "Summer Opening",
    image:
      "https://res.cloudinary.com/dyzxnud9z/image/upload/w_400,ar_1:1,c_fill,g_auto/v1758210208/smoothui/summer-opening.webp",
    content:
      "Join us for the Summer Opening event, where we celebrate the start of a vibrant season filled with art and culture.",
    author: {
      name: "Zé Manuel",
      role: "Fundador, Summer Opening",
      image: "https://github.com/educlopez.png",
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
      name: "Maria Silva",
      role: "Fashion Curator",
      image: "https://github.com/educlopez.png",
    },
  },
  {
    id: 3,
    title: "Gallery Art",
    image:
      "https://res.cloudinary.com/dyzxnud9z/image/upload/w_400,ar_1:1,c_fill,g_auto/v1758210208/smoothui/galleryart.webp",
    content:
      "Immerse yourself in the world of art at our gallery, showcasing stunning pieces from emerging and established artists.",
    author: {
      name: "João Santos",
      role: "Gallery Director",
      image: "https://github.com/educlopez.png",
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
      name: "Ana Rodrigues",
      role: "Dream Interpreter",
      image: "https://github.com/educlopez.png",
    },
  },
]

const ExpandableCardsDemo = () => {
  const [selected, setSelected] = useState<number | null>(null)
  return (
    <ExpandableCards
      cards={demoCards}
      selectedCard={selected}
      onSelect={setSelected}
    />
  )
}

export default ExpandableCardsDemo
