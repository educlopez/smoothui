"use client"

import { useEffect, useState } from "react"
import { Crown } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { wrap } from "popmotion"

export interface Participant {
  avatar: string
}

export interface Event {
  id: number
  title?: string
  subtitle?: string
  location: string
  image?: string
  badge?: string
  participants?: Participant[]
  backgroundClassName?: string
}

const defaultEvents: Event[] = [
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

const variants = {
  center: {
    x: "-50%",
    rotate: 0,
    scale: 1,
    opacity: 1,
    zIndex: 3,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  left: {
    x: "-130%",
    rotate: -12,
    scale: 0.9,
    opacity: 0.8,
    zIndex: 2,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  right: {
    x: "30%",
    rotate: 12,
    scale: 0.9,
    opacity: 0.8,
    zIndex: 2,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  hidden: {
    opacity: 0,
    zIndex: 1,
    transition: { duration: 0.3 },
  },
}

export interface AppleInvitesProps {
  events?: Event[]
  interval?: number
  className?: string
  cardClassName?: string
  activeIndex?: number
  onChange?: (index: number) => void
  cardWidth?: number | string
  cardHeight?: number | string
}

export default function AppleInvites({
  events = defaultEvents,
  interval = 3000,
  className = "",
  cardClassName = "",
  activeIndex: controlledIndex,
  onChange,
  cardWidth = 320,
  cardHeight = 500,
}: AppleInvitesProps) {
  const [internalPage, setInternalPage] = useState(0)
  const [direction, setDirection] = useState(0)

  const page = controlledIndex !== undefined ? controlledIndex : internalPage
  const setPage = (val: number, dir: number) => {
    if (onChange) onChange(val)
    else {
      setInternalPage(val)
      setDirection(dir)
    }
  }

  const activeIndex = wrap(0, events.length, page)

  useEffect(() => {
    const timer = setInterval(() => {
      setPage(page + 1, 1)
    }, interval)
    return () => clearInterval(timer)
  }, [page, interval, events.length])

  const visibleEvents = [-1, 0, 1].map(
    (offset) => events[wrap(0, events.length, activeIndex + offset)]
  )

  return (
    <div
      className={`relative flex h-full w-full items-center justify-center ${className}`}
    >
      <AnimatePresence initial={false} custom={direction}>
        {visibleEvents.map((event, index) => (
          <motion.div
            key={event.id}
            custom={direction}
            variants={variants}
            initial="hidden"
            animate={index === 1 ? "center" : index === 0 ? "left" : "right"}
            exit="hidden"
            style={{
              width:
                typeof cardWidth === "number" ? `${cardWidth}px` : cardWidth,
              height:
                typeof cardHeight === "number" ? `${cardHeight}px` : cardHeight,
            }}
            className={`absolute top-1/2 left-1/2 origin-center -translate-y-1/2 ${cardClassName}`}
          >
            <div className="bg-primary relative h-full w-full overflow-hidden rounded-3xl">
              {event.backgroundClassName ? (
                <div className={`h-full w-full ${event.backgroundClassName}`} />
              ) : event.image ? (
                <img
                  src={event.image}
                  alt={event.title || ""}
                  className="h-full w-full object-cover"
                />
              ) : null}
              {/* Badge */}
              <div className="absolute top-4 left-4 z-3">
                <span className="flex flex-row items-center gap-2 rounded-full bg-black/30 px-3 py-1 text-xs font-medium text-white backdrop-blur-xl md:text-sm">
                  <Crown size={14} />
                  {event.badge}
                </span>
              </div>
              {/* Content */}
              <div className="absolute bottom-0 z-3 w-full overflow-hidden rounded-b-3xl p-6 text-white">
                {/* Participant Avatars */}
                <div className="mx-auto mb-2 flex items-center justify-center gap-2">
                  {event.participants?.map((participant, idx) => (
                    <img
                      key={idx}
                      src={participant.avatar}
                      alt={`Participant ${idx + 1}`}
                      className="w-6 rounded-full md:h-9 md:w-9"
                    />
                  ))}
                </div>
                {event.title && (
                  <p className="text-md mb-1 text-center font-bold md:text-2xl">
                    {event.title}
                  </p>
                )}
                {event.subtitle && (
                  <p className="text-center text-xs opacity-90 md:text-sm">
                    {event.subtitle}
                  </p>
                )}
                <p className="text-center text-xs opacity-90 md:text-sm">
                  {event.location}
                </p>
              </div>
              <div className="fixed inset-x-0 bottom-0 isolate z-2 h-1/2">
                <div className="gradient-mask-t-0 absolute inset-0 overflow-hidden rounded-3xl backdrop-blur-[1px]"></div>
                <div className="gradient-mask-t-0 absolute inset-0 overflow-hidden rounded-3xl backdrop-blur-[2px]"></div>
                <div className="gradient-mask-t-0 absolute inset-0 overflow-hidden rounded-3xl backdrop-blur-[3px]"></div>
                <div className="gradient-mask-t-0 absolute inset-0 overflow-hidden rounded-3xl backdrop-blur-[6px]"></div>
                <div className="gradient-mask-t-0 absolute inset-0 overflow-hidden rounded-3xl backdrop-blur-[12px]"></div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
