"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"

interface TeamCarouselProps {
  title?: string
  subtitle?: string
  description?: string
  members?: Array<{
    name: string
    role: string
    experience?: string
    avatar: string
  }>
}

export function TeamCarousel({
  title = "Tech Pioneers",
  subtitle = "building the future",
  description = "We bring together brilliant developers, engineers, and tech innovators to create groundbreaking digital solutions.",
  members = [
    {
      name: "Eduardo Calvo",
      role: "CEO & Founder",
      experience: "8+ years of experience",
      avatar: "https://github.com/educlopez.png",
    },
    {
      name: "Emil Kowalski",
      role: "CTO",
      experience: "10+ years of experience",
      avatar: "https://github.com/emilkowalski.png",
    },
    {
      name: "Rauno Freiberg",
      role: "Head of Design",
      experience: "7+ years of experience",
      avatar: "https://github.com/raunofreiberg.png",
    },
    {
      name: "Lee Robinson",
      role: "Product Manager",
      experience: "6+ years of experience",
      avatar: "https://github.com/leerob.png",
    },
    {
      name: "Shadcn",
      role: "Lead Developer",
      experience: "5+ years of experience",
      avatar: "https://github.com/shadcn.png",
    },
    {
      name: "Guillermo Rauch",
      role: "CEO at Vercel",
      experience: "12+ years of experience",
      avatar: "https://github.com/rauchg.png",
    },
    {
      name: "Dan Abramov",
      role: "React Core Team",
      experience: "9+ years of experience",
      avatar: "https://github.com/gaearon.png",
    },
    {
      name: "Kent C. Dodds",
      role: "Testing Expert",
      experience: "11+ years of experience",
      avatar: "https://github.com/kentcdodds.png",
    },
    {
      name: "Ryan Florence",
      role: "Remix Co-founder",
      experience: "13+ years of experience",
      avatar: "https://github.com/ryanflorence.png",
    },
    {
      name: "Sebastian Markbåge",
      role: "React Core Team",
      experience: "10+ years of experience",
      avatar: "https://github.com/sebmarkbage.png",
    },
  ],
}: TeamCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const cardsPerView = 3 // Number of cards visible at once

  useEffect(() => {
    if (!isAutoPlaying || isTransitioning) return

    const interval = setInterval(() => {
      setCurrentIndex(
        (prev) => (prev + 1) % (members.length - cardsPerView + 1)
      )
    }, 5000) // Increased to 5 seconds for better readability

    return () => clearInterval(interval)
  }, [members.length, isAutoPlaying, isTransitioning])

  const nextSlide = () => {
    if (isTransitioning) return
    const maxIndex = members.length - cardsPerView
    if (currentIndex >= maxIndex) return // Don't go beyond the last member

    setIsTransitioning(true)
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex))
    setIsAutoPlaying(false)

    // Resume auto-play after 1.5 seconds (reduced from 3 seconds)
    setTimeout(() => {
      setIsTransitioning(false)
      setIsAutoPlaying(true)
    }, 1500)
  }

  const prevSlide = () => {
    if (isTransitioning) return
    if (currentIndex <= 0) return // Don't go beyond the first member

    setIsTransitioning(true)
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
    setIsAutoPlaying(false)

    // Resume auto-play after 1.5 seconds (reduced from 3 seconds)
    setTimeout(() => {
      setIsTransitioning(false)
      setIsAutoPlaying(true)
    }, 1500)
  }

  return (
    <section className="overflow-hidden py-32">
      <div className="mx-auto max-w-5xl px-8 lg:px-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl font-medium md:text-6xl">
            {title} <br />
            <span className="text-foreground/50">{subtitle}</span>
          </h2>
          <p className="text-foreground/70 mt-6 max-w-md">{description}</p>
        </motion.div>

        <div className="relative">
          {/* Navigation Buttons */}
          <div className="mt-4 hidden items-center justify-end gap-4 md:flex">
            <motion.button
              onClick={prevSlide}
              disabled={currentIndex === 0 || isTransitioning}
              className="focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 static top-1/2 -left-12 inline-flex size-11 shrink-0 translate-x-0 translate-y-0 items-center justify-center gap-2 rounded-full border text-sm font-medium whitespace-nowrap shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-arrow-left"
                aria-hidden="true"
              >
                <path d="m12 19-7-7 7-7"></path>
                <path d="M19 12H5"></path>
              </svg>
              <span className="sr-only">Previous slide</span>
            </motion.button>
            <motion.button
              onClick={nextSlide}
              disabled={
                currentIndex >= members.length - cardsPerView || isTransitioning
              }
              className="focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 static top-1/2 -right-12 inline-flex size-11 shrink-0 translate-x-0 translate-y-0 items-center justify-center gap-2 rounded-full border text-sm font-medium whitespace-nowrap shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-arrow-right"
                aria-hidden="true"
              >
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
              <span className="sr-only">Next slide</span>
            </motion.button>
          </div>

          {/* Carousel Content */}
          <div className="mt-16 [&>div[data-slot=carousel-content]]:overflow-visible">
            <div className="overflow-hidden" data-slot="carousel-content">
              <motion.div
                className="-ml-4 flex max-w-[min(calc(100vw-4rem),24rem)] select-none"
                animate={{
                  x: `-${currentIndex * (288 + 16)}px`, // 288px card width + 16px gap
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
              >
                {members.map((member, index) => (
                  <div
                    key={member.name}
                    data-slot="carousel-item"
                    className="max-w-72 min-w-0 shrink-0 grow-0 basis-full pl-4"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="border-border bg-background rounded-2xl border p-7 text-center"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="border-border mx-auto size-20 rounded-full border"
                      />
                      <div className="mt-6 flex flex-col justify-center">
                        <p className="text-foreground text-lg font-medium">
                          {member.name}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {member.role}
                        </p>
                      </div>
                      <div
                        data-orientation="horizontal"
                        role="none"
                        data-slot="separator-root"
                        className="bg-border from-background via-border to-background my-6 shrink-0 bg-linear-to-r data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px"
                      />
                      <p className="text-muted-foreground text-sm">
                        {member.experience}
                      </p>
                    </motion.div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
