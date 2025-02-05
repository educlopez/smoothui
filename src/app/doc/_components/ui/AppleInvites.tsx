"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Crown } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { wrap } from "popmotion"

import birthday from "@/app/doc/_components/resources/AppleInvites/birthday.jpeg"
import golf from "@/app/doc/_components/resources/AppleInvites/golf.jpeg"
import movie from "@/app/doc/_components/resources/AppleInvites/movie.jpeg"
import yoga from "@/app/doc/_components/resources/AppleInvites/yoga.jpeg"

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
    image: yoga.src,
    badge: "Hosting",
    participants: [{ avatar: "/pixel-edu-calvo.png" }],
  },
  {
    id: 2,
    title: "Tyler Turns 3!",
    subtitle: "Sat, June 14, 3:00 PM",
    location: "Central Park",
    image: birthday.src,
    badge: "Going",
    participants: [{ avatar: "/pixel-edu-calvo.png" }],
  },
  {
    id: 3,
    title: "Golf party",
    subtitle: "Sun, April 15, 9:00 AM",
    location: "Golf Park",
    image: golf.src,
    badge: "Going",
    participants: [{ avatar: "/pixel-edu-calvo.png" }],
  },
  {
    id: 4,
    title: "Movie Night",
    subtitle: "Fri, June 20, 8:00 PM",
    location: "Cine Town",
    image: movie.src,
    badge: "Interested",
    participants: [{ avatar: "/pixel-edu-calvo.png" }],
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
            className="absolute top-1/2 left-1/2 origin-center -translate-y-1/2"
            style={{
              width: 320,
              height: 500,
            }}
          >
            <div className="relative h-full w-full overflow-hidden rounded-3xl">
              <Image
                src={event.image}
                alt={event.title}
                className="h-full w-full object-cover"
                layout="fill"
              />

              {/* Badge */}
              <div className="absolute top-4 left-4 z-3">
                <span className="flex flex-row items-center gap-2 rounded-full bg-black/30 px-3 py-1 text-sm font-medium text-white backdrop-blur-xl">
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
                      className="rounded-full"
                    />
                  ))}
                </div>
                <h3 className="mb-1 text-center text-2xl font-bold">
                  {event.title}
                </h3>
                <p className="text-center text-sm opacity-90">
                  {event.subtitle}
                </p>
                <p className="text-center text-sm opacity-90">
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
