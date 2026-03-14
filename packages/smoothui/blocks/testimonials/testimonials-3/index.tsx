"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/shadcn-ui/components/ui/avatar";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { getAvatarUrl, getTestimonials } from "@smoothui/data";
import { Star } from "lucide-react";
import { motion } from "motion/react";

const testimonials = getTestimonials(4);

export function TestimonialsStars() {
  return (
    <section>
      <div className="py-24">
        <div className="container mx-auto w-full max-w-5xl px-6">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="font-semibold text-4xl text-foreground">
              Developer Reviews
            </h2>
            <p className="my-4 text-balance text-lg text-muted-foreground">
              See what the community is saying about SmoothUI. Real feedback
              from developers building amazing user experiences.
            </p>
          </motion.div>

          <motion.div
            animate={{ opacity: 1 }}
            className="grid 3xl:grid-cols-3 3xl:gap-12 gap-6 lg:grid-cols-2"
            initial={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="group rounded-2xl border border-transparent px-4 py-3 duration-200 hover:border-border hover:bg-background/50"
                initial={{ opacity: 0, y: 30 }}
                key={testimonial.name}
                transition={{
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                  delay: index * 0.15,
                }}
                whileHover={{
                  y: -4,
                  transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
                }}
              >
                <motion.div
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex gap-1"
                  initial={{ opacity: 0, scale: 0.8 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.15 + 0.2,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <motion.div
                      animate={{ opacity: 1, scale: 1 }}
                      initial={{ opacity: 0, scale: 0 }}
                      key={`${testimonial.name}-star-${i}`}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.15 + 0.2 + i * 0.05,
                        ease: [0.68, -0.55, 0.265, 1.55],
                      }}
                    >
                      <Star
                        className={cn(
                          "size-4 transition-colors duration-200",
                          i < (testimonial.stars || 0)
                            ? "fill-accent stroke-accent"
                            : "fill-primary stroke-border"
                        )}
                      />
                    </motion.div>
                  ))}
                </motion.div>

                <motion.p
                  animate={{ opacity: 1, y: 0 }}
                  className="my-4 text-foreground"
                  initial={{ opacity: 0, y: 10 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.15 + 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {testimonial.content}
                </motion.p>

                <motion.div
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.15 + 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Avatar className="size-6 border border-transparent shadow ring-1 ring-foreground/10">
                    <AvatarImage
                      alt={testimonial.name}
                      src={getAvatarUrl(testimonial.avatar, 48)}
                    />
                    <AvatarFallback>
                      {testimonial.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="font-medium text-foreground text-sm">
                    {testimonial.name}
                  </div>
                  <span
                    aria-hidden="true"
                    className="size-1 rounded-full bg-foreground/25"
                  />
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
  );
}

export default TestimonialsStars;
