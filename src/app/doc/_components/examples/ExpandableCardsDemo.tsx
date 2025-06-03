"use client"

import React, { useState } from "react"

import ExpandableCards, { Card } from "../smoothui/ExpandableCards"

const demoCards: Card[] = [
  {
    id: 1,
    title: "Summer Opening",
    image:
      "https://images.unsplash.com/photo-1572246538688-3f326dca3951?=jpg&fit=crop&w=400&q=80&fit=max",
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
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?=jpg&fit=crop&w=400&q=80&fit=max",
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
      "https://images.unsplash.com/photo-1522878308970-972ec5eedc0d?=jpg&fit=crop&w=400&q=80&fit=max",
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
      "https://images.unsplash.com/photo-1536893827774-411e1dc7c902?=jpg&fit=crop&w=400&q=80&fit=max",
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
