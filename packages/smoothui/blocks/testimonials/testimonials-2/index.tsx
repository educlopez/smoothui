"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/shadcn-ui/components/ui/avatar";
import { getAvatarUrl, getTestimonials } from "@smoothui/data";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

const testimonials = getTestimonials(7);

export function TestimonialsGrid() {
  const shouldReduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [autoplay] = useState(false);

  const handleNext = useCallback(() => {
    setActive((prev) => (prev + 1) % testimonials.length);
  }, []);

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const isActive = (index: number) => index === active;

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay, handleNext]);

  return (
    <section>
      <div className="min-h-auto bg-muted py-24">
        <div className="container mx-auto w-full max-w-6xl px-6">
          <motion.div
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            className="mb-12"
            initial={
              shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }
            }
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
            }
          >
            {/* Layout: Title on left, Testimonial on right */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
              {/* Left side - Title and description */}
              <div className="flex flex-col justify-center">
                <h2 className="mb-4 font-semibold text-4xl text-foreground">
                  What Developers Say
                </h2>
                <p className="text-balance text-foreground/70 text-lg">
                  Join thousands of developers who are building faster, more
                  beautiful UIs with SmoothUI. See what they&apos;re saying
                  about their experience.
                </p>
              </div>
              {/* Right side - Testimonial card */}
              <div className="relative flex min-h-fit flex-col items-end">
                {/* Navigation Arrows - Above the card */}
                <div className="mb-4 flex justify-center gap-2">
                  <motion.button
                    animate={
                      shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }
                    }
                    aria-label="Previous testimonial"
                    className="group/button flex h-8 w-8 items-center justify-center rounded-full border bg-background shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-xl"
                    initial={
                      shouldReduceMotion
                        ? { opacity: 1 }
                        : { opacity: 0, x: -20 }
                    }
                    onClick={handlePrev}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { duration: 0.3, delay: 0.4 }
                    }
                    type="button"
                    whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                  >
                    <ChevronLeft className="h-5 w-5 text-foreground transition-transform duration-300 group-hover/button:-rotate-12" />
                  </motion.button>
                  <motion.button
                    animate={
                      shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }
                    }
                    aria-label="Next testimonial"
                    className="group/button flex h-8 w-8 items-center justify-center rounded-full border bg-background shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-xl"
                    initial={
                      shouldReduceMotion
                        ? { opacity: 1 }
                        : { opacity: 0, x: 20 }
                    }
                    onClick={handleNext}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { duration: 0.3, delay: 0.4 }
                    }
                    type="button"
                    whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                  >
                    <ChevronRight className="h-5 w-5 text-foreground transition-transform duration-300 group-hover/button:rotate-12" />
                  </motion.button>
                </div>
                <div className="relative h-full w-full max-w-md">
                  <AnimatePresence>
                    {testimonials.map((testimonial, index) => (
                      <motion.div
                        animate={
                          shouldReduceMotion
                            ? { opacity: isActive(index) ? 1 : 0 }
                            : {
                                opacity: isActive(index) ? 1 : 0,
                                scale: isActive(index) ? 1 : 0.95,
                                y: isActive(index) ? 0 : 30,
                              }
                        }
                        className={`absolute inset-0 min-h-fit ${isActive(index) ? "z-10" : "z-0"}`}
                        exit={
                          shouldReduceMotion
                            ? { opacity: 0, transition: { duration: 0 } }
                            : {
                                opacity: 0,
                                scale: 0.9,
                                y: -30,
                              }
                        }
                        initial={
                          shouldReduceMotion
                            ? { opacity: 0 }
                            : {
                                opacity: 0,
                                scale: 0.9,
                                y: 30,
                              }
                        }
                        key={testimonial.name}
                        transition={
                          shouldReduceMotion
                            ? { duration: 0 }
                            : {
                                duration: 0.4,
                                ease: "easeInOut",
                              }
                        }
                      >
                        <div className="rounded-2xl border bg-background px-6 py-6 shadow-lg transition-all duration-200">
                          <motion.p
                            animate={
                              shouldReduceMotion
                                ? { opacity: 1 }
                                : { opacity: 1, y: 0 }
                            }
                            className="mb-6 text-foreground text-lg"
                            initial={
                              shouldReduceMotion
                                ? { opacity: 1 }
                                : { opacity: 0, y: 10 }
                            }
                            key={active}
                            transition={
                              shouldReduceMotion
                                ? { duration: 0 }
                                : { duration: 0.3 }
                            }
                          >
                            {(testimonial.content || "")
                              .split(" ")
                              .map((word, wordIndex) => (
                                <motion.span
                                  animate={
                                    shouldReduceMotion
                                      ? { opacity: 1 }
                                      : {
                                          filter: "blur(0px)",
                                          opacity: 1,
                                          y: 0,
                                        }
                                  }
                                  className="inline-block"
                                  initial={
                                    shouldReduceMotion
                                      ? { opacity: 1 }
                                      : {
                                          filter: "blur(4px)",
                                          opacity: 0,
                                          y: 5,
                                        }
                                  }
                                  key={`${testimonial.name}-word-${wordIndex}`}
                                  transition={
                                    shouldReduceMotion
                                      ? { duration: 0 }
                                      : {
                                          duration: 0.2,
                                          ease: "easeInOut",
                                          delay: wordIndex * 0.02,
                                        }
                                  }
                                >
                                  {word}&nbsp;
                                </motion.span>
                              ))}
                          </motion.p>
                          <motion.div
                            animate={
                              shouldReduceMotion
                                ? { opacity: 1 }
                                : { opacity: 1, y: 0 }
                            }
                            className="flex items-center gap-3"
                            initial={
                              shouldReduceMotion
                                ? { opacity: 1 }
                                : { opacity: 0, y: 10 }
                            }
                            transition={
                              shouldReduceMotion
                                ? { duration: 0 }
                                : { duration: 0.3, delay: 0.2 }
                            }
                          >
                            <Avatar className="size-8 border border-transparent shadow ring-1 ring-foreground/10">
                              <AvatarImage
                                alt={testimonial.name}
                                src={getAvatarUrl(testimonial.avatar, 64)}
                              />
                              <AvatarFallback>
                                {testimonial.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-semibold text-foreground">
                                {testimonial.name}
                              </div>
                              <span className="text-muted-foreground text-sm">
                                {testimonial.role}
                              </span>
                            </div>
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default TestimonialsGrid;
