"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Play } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

interface Card {
  id: number
  title: string
  image: string
  content: string
  author?: {
    name: string
    role: string
  }
}

const cards: Card[] = [
  {
    id: 1,
    title: "Summer Opening",
    image:
      "https://www.lummi.ai/api/render/image/327e46ae-cca2-4c02-9b9f-b3272f943324?token=eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjMyN2U0NmFlLWNjYTItNGMwMi05YjlmLWIzMjcyZjk0MzMyNCIsImRvd25sb2FkU2l6ZSI6Im1lZGl1bSIsInJlbmRlclNwZWNzIjp7ImVmZmVjdHMiOnsicmVmcmFtZSI6e319fSwic2hvdWxkQXV0b0Rvd25sb2FkIjpmYWxzZSwianRpIjoiWlhjMl9Yd2FJY0w1ZDZ3V3dDdWxuIiwiaWF0IjoxNzM4MjY3NTI1LCJleHAiOjE3MzgyNjc1ODV9.BGSD_ANj91L-P6H_5VptMaSgHoQ9nL_lfx3buympcE8",
    content:
      "Join us for the Summer Opening event, where we celebrate the start of a vibrant season filled with art and culture.",
    author: {
      name: "Zé Manuel",
      role: "Fundador, Summer Opening",
    },
  },
  {
    id: 2,
    title: "Fashion",
    image:
      "https://www.lummi.ai/api/render/image/2a19122c-0942-447f-8f84-490bf5ad75ab?token=eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjJhMTkxMjJjLTA5NDItNDQ3Zi04Zjg0LTQ5MGJmNWFkNzVhYiIsImRvd25sb2FkU2l6ZSI6Im1lZGl1bSIsInJlbmRlclNwZWNzIjp7ImVmZmVjdHMiOnsicmVmcmFtZSI6e319fSwic2hvdWxkQXV0b0Rvd25sb2FkIjpmYWxzZSwianRpIjoiY3Z6bURUVTJCcXhPd0VTVHh1WmFZIiwiaWF0IjoxNzM4MjY3NTY0LCJleHAiOjE3MzgyNjc2MjR9.ZWR_b1uD4KDdRUTTei1aO9VWxdfgLLOL6CNzqtQrGbY",
    content:
      "Explore the latest trends in fashion at our exclusive showcase, featuring renowned designers and unique styles.",
    author: {
      name: "Maria Silva",
      role: "Fashion Curator",
    },
  },
  {
    id: 3,
    title: "Gallery Art",
    image:
      "https://www.lummi.ai/api/render/image/098aec2d-542c-4124-8fca-33ac81e98d81?token=eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjA5OGFlYzJkLTU0MmMtNDEyNC04ZmNhLTMzYWM4MWU5OGQ4MSIsImRvd25sb2FkU2l6ZSI6Im1lZGl1bSIsInJlbmRlclNwZWNzIjp7ImVmZmVjdHMiOnsicmVmcmFtZSI6e319fSwic2hvdWxkQXV0b0Rvd25sb2FkIjpmYWxzZSwianRpIjoiNWZUbXZCVm05TXJRUFptTzVySVYzIiwiaWF0IjoxNzM4MjY2OTAwLCJleHAiOjE3MzgyNjY5NjB9.mxH3AqSsa3E7MP-ogk07ZqRm1_Ayejx5a-styp6tRaI",
    content:
      "Immerse yourself in the world of art at our gallery, showcasing stunning pieces from emerging and established artists.",
    author: {
      name: "João Santos",
      role: "Gallery Director",
    },
  },
  {
    id: 4,
    title: "Dreams",
    image:
      "https://www.lummi.ai/api/render/image/ee59a648-48ef-45cf-8eef-b1580308331d?token=eyJhbGciOiJIUzI1NiJ9.eyJpZCI6ImVlNTlhNjQ4LTQ4ZWYtNDVjZi04ZWVmLWIxNTgwMzA4MzMxZCIsImRvd25sb2FkU2l6ZSI6Im1lZGl1bSIsInJlbmRlclNwZWNzIjp7ImVmZmVjdHMiOnsicmVmcmFtZSI6e319fSwic2hvdWxkQXV0b0Rvd25sb2FkIjpmYWxzZSwianRpIjoibk1jTVFSUHpnNEZMd1hLX3ZNdGpuIiwiaWF0IjoxNzM4MjY2OTIzLCJleHAiOjE3MzgyNjY5ODN9.RRl6ZbXGLz7MiiWR1oCudynBnV7DQxeLI1PIAKuP4Ew",
    content:
      "Join us on a journey through dreams, exploring the subconscious and the art of dreaming.",
    author: {
      name: "Ana Rodrigues",
      role: "Dream Interpreter",
    },
  },
]

const smoothEasing = [0.4, 0.0, 0.2, 1]

export default function ExpandableCards() {
  const [selectedCard, setSelectedCard] = useState<number | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      const scrollWidth = scrollRef.current.scrollWidth
      const clientWidth = scrollRef.current.clientWidth
      scrollRef.current.scrollLeft = (scrollWidth - clientWidth) / 2
    }
  }, [])

  const handleCardClick = (id: number) => {
    if (selectedCard === id) {
      setSelectedCard(null)
    } else {
      setSelectedCard(id)
    }
  }

  return (
    <div className="flex w-full flex-col gap-4 overflow-scroll p-4">
      <div
        ref={scrollRef}
        className="scrollbar-hide mx-auto flex overflow-x-auto pt-4 pb-8"
        style={{
          scrollSnapType: "x mandatory",
          scrollPaddingLeft: "20%",
        }}
      >
        {cards.map((card) => (
          <motion.div
            key={card.id}
            layout
            className="bg-light-50 dark:bg-dark-50 relative mr-4 h-[300px] flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl shadow-lg"
            style={{
              scrollSnapAlign: "start",
            }}
            animate={{
              width: selectedCard === card.id ? "500px" : "200px",
            }}
            transition={{
              duration: 0.5,
              ease: smoothEasing,
            }}
            onClick={() => handleCardClick(card.id)}
          >
            <div className="relative h-full w-[200px]">
              <Image
                src={card.image || "/placeholder.svg"}
                alt={card.title}
                width={200}
                height={300}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20" />
              <div className="text-light-50 dark:text-dark-950 absolute inset-0 flex flex-col justify-between p-6">
                <h2 className="text-2xl font-bold">{card.title}</h2>
                <div className="flex items-center gap-2">
                  <button className="bg-light-50/30 dark:bg-dark-950/30 flex h-12 w-12 items-center justify-center rounded-full backdrop-blur-sm transition-transform hover:scale-110">
                    <Play className="text-light-50 dark:text-dark-950 h-6 w-6" />
                  </button>
                  <span className="text-sm font-medium">Play video</span>
                </div>
              </div>
            </div>
            <AnimatePresence mode="popLayout">
              {selectedCard === card.id && (
                <motion.div
                  initial={{ width: 0, opacity: 0, filter: "blur(5px)" }}
                  animate={{ width: "300px", opacity: 1, filter: "blur(0px)" }}
                  exit={{ width: 0, opacity: 0, filter: "blur(5px)" }}
                  transition={{
                    duration: 0.5,
                    ease: smoothEasing,
                    opacity: { duration: 0.3, delay: 0.2 },
                  }}
                  className="bg-light-50 dark:bg-dark-50 absolute top-0 right-0 h-full"
                >
                  <motion.div
                    className="flex h-full flex-col justify-between p-8"
                    initial={{ opacity: 0, x: 20, filter: "blur(5px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, x: 20, filter: "blur(5px)" }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                  >
                    <p className="text-light-900 dark:text-dark-900 text-sm">
                      {card.content}
                    </p>
                    {card.author && (
                      <div className="mt-4 flex items-center gap-3">
                        <div className="bg-light-500 dark:bg-dark-300 h-12 w-12 rounded-full" />
                        <div>
                          <p className="text-light-900 dark:text-dark-900 font-semibold">
                            {card.author.name}
                          </p>
                          <p className="text-light-800 dark:text-dark-800 text-xs">
                            {card.author.role}
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
