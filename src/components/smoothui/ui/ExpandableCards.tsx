"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Play } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { getAllPeople, getAvatarUrl } from "@/app/doc/data/peopleData"

export interface Card {
  id: number
  title: string
  image: string
  content: string
  author?: {
    name: string
    role: string
    image: string
  }
}

const getDefaultCards = (): Card[] => {
  const people = getAllPeople()

  return [
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
}

const smoothEasing = [0.4, 0.0, 0.2, 1]

export interface ExpandableCardsProps {
  cards?: Card[]
  selectedCard?: number | null
  onSelect?: (id: number | null) => void
  className?: string
  cardClassName?: string
}

export default function ExpandableCards({
  cards = getDefaultCards(),
  selectedCard: controlledSelected,
  onSelect,
  className = "",
  cardClassName = "",
}: ExpandableCardsProps) {
  const [internalSelected, setInternalSelected] = useState<number | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const selectedCard =
    controlledSelected !== undefined ? controlledSelected : internalSelected

  useEffect(() => {
    if (scrollRef.current) {
      const scrollWidth = scrollRef.current.scrollWidth
      const clientWidth = scrollRef.current.clientWidth
      scrollRef.current.scrollLeft = (scrollWidth - clientWidth) / 2
    }
  }, [])

  const handleCardClick = (id: number) => {
    if (selectedCard === id) {
      if (onSelect) onSelect(null)
      else setInternalSelected(null)
    } else {
      if (onSelect) onSelect(id)
      else setInternalSelected(id)
      // Center the clicked card in view
      const cardElement = document.querySelector(`[data-card-id="${id}"]`)
      if (cardElement) {
        cardElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        })
      }
    }
  }

  return (
    <div
      className={`flex w-full flex-col gap-4 overflow-scroll p-4 ${className}`}
    >
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
            data-card-id={card.id}
            className={`bg-background relative mr-4 h-[300px] flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl border shadow-lg ${cardClassName}`}
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
              <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">
                <h2 className="text-2xl font-bold">{card.title}</h2>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Play video"
                    className="bg-background/30 flex h-12 w-12 items-center justify-center rounded-full backdrop-blur-sm transition-transform hover:scale-110"
                  >
                    <Play className="h-6 w-6 text-white" />
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
                  className="bg-background absolute top-0 right-0 h-full"
                >
                  <motion.div
                    className="flex h-full flex-col justify-between p-8"
                    initial={{ opacity: 0, x: 20, filter: "blur(5px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, x: 20, filter: "blur(5px)" }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                  >
                    <p className="text-primary-foreground text-sm">
                      {card.content}
                    </p>
                    {card.author && (
                      <div className="mt-4 flex items-center gap-3">
                        <div className="bg-primary h-12 w-12 overflow-hidden rounded-full border">
                          <Image
                            src={card.author.image}
                            alt={card.author.name}
                            width={48}
                            height={48}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-foreground font-semibold">
                            {card.author.name}
                          </p>
                          <p className="text-primary-foreground text-xs">
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
