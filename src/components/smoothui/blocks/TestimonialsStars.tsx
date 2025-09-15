"use client"

import { Star } from "lucide-react"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const testimonials = [
  {
    name: "Shadcn",
    role: "Creator of shadcn/ui",
    stars: 4,
    avatar: "https://github.com/shadcn.png",
    content: "SmoothUI is my go-to for fast, beautiful UIs.",
  },
  {
    name: "Midudev",
    role: "Dev & Educator",
    stars: 5,
    avatar: "https://github.com/midudev.png",
    content: "Incredible DX. Animations feel native!",
  },
  {
    name: "Rauch",
    role: "Vercel CEO",
    stars: 5,
    avatar: "https://github.com/rauchg.png",
    content: "The best UI kit for React I've used.",
  },
  {
    name: "Pheralb",
    role: "Open Source Dev",
    stars: 5,
    avatar: "https://github.com/pheralb.png",
    content: "So smooth, so easy. Instantly impressive.",
  },
]

export function TestimonialsStars() {
  return (
    <section>
      <div className="py-24">
        <div className="container mx-auto w-full max-w-5xl px-6">
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-foreground text-4xl font-semibold">
              Developer Reviews
            </h2>
            <p className="text-muted-foreground my-4 text-lg text-balance">
              See what the community is saying about SmoothUI. Real feedback
              from developers building amazing user experiences.
            </p>
          </motion.div>

          <motion.div
            className="3xl:grid-cols-3 3xl:gap-12 grid gap-6 lg:grid-cols-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                  delay: index * 0.15,
                }}
                whileHover={{
                  y: -4,
                  transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
                }}
                className="group hover:bg-background/50 hover:border-border rounded-2xl border border-transparent px-4 py-3 duration-200"
              >
                <motion.div
                  className="flex gap-1"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.15 + 0.2,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <motion.div
                      key={`${testimonial.name}-star-${i}`}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.15 + 0.2 + i * 0.05,
                        ease: [0.68, -0.55, 0.265, 1.55],
                      }}
                    >
                      <Star
                        className={cn(
                          "size-4 transition-colors duration-200",
                          i < testimonial.stars
                            ? "fill-accent stroke-accent"
                            : "fill-primary stroke-border"
                        )}
                      />
                    </motion.div>
                  ))}
                </motion.div>

                <motion.p
                  className="text-foreground my-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.15 + 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {testimonial.content}
                </motion.p>

                <motion.div
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.15 + 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Avatar className="ring-foreground/10 size-6 border border-transparent ring-1 shadow">
                    <AvatarImage
                      src={testimonial.avatar}
                      alt={testimonial.name}
                    />
                    <AvatarFallback>
                      {testimonial.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-foreground text-sm font-medium">
                    {testimonial.name}
                  </div>
                  <span
                    aria-hidden
                    className="bg-foreground/25 size-1 rounded-full"
                  ></span>
                  <span className="text-muted-foreground text-sm">
                    {testimonial.role}
                  </span>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
