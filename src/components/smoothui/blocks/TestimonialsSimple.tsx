"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "motion/react"

import { getAvatarUrl, getTestimonials } from "@/app/doc/data/peopleData"

const testimonials = getTestimonials(4).map((testimonial) => ({
  quote: testimonial.content || "",
  avatar: testimonial.avatar,
  name: testimonial.name,
  role: testimonial.role,
}))

const DURATION = 5000 // ms
const BAR_WIDTH = 50
const CIRCLE_SIZE = 12

export function TestimonialsSimple() {
  const [index, setIndex] = useState(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setIndex((prev) => (prev + 1) % testimonials.length)
    }, DURATION)
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <section className="bg-background relative flex flex-col items-center py-16">
      <div className="flex w-full max-w-5xl flex-col items-center justify-center px-4">
        <div className="min-h-[120px] w-full">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="text-foreground mb-8 text-center text-2xl leading-tight font-semibold md:text-4xl"
            >
              “{testimonials[index].quote}”
            </motion.blockquote>
          </AnimatePresence>
        </div>
        <div className="flex w-full max-w-lg items-center justify-center gap-8 pt-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={index}
              initial={{ opacity: 0, filter: "blur(8px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(8px)" }}
              transition={{ type: "spring", duration: 0.5 }}
              className="flex items-center gap-4"
            >
              <Image
                src={getAvatarUrl(testimonials[index].avatar, 96)}
                alt={testimonials[index].name + " avatar"}
                width={48}
                height={48}
                className="bg-foreground/10 h-12 w-12 rounded-full border object-cover"
              />
              <div className="border-muted-foreground/30 mx-4 h-8 border-l" />
              <div className="text-left">
                <div className="text-foreground text-lg font-medium italic">
                  {testimonials[index].name}
                </div>
                <div className="text-muted-foreground text-base">
                  {testimonials[index].role}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        {/* Progress Bar & Circles Indicator */}
        <div className="mx-auto mt-8 flex w-full max-w-lg justify-center gap-3">
          {testimonials.map((testimonial, i) => {
            const isActive = i === index
            return (
              <motion.span
                key={`testimonial-${testimonial.name}-${i}`}
                layout
                initial={false}
                animate={{
                  width: isActive ? BAR_WIDTH : CIRCLE_SIZE,
                  height: CIRCLE_SIZE,
                  borderRadius: isActive ? 8 : 999,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  duration: 0.4,
                }}
                className="bg-foreground/10 relative block overflow-hidden"
                style={{
                  minWidth: CIRCLE_SIZE,
                  maxWidth: BAR_WIDTH,
                  border: "none",
                }}
              >
                {isActive && (
                  <motion.div
                    key={index}
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    exit={{ width: 0 }}
                    transition={{ duration: DURATION / 1000, ease: "linear" }}
                    className="bg-brand absolute top-0 left-0 h-full rounded-lg"
                  />
                )}
              </motion.span>
            )
          })}
        </div>
      </div>
    </section>
  )
}
