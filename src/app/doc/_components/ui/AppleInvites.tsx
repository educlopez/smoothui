"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Crown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { wrap } from "popmotion";





interface Participant {
  avatar: string
}

interface Event {
  id: number
  title: string
  subtitle: string
  location: string
  image: string
  badge?: string
  participants: Participant[]
}

const events: Event[] = [
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

export default function AppleInvites() {
  const [[page, direction], setPage] = useState([0, 0])

  const activeIndex = wrap(0, events.length, page)

  useEffect(() => {
    const timer = setInterval(() => {
      setPage(([prevPage, prevDirection]) => [prevPage + 1, 1])
    }, 3000)

    return () => clearInterval(timer)
  }, [])

  const visibleEvents = [-1, 0, 1].map(
    (offset) => events[wrap(0, events.length, activeIndex + offset)]
  )

  return (
    <div className="relative flex h-full w-[1200px] items-center justify-center">
      <AnimatePresence initial={false} custom={direction}>
        {visibleEvents.map((event, index) => (
          <motion.div
            key={event.id}
            custom={direction}
            variants={variants}
            initial="hidden"
            animate={index === 1 ? "center" : index === 0 ? "left" : "right"}
            exit="hidden"
            className="absolute top-1/2 left-1/2 h-[250] w-[160px] origin-center -translate-y-1/2 md:h-[500px] md:w-[320px]"
          >
            <div className="relative h-full w-full overflow-hidden rounded-3xl">
              <Image
                src={event.image}
                alt={event.title}
                className="h-full w-full object-cover"
                fill
                sizes="(min-width: 640px) 320px, 100vw"
                priority
              />

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
                  {event.participants.map((participant, idx) => (
                    <Image
                      key={idx}
                      src={participant.avatar}
                      alt={`Participant ${idx + 1}`}
                      width={36}
                      height={36}
                      className="w-6 rounded-full md:h-9 md:w-9"
                    />
                  ))}
                </div>
                <p className="text-md mb-1 text-center font-bold md:text-2xl">
                  {event.title}
                </p>
                <p className="text-center text-xs opacity-90 md:text-sm">
                  {event.subtitle}
                </p>
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