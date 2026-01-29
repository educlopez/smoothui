"use client";

import { getAllPeople, getAvatarUrl, type Person } from "@smoothui/data";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

const CARDS_PER_VIEW = 3; // Number of cards visible at once
const CARD_WIDTH = 288;
const CARD_GAP = 16;
const AUTOPLAY_INTERVAL = 5000;
const TRANSITION_TIMEOUT = 1500;
const AVATAR_SIZE = 160;
const STAGGER_DELAY = 0.1;

interface TeamCarouselProps {
  title?: string;
  subtitle?: string;
  description?: string;
  members?: Person[];
}

export function TeamCarousel({
  title = "Tech Pioneers",
  subtitle = "building the future",
  description = "We bring together brilliant developers, engineers, and tech innovators to create groundbreaking digital solutions.",
  members = getAllPeople(),
}: TeamCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (!isAutoPlaying || isTransitioning) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex(
        (prev) => (prev + 1) % (members.length - CARDS_PER_VIEW + 1)
      );
    }, AUTOPLAY_INTERVAL);

    return () => clearInterval(interval);
  }, [members.length, isAutoPlaying, isTransitioning]);

  const nextSlide = () => {
    if (isTransitioning) {
      return;
    }
    const maxIndex = members.length - CARDS_PER_VIEW;
    if (currentIndex >= maxIndex) {
      return;
    }

    setIsTransitioning(true);
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
    setIsAutoPlaying(false);

    setTimeout(() => {
      setIsTransitioning(false);
      setIsAutoPlaying(true);
    }, TRANSITION_TIMEOUT);
  };

  const prevSlide = () => {
    if (isTransitioning) {
      return;
    }
    if (currentIndex <= 0) {
      return;
    }

    setIsTransitioning(true);
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
    setIsAutoPlaying(false);

    setTimeout(() => {
      setIsTransitioning(false);
      setIsAutoPlaying(true);
    }, TRANSITION_TIMEOUT);
  };

  return (
    <section className="overflow-hidden py-32">
      <div className="mx-auto max-w-5xl px-8 lg:px-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className="font-medium text-5xl md:text-6xl">
            {title} <br />
            <span className="text-foreground/50">{subtitle}</span>
          </h2>
          <p className="mt-6 max-w-md text-foreground/70">{description}</p>
        </motion.div>

        <div className="relative">
          {/* Navigation Buttons */}
          <div className="mt-4 hidden items-center justify-end gap-4 md:flex">
            <motion.button
              className="static top-1/2 -left-12 inline-flex size-11 shrink-0 translate-x-0 translate-y-0 items-center justify-center gap-2 whitespace-nowrap rounded-full border bg-background font-medium text-sm shadow-xs outline-none transition-all hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:border-input dark:bg-input/30 dark:aria-invalid:ring-destructive/40 dark:hover:bg-input/50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0"
              disabled={currentIndex === 0 || isTransitioning}
              onClick={prevSlide}
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                aria-hidden="true"
                className="lucide lucide-arrow-left"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
              <span className="sr-only">Previous slide</span>
            </motion.button>
            <motion.button
              className="static top-1/2 -right-12 inline-flex size-11 shrink-0 translate-x-0 translate-y-0 items-center justify-center gap-2 whitespace-nowrap rounded-full border bg-background font-medium text-sm shadow-xs outline-none transition-all hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:border-input dark:bg-input/30 dark:aria-invalid:ring-destructive/40 dark:hover:bg-input/50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0"
              disabled={
                currentIndex >= members.length - CARDS_PER_VIEW ||
                isTransitioning
              }
              onClick={nextSlide}
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                aria-hidden="true"
                className="lucide lucide-arrow-right"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
              <span className="sr-only">Next slide</span>
            </motion.button>
          </div>

          {/* Carousel Content */}
          <div className="mt-16 [&>div[data-slot=carousel-content]]:overflow-visible">
            <div className="overflow-hidden" data-slot="carousel-content">
              <motion.div
                animate={{
                  x: `-${currentIndex * (CARD_WIDTH + CARD_GAP)}px`,
                }}
                className="-ml-4 flex max-w-[min(calc(100vw-4rem),24rem)] select-none"
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
              >
                {members.map((member, index) => (
                  <div
                    className="min-w-0 max-w-72 shrink-0 grow-0 basis-full pl-4"
                    data-slot="carousel-item"
                    key={member.name}
                  >
                    <motion.div
                      className="rounded-2xl border border-border bg-background p-7 text-center"
                      initial={{ opacity: 0, y: 20 }}
                      transition={{
                        duration: 0.5,
                        delay: index * STAGGER_DELAY,
                      }}
                      viewport={{ once: true }}
                      whileInView={{ opacity: 1, y: 0 }}
                    >
                      {/* biome-ignore lint/performance/noImgElement: Using img for team avatars without Next.js Image optimizations */}
                      <img
                        alt={member.name}
                        className="mx-auto size-20 rounded-full border border-border"
                        height={80}
                        src={getAvatarUrl(member.avatar, AVATAR_SIZE)}
                        width={80}
                      />
                      <div className="mt-6 flex flex-col justify-center">
                        <p className="font-medium text-foreground text-lg">
                          {member.name}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {member.role}
                        </p>
                      </div>
                      <div
                        className="my-6 shrink-0 bg-border bg-linear-to-r from-background via-border to-background data-[orientation=horizontal]:h-px data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px"
                        data-orientation="horizontal"
                        data-slot="separator-root"
                        role="none"
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
  );
}

export default TeamCarousel;
