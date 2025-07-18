"use client"

import * as React from "react"
import Image from "next/image"
import { ArrowDownRight, Star } from "lucide-react"
import { motion } from "motion/react"

import { Button } from "@/components/button"
import { AnimatedGroup } from "@/components/landing/animated-group"
import { AnimatedText } from "@/components/landing/animated-text"
import { Avatar, AvatarImage } from "@/components/ui/avatar"

interface HeroShowcaseProps {
  heading?: string
  description?: string
  buttons?: {
    primary?: {
      text: string
      url: string
    }
    secondary?: {
      text: string
      url: string
    }
  }
  reviews?: {
    count: number
    avatars: {
      src: string
      alt: string
    }[]
    rating?: number
  }
}

export function HeroShowcase({
  heading = "Build beautiful UIs, effortlessly.",
  description = "Smoothui gives you the building blocks to create stunning, animated interfaces in minutes.",
  buttons = {
    primary: {
      text: "Get Started",
      url: "#link",
    },
    secondary: {
      text: "Watch demo",
      url: "#link",
    },
  },
  reviews = {
    count: 200,
    rating: 5.0,
    avatars: [
      {
        src: "https://github.com/educlopez.png",
        alt: "Avatar 1",
      },
      {
        src: "https://github.com/emilkowalski.png",
        alt: "Avatar 2",
      },
      {
        src: "https://github.com/raunofreiberg.png",
        alt: "Avatar 3",
      },
      {
        src: "https://github.com/shadcn.png",
        alt: "Avatar 4",
      },
      {
        src: "https://github.com/leerob.png",
        alt: "Avatar 5",
      },
    ],
  },
}: HeroShowcaseProps) {
  return (
    <motion.section
      className="from-background to-muted relative overflow-hidden bg-gradient-to-b"
      initial={{ opacity: 0, scale: 1.04, filter: "blur(12px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ type: "spring", bounce: 0.32, duration: 0.9 }}
    >
      <div className="container mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-2 lg:gap-20">
        <AnimatedGroup
          preset="blur-slide"
          className="mx-auto flex flex-col items-center text-center md:ml-auto lg:max-w-3xl lg:items-start lg:text-left"
        >
          <AnimatedText
            as="h1"
            className="my-6 text-4xl font-bold text-pretty lg:text-6xl xl:text-7xl"
          >
            {heading}
          </AnimatedText>
          <AnimatedText
            as="p"
            className="text-foreground/70 mb-8 max-w-xl lg:text-xl"
            delay={0.12}
          >
            {description}
          </AnimatedText>
          <AnimatedGroup
            preset="slide"
            className="mb-12 flex w-fit flex-col items-center gap-4 sm:flex-row"
          >
            <span className="inline-flex items-center -space-x-4">
              {reviews.avatars.map((avatar, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  style={{ display: "inline-block" }}
                >
                  <Avatar className="size-12 border">
                    <AvatarImage src={avatar.src} alt={avatar.alt} />
                  </Avatar>
                </motion.div>
              ))}
            </span>
            <div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className="size-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
                <span className="mr-1 font-semibold">
                  {reviews.rating?.toFixed(1)}
                </span>
              </div>
              <p className="text-foreground/70 text-left font-medium">
                from {reviews.count}+ reviews
              </p>
            </div>
          </AnimatedGroup>
          <AnimatedGroup
            preset="slide"
            className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start"
          >
            {buttons.primary && (
              <Button asChild variant="candy" className="w-full sm:w-auto">
                <a href={buttons.primary.url}>{buttons.primary.text}</a>
              </Button>
            )}
            {buttons.secondary && (
              <Button asChild variant="outline">
                <a href={buttons.secondary.url}>
                  {buttons.secondary.text}
                  <ArrowDownRight className="size-4" />
                </a>
              </Button>
            )}
          </AnimatedGroup>
        </AnimatedGroup>
        {/* Imagen completamente estática para que el blend mode funcione perfecto */}
        <div className="flex">
          <Image
            src="/hero-example.png"
            alt="app screen"
            width={2880}
            height={1842}
            className="h-full w-full rounded-md object-cover mix-blend-lighten"
            priority
          />
        </div>
      </div>
    </motion.section>
  )
}
