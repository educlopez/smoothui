"use client";

import { Avatar, AvatarImage } from "@repo/shadcn-ui/components/ui/avatar";
import { getAllPeople, getAvatarUrl, getImageKitUrl } from "@smoothui/data";
import { ArrowDownRight, Star } from "lucide-react";
import { motion } from "motion/react";
import { AnimatedGroup, AnimatedText, Button, HeroHeader } from "../shared";

type HeroShowcaseProps = {
  heading?: string;
  description?: string;
  buttons?: {
    primary?: {
      text: string;
      url: string;
    };
    secondary?: {
      text: string;
      url: string;
    };
  };
  reviews?: {
    count: number;
    avatars: {
      src: string;
      alt: string;
    }[];
    rating?: number;
  };
};

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
    avatars: getAllPeople()
      .slice(0, 5)
      .map((person) => ({
        src: getAvatarUrl(person.avatar, 90),
        alt: `${person.name} avatar`,
      })),
  },
}: HeroShowcaseProps) {
  return (
    <>
      <HeroHeader />
      <main>
        <motion.section
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          className="relative overflow-hidden bg-gradient-to-b from-background to-muted"
          initial={{ opacity: 0, scale: 1.04, filter: "blur(12px)" }}
          transition={{ type: "spring", bounce: 0.32, duration: 0.9 }}
        >
          <div className="mx-auto grid max-w-5xl items-center gap-10 px-6 py-24 lg:grid-cols-2 lg:gap-20">
            <AnimatedGroup
              className="mx-auto flex flex-col items-center text-center md:ml-auto lg:max-w-3xl lg:items-start lg:text-left"
              preset="blur-slide"
            >
              <AnimatedText
                as="h1"
                className="my-6 text-pretty font-bold text-4xl lg:text-6xl xl:text-7xl"
              >
                {heading}
              </AnimatedText>
              <AnimatedText
                as="p"
                className="mb-8 max-w-xl text-foreground/70 lg:text-xl"
                delay={0.12}
              >
                {description}
              </AnimatedText>
              <AnimatedGroup
                className="mb-12 flex w-fit flex-col items-center gap-4 sm:flex-row"
                preset="slide"
              >
                <span className="inline-flex items-center -space-x-4">
                  {reviews.avatars.map((avatar, index) => (
                    <motion.div
                      key={`${avatar.src}-${index}`}
                      style={{ display: "inline-block" }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                      whileHover={{ y: -8 }}
                    >
                      <Avatar className="size-12 border">
                        <AvatarImage alt={avatar.alt} src={avatar.src} />
                      </Avatar>
                    </motion.div>
                  ))}
                </span>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((starNumber) => (
                      <Star
                        className="size-5 fill-yellow-400 text-yellow-400"
                        key={`star-${starNumber}`}
                      />
                    ))}
                    <span className="mr-1 font-semibold">
                      {reviews.rating?.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-left font-medium text-foreground/70">
                    from {reviews.count}+ reviews
                  </p>
                </div>
              </AnimatedGroup>
              <AnimatedGroup
                className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start"
                preset="slide"
              >
                {buttons.primary && (
                  <Button asChild className="w-full sm:w-auto" variant="candy">
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
              <img
                alt="app screen"
                className="h-full w-full rounded-md object-cover"
                height={1842}
                src={getImageKitUrl("/images/hero-example_xertaz.png", {
                  width: 1200,
                  quality: 85,
                  format: "auto",
                })}
                width={2880}
              />
            </div>
          </div>
        </motion.section>
      </main>
    </>
  );
}
export default HeroShowcase;
