"use client";

import { BlurMagic } from "@docs/components/blurmagic/blurmagic";
import Divider from "@docs/components/landing/divider";
import { Button } from "@docs/components/smoothbutton";
import {
  Canpoy,
  Canva,
  Casetext,
  Clearbit,
  Descript,
  Duolingo,
  Faire,
  IDEO,
  KhanAcademy,
  Quizlet,
  Ramp,
  Strava,
} from "@repo/smoothui/blocks/shared";
import InfiniteSlider from "@repo/smoothui/components/infinite-slider";
import PriceFlow from "@repo/smoothui/components/price-flow";
import { getAllPeople, getAvatarUrl, getImageKitUrl } from "@smoothui/data";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Github,
  HelpCircle,
  Link as LinkIcon,
  Twitter,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";

const EASE_OUT_QUAD = [0.25, 0.46, 0.45, 0.94] as const;

const blockCategories = [
  {
    title: "Hero",
    href: "/docs/blocks/hero",
    blockCount: 3,
    preview: HeroPreview,
  },
  {
    title: "Pricing",
    href: "/docs/blocks/pricing",
    blockCount: 3,
    preview: PricingPreview,
  },
  {
    title: "Testimonial",
    href: "/docs/blocks/testimonial",
    blockCount: 3,
    preview: TestimonialPreview,
  },
  {
    title: "FAQs",
    href: "/docs/blocks/faqs",
    blockCount: 2,
    preview: FAQPreview,
  },
  {
    title: "Footer",
    href: "/docs/blocks/footer",
    blockCount: 2,
    preview: FooterPreview,
  },
  {
    title: "Logo Clouds",
    href: "/docs/blocks/logo-clouds",
    blockCount: 2,
    preview: LogoCloudPreview,
  },
  {
    title: "Stats",
    href: "/docs/blocks/stats",
    blockCount: 2,
    preview: StatsPreview,
  },
  {
    title: "Team Sections",
    href: "/docs/blocks/team-sections",
    blockCount: 2,
    preview: TeamPreview,
  },
];

function HeroPreview() {
  const titleVariants = {
    rest: { width: "10rem" },
    hover: { width: "10.5rem" },
  };

  const descriptionVariants = {
    rest: { width: "8rem" },
    hover: { width: "8.5rem" },
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05 },
  };

  const abstractVariants = {
    rest: { scale: 1, rotate: 0 },
    hover: { scale: 1.1, rotate: 5 },
  };

  return (
    <motion.div
      className="group/preview relative flex h-full w-full items-center justify-between gap-4 p-4"
      initial="rest"
      whileHover="hover"
    >
      {/* Left side - Content */}
      <div className="flex flex-1 flex-col items-start justify-center gap-3">
        {/* Title */}
        <motion.div
          className="h-4 w-40 rounded-full bg-foreground/20"
          transition={{
            duration: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          variants={titleVariants}
        />
        {/* Description */}
        <motion.div
          className="h-2 w-32 rounded-full bg-foreground/10"
          transition={{
            duration: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          variants={descriptionVariants}
        />
        <div className="h-2 w-28 rounded-full bg-foreground/8" />
        {/* Buttons */}
        <div className="mt-2 flex items-center gap-2">
          <motion.div
            className="h-4 w-8 rounded-full bg-brand"
            transition={{
              duration: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            variants={buttonVariants}
          />
          <motion.div
            className="h-4 w-8 rounded-full border bg-background"
            transition={{
              duration: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            variants={buttonVariants}
          />
        </div>
      </div>
      {/* Right side - Abstract visual */}
      <motion.div
        className="relative flex h-20 w-20 items-center justify-center overflow-hidden"
        transition={{
          duration: 0.3,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        variants={abstractVariants}
      >
        <img
          alt="Hero illustration"
          className="h-full w-full object-cover opacity-60"
          src={getImageKitUrl("/images/hero-example_xertaz.png", {
            width: 160,
            height: 160,
            quality: 75,
            format: "auto",
          })}
        />
      </motion.div>
    </motion.div>
  );
}

function PricingPreview() {
  const [price1, setPrice1] = useState(0);
  const [price2, setPrice2] = useState(19);
  const [price3, setPrice3] = useState(29);

  const cardVariants = {
    rest: { scale: 1, y: 0 },
    hover: { scale: 1.02, y: -2 },
  };

  const popularBadgeVariants = {
    rest: { scale: 1, opacity: 1 },
    hover: { scale: 1.05, opacity: 1 },
  };

  const features = [
    ["Basic Analytics", "5GB Storage", "Email Support"],
    [
      "Everything in Free",
      "5GB Storage",
      "Email Support",
      "Community Forum",
      "Single User",
      "Basic Templates",
    ],
    ["Everything in Pro", "5GB Storage", "Email Support"],
  ];

  return (
    <motion.div
      className="group/preview relative flex h-full w-full flex-col gap-4 p-4"
      initial="rest"
      onHoverEnd={() => {
        setPrice1(0);
        setPrice2(19);
        setPrice3(29);
      }}
      onHoverStart={() => {
        setPrice1(5);
        setPrice2(24);
        setPrice3(34);
      }}
      whileHover="hover"
    >
      {/* Header */}
      <div className="flex flex-col items-center gap-1.5 text-center">
        <div className="h-2 w-32 rounded-full bg-foreground/20" />
        <div className="h-1.5 w-24 rounded-full bg-foreground/10" />
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-3 gap-2">
        {/* Free Plan */}
        <motion.div
          className="relative flex flex-col rounded-lg border bg-primary p-2"
          transition={{
            duration: 0.2,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          variants={cardVariants}
        >
          <div className="flex flex-col gap-1">
            <div className="h-1.5 w-8 rounded-full bg-foreground/20" />
            <div className="flex items-baseline gap-0.5">
              <span className="text-foreground/40 text-xs">$</span>
              <div className="scale-75">
                <PriceFlow value={price1} />
              </div>
              <span className="text-[10px] text-foreground/30">/mo</span>
            </div>
            <div className="h-1 w-6 rounded-full bg-foreground/10" />
          </div>
          <div className="my-1.5 h-px border-foreground/10 border-t border-dashed" />
          <ul className="space-y-1">
            {features[0].slice(0, 2).map((_, i) => (
              <li className="flex items-center gap-1" key={i}>
                <Check className="h-2 w-2 shrink-0 text-foreground/30" />
                <div className="h-1 w-12 rounded-full bg-foreground/10" />
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-2">
            <div className="h-2 w-full rounded-md border bg-background" />
          </div>
        </motion.div>

        {/* Pro Plan - Popular */}
        <motion.div
          className="relative flex flex-col rounded-lg border bg-background p-2"
          transition={{
            duration: 0.2,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          variants={cardVariants}
        >
          <motion.span
            className="-top-1.5 -translate-x-1/2 absolute left-1/2 flex h-3 w-fit items-center rounded-full bg-brand px-1.5 font-medium text-[8px] text-white"
            transition={{
              duration: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            variants={popularBadgeVariants}
          >
            Popular
          </motion.span>
          <div className="flex flex-col gap-1">
            <div className="h-1.5 w-6 rounded-full bg-foreground/20" />
            <div className="flex items-baseline gap-0.5">
              <span className="text-foreground/40 text-xs">$</span>
              <div className="scale-75">
                <PriceFlow value={price2} />
              </div>
              <span className="text-[10px] text-foreground/30">/mo</span>
            </div>
            <div className="h-1 w-6 rounded-full bg-foreground/10" />
          </div>
          <div className="my-1.5 h-px border-foreground/10 border-t border-dashed" />
          <ul className="space-y-1">
            {features[1].slice(0, 3).map((_, i) => (
              <li className="flex items-center gap-1" key={i}>
                <Check className="h-2 w-2 shrink-0 text-foreground/30" />
                <div className="h-1 w-10 rounded-full bg-foreground/10" />
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-2">
            <div className="h-2 w-full rounded-md bg-brand/20" />
          </div>
        </motion.div>

        {/* Startup Plan */}
        <motion.div
          className="relative flex flex-col rounded-lg border bg-primary p-2"
          transition={{
            duration: 0.2,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          variants={cardVariants}
        >
          <div className="flex flex-col gap-1">
            <div className="h-1.5 w-10 rounded-full bg-foreground/20" />
            <div className="flex items-baseline gap-0.5">
              <span className="text-foreground/40 text-xs">$</span>
              <div className="scale-75">
                <PriceFlow value={price3} />
              </div>
              <span className="text-[10px] text-foreground/30">/mo</span>
            </div>
            <div className="h-1 w-6 rounded-full bg-foreground/10" />
          </div>
          <div className="my-1.5 h-px border-foreground/10 border-t border-dashed" />
          <ul className="space-y-1">
            {features[2].slice(0, 2).map((_, i) => (
              <li className="flex items-center gap-1" key={i}>
                <Check className="h-2 w-2 shrink-0 text-foreground/30" />
                <div className="h-1 w-12 rounded-full bg-foreground/10" />
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-2">
            <div className="h-2 w-full rounded-md border bg-background" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function TestimonialPreview() {
  const people = getAllPeople().slice(0, 3);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentPerson = people[currentIndex] || people[0];

  const starVariants = {
    rest: { scale: 1, backgroundColor: "hsl(var(--color-brand) / 0.4)" },
    hover: { scale: 1.3, backgroundColor: "hsl(var(--color-brand) / 0.6)" },
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 20 : -20,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -20 : 20,
      opacity: 0,
    }),
  };

  return (
    <motion.div
      className="group/preview relative flex h-full w-full items-center justify-center p-4"
      initial="rest"
      onHoverStart={() => {
        setCurrentIndex((prev) => (prev + 1) % people.length);
      }}
      whileHover="hover"
    >
      <div className="relative flex flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border bg-background p-4">
        {/* Left Arrow */}
        <div className="-translate-y-1/2 absolute top-1/2 left-1">
          <ChevronLeft className="h-3 w-3 text-foreground/30" />
        </div>
        {/* Right Arrow */}
        <div className="-translate-y-1/2 absolute top-1/2 right-1">
          <ChevronRight className="h-3 w-3 text-foreground/30" />
        </div>
        <AnimatePresence custom={1} mode="wait">
          <motion.div
            animate="center"
            className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full"
            custom={1}
            exit="exit"
            initial="enter"
            key={currentIndex}
            transition={{
              duration: 0.3,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            variants={slideVariants}
          >
            <img
              alt={currentPerson?.name || "Avatar"}
              className="h-full w-full object-cover"
              src={currentPerson ? getAvatarUrl(currentPerson.avatar, 32) : ""}
            />
          </motion.div>
        </AnimatePresence>
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <motion.div
              className="h-1.5 w-1.5 rounded-full bg-brand/40"
              key={i}
              transition={{
                duration: 0.2,
                delay: i * 0.03,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              variants={starVariants}
            />
          ))}
        </div>
        <AnimatePresence custom={1} mode="wait">
          <motion.div
            animate="center"
            className="h-2 w-20 rounded-full bg-foreground/10"
            custom={1}
            exit="exit"
            initial="enter"
            key={`line1-${currentIndex}`}
            transition={{
              duration: 0.3,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            variants={slideVariants}
          />
        </AnimatePresence>
        <AnimatePresence custom={1} mode="wait">
          <motion.div
            animate="center"
            className="h-2 w-16 rounded-full bg-foreground/5"
            custom={1}
            exit="exit"
            initial="enter"
            key={`line2-${currentIndex}`}
            transition={{
              duration: 0.3,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            variants={slideVariants}
          />
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function FAQPreview() {
  const chevronVariants = {
    open: {
      rotate: 180,
    },
    closed: {
      rotate: 0,
    },
  };

  const contentVariants = {
    open: {
      opacity: 1,
      height: "auto",
      marginTop: "0.25rem",
    },
    closed: {
      opacity: 0,
      height: 0,
      marginTop: 0,
    },
  };

  return (
    <motion.div
      className="group/preview relative flex h-full w-full flex-col items-center justify-center gap-4 p-4"
      initial="open"
      whileHover="closed"
    >
      {/* First FAQ - Expanded by default, closes on hover */}
      <motion.div
        className="flex flex-col overflow-hidden rounded-md border border-foreground/10 bg-background px-2 pt-2 pb-2"
        transition={{
          duration: 0.2,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        whileHover={{
          scale: 1.02,
        }}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-0.5">
            <HelpCircle className="h-2.5 w-2.5 text-foreground/30" />
            <div className="h-2 w-16 rounded-full bg-foreground/20" />
          </div>
          <motion.div
            transition={{
              duration: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            variants={chevronVariants}
          >
            <ChevronDown className="h-3 w-3 text-foreground/30" />
          </motion.div>
        </div>
        {/* Expanded content - hidden on hover */}
        <motion.div
          className="flex flex-col gap-1.5 overflow-hidden pl-1"
          transition={{
            duration: 0.2,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          variants={contentVariants}
        >
          <div className="h-1.5 w-full rounded-full bg-foreground/10" />
          <div className="h-1.5 w-3/4 rounded-full bg-foreground/8" />
          <div className="h-1.5 w-5/6 rounded-full bg-foreground/6" />
        </motion.div>
      </motion.div>
      <motion.div
        className="flex items-center justify-between gap-2 rounded-md border border-foreground/10 bg-background p-2"
        transition={{
          duration: 0.2,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        whileHover={{
          scale: 1.02,
        }}
      >
        <div className="flex items-center gap-0.5">
          <HelpCircle className="h-2.5 w-2.5 text-foreground/30" />
          <div className="h-2 w-16 rounded-full bg-foreground/15" />
        </div>
        <ChevronDown className="h-3 w-3 text-foreground/30" />
      </motion.div>
      <motion.div
        className="flex items-center justify-between gap-2 rounded-md border border-foreground/10 bg-background p-2"
        transition={{
          duration: 0.2,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        whileHover={{
          scale: 1.02,
        }}
      >
        <div className="flex items-center gap-0.5">
          <HelpCircle className="h-2.5 w-2.5 text-foreground/30" />
          <div className="h-2 w-16 rounded-full bg-foreground/15" />
        </div>
        <ChevronDown className="h-3 w-3 text-foreground/30" />
      </motion.div>
    </motion.div>
  );
}

function FooterPreview() {
  const linkVariants = {
    rest: { scaleY: 1, backgroundColor: "hsl(var(--color-foreground) / 0.2)" },
    hover: {
      scaleY: 1.2,
      backgroundColor: "hsl(var(--color-brand) / 0.2)",
    },
  };

  const lineVariants = {
    rest: { backgroundColor: "hsl(var(--color-foreground) / 0.1)" },
    hover: { backgroundColor: "hsl(var(--color-brand) / 0.3)" },
  };

  const iconVariants = {
    rest: { scale: 1, backgroundColor: "hsl(var(--color-foreground) / 0.1)" },
    hover: {
      scale: 1.2,
      backgroundColor: "hsl(var(--color-brand) / 0.3)",
    },
  };

  return (
    <motion.div
      className="group/preview relative flex h-full w-full items-center justify-center p-4"
      initial="rest"
      whileHover="hover"
    >
      <div className="flex w-full flex-col gap-1.5 rounded-lg border border-foreground/10 bg-background p-3">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded bg-brand/30" />
          <div className="flex gap-3">
            {[...Array(3)].map((_, i) => (
              <motion.div
                className="h-1.5 w-12 rounded-full bg-foreground/20"
                key={i}
                transition={{
                  duration: 0.2,
                  delay: i * 0.03,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                variants={linkVariants}
              />
            ))}
          </div>
        </div>
        <motion.div
          className="h-px w-full bg-foreground/10"
          transition={{
            duration: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          variants={lineVariants}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-20 rounded-full bg-foreground/15" />
            <div className="h-1 w-10 rounded-full bg-foreground/10" />
          </div>
          <div className="flex gap-1.5">
            {[Twitter, Github, LinkIcon].map((Icon, i) => (
              <motion.div
                className="relative flex h-3.5 w-3.5 items-center justify-center rounded-full bg-foreground/10"
                key={i}
                transition={{
                  duration: 0.2,
                  delay: i * 0.03,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                variants={iconVariants}
              >
                <Icon className="h-2 w-2 text-foreground/40" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function LogoCloudPreview() {
  // Use more logos for a smoother infinite loop
  const logos = [
    Canpoy,
    Canva,
    Casetext,
    Strava,
    Descript,
    Duolingo,
    Faire,
    Clearbit,
    IDEO,
    KhanAcademy,
    Quizlet,
    Ramp,
  ];

  const logoVariants = {
    rest: {
      scale: 1,
      opacity: 0.6,
    },
    hover: {
      scale: 1.08,
      opacity: 1,
    },
  };

  // Create blur mask layers - simplified for preview
  const createBlurMask = (
    direction: "left" | "right",
    blur: number,
    offset: number
  ) => {
    const gradientDirection = direction === "left" ? "270deg" : "90deg";
    const startPercent = offset * 12.5;
    const midPercent = (offset + 1) * 12.5;
    const endPercent = (offset + 2) * 12.5;
    const finalPercent = (offset + 3) * 12.5;

    return (
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        key={`${direction}-${blur}`}
        style={{
          maskImage: `linear-gradient(${gradientDirection}, rgba(255, 255, 255, 0) ${startPercent}%, rgba(255, 255, 255, 1) ${midPercent}%, rgba(255, 255, 255, 1) ${endPercent}%, rgba(255, 255, 255, 0) ${finalPercent}%)`,
          WebkitMaskImage: `linear-gradient(${gradientDirection}, rgba(255, 255, 255, 0) ${startPercent}%, rgba(255, 255, 255, 1) ${midPercent}%, rgba(255, 255, 255, 1) ${endPercent}%, rgba(255, 255, 255, 0) ${finalPercent}%)`,
          backdropFilter: `blur(${blur}px)`,
        }}
      />
    );
  };

  return (
    <div className="group/preview relative flex h-full w-full items-center justify-center overflow-hidden p-4">
      <div className="relative w-full overflow-hidden">
        {/* Base gradient backgrounds */}
        <div className="absolute inset-y-0 left-0 z-10 w-5 bg-linear-to-r from-background" />
        <div className="absolute inset-y-0 right-0 z-10 w-5 bg-linear-to-l from-background" />

        {/* Left blur mask layers */}
        <div className="pointer-events-none absolute top-0 left-0 z-20 h-full w-5">
          {Array.from({ length: 4 }, (_, i) => createBlurMask("left", i, i))}
        </div>

        {/* Right blur mask layers */}
        <div className="pointer-events-none absolute top-0 right-0 z-20 h-full w-5">
          {Array.from({ length: 4 }, (_, i) => createBlurMask("right", i, i))}
        </div>

        <InfiniteSlider gap={10} speed={15} speedOnHover={0}>
          {logos.map((LogoComponent, i) => (
            <motion.div
              className="relative flex shrink-0 flex-col items-center gap-1"
              initial="rest"
              key={`logo-${i}`}
              transition={{
                duration: 0.2,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              variants={logoVariants}
              whileHover="hover"
            >
              <div className="relative flex h-7 w-7 items-center justify-center rounded-md border border-foreground/10 bg-background text-foreground transition-opacity duration-200 [&_svg]:h-full [&_svg]:w-full [&_svg]:fill-current">
                <LogoComponent />
              </div>
              <div className="h-0.5 w-5 rounded-full bg-foreground/10" />
            </motion.div>
          ))}
        </InfiniteSlider>
      </div>
    </div>
  );
}

function StatsPreview() {
  const [stat1, setStat1] = useState(24);
  const [stat2, setStat2] = useState(48);
  const [stat3, setStat3] = useState(72);

  const numberVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05 },
  };

  return (
    <motion.div
      className="group/preview relative flex h-full w-full items-center justify-center p-4"
      initial="rest"
      onHoverEnd={() => {
        setStat1(24);
        setStat2(48);
        setStat3(72);
      }}
      onHoverStart={() => {
        setStat1(34);
        setStat2(58);
        setStat3(82);
      }}
      whileHover="hover"
    >
      <div className="grid w-full grid-cols-3 divide-x divide-foreground/10">
        {[stat1, stat2, stat3].map((stat, i) => (
          <motion.div
            className="flex flex-col items-center gap-1.5 space-y-1 text-center"
            key={i}
            transition={{
              duration: 0.2,
              delay: i * 0.03,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            variants={numberVariants}
          >
            <div className="flex items-baseline justify-center gap-0.5 font-bold">
              <span className="text-[8px] text-foreground/40">+</span>
              <div className="scale-90">
                <PriceFlow value={stat} />
              </div>
            </div>
            <div className="h-1 w-7 rounded-full bg-foreground/15" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function TeamPreview() {
  const people = getAllPeople().slice(0, 3);

  const containerVariants = {
    rest: { scale: 1, y: 0 },
    hover: { scale: 1.08, y: -3 },
  };

  const avatarVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.15 },
  };

  return (
    <motion.div
      className="group/preview relative flex h-full w-full items-center justify-center gap-2.5 p-4"
      initial="rest"
      whileHover="hover"
    >
      {people.map((person, i) => (
        <motion.div
          className="flex flex-col items-center gap-1.5 rounded-lg border border-foreground/10 bg-background p-2.5"
          key={person.name}
          transition={{
            duration: 0.2,
            delay: i * 0.03,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          variants={containerVariants}
        >
          <motion.div
            className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full"
            transition={{
              duration: 0.3,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            variants={avatarVariants}
          >
            <img
              alt={person.name}
              className="h-full w-full object-cover"
              src={getAvatarUrl(person.avatar, 36)}
            />
          </motion.div>
          <div className="h-1.5 w-10 rounded-full bg-foreground/15" />
          <div className="h-1 w-8 rounded-full bg-foreground/10" />
        </motion.div>
      ))}
    </motion.div>
  );
}

export function BlockCategories() {
  return (
    <section className="relative bg-background px-8 py-24 transition">
      <Divider />
      <div className="mx-auto max-w-7xl">
        <motion.div
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="flex flex-col items-start md:items-center"
          initial={{
            opacity: 0,
            y: 20,
          }}
          transition={{
            duration: 0.6,
            ease: EASE_OUT_QUAD,
          }}
        >
          {/* Heading */}
          <h2 className="text-balance text-center font-semibold font-title text-3xl text-foreground transition md:max-w-xl xl:max-w-2xl">
            Elevate your design with premium blocks
          </h2>

          {/* Description */}
          <p className="mt-3 text-pretty text-center text-foreground/60 text-sm xl:mt-5">
            <span className="font-medium text-foreground">Customizable</span>{" "}
            blocks that seamlessly{" "}
            <span className="font-medium text-foreground">adapt</span> to your
            project needs
          </p>
        </motion.div>

        {/* Grid Container with overflow */}
        <div className="-mx-3 relative mt-8 h-[480px] overflow-hidden sm:mx-0 md:mt-16 md:h-[672px]">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-6 xl:grid-cols-4">
            {blockCategories.map((category, index) => (
              <motion.div
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                key={category.title}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05,
                  ease: EASE_OUT_QUAD,
                }}
              >
                <Link
                  className="relative block text-center"
                  href={category.href}
                >
                  {/* Preview Area - Simple rounded container with frame-box */}
                  <div className="w-full overflow-hidden">
                    <div className="frame-box relative h-[220px] w-full overflow-hidden rounded-[13px] p-2 md:rounded-2xl">
                      <category.preview />
                    </div>
                  </div>

                  {/* Content - Centered */}
                  <div className="mt-3 text-foreground text-sm md:mt-4 xl:text-base">
                    {category.title}
                  </div>
                  <div className="mt-1 text-foreground/50 text-xs">
                    {category.blockCount} Blocks
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Bottom Button Overlay */}
          <Button
            asChild
            className="-translate-x-1/2 absolute bottom-6 left-1/2 z-20 md:bottom-24"
            size="lg"
            variant="candy"
          >
            <Link href="/docs/blocks">
              <span className="flex items-center gap-1">
                <span>Browse All Blocks</span>
              </span>
              <svg
                className="-mx-1.5 size-5 shrink-0 text-white/72"
                fill="none"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.333 13.333 11.667 10 8.333 6.667"
                  stroke="currentColor"
                  strokeLinecap="square"
                  strokeWidth="1.25"
                />
              </svg>
            </Link>
          </Button>

          {/* BlurMagic Fade Effect */}
          <BlurMagic
            background="var(--color-background)"
            blur="4px"
            className="!absolute !bottom-0 !left-0 z-10 h-80 w-full"
            height="500px"
            side="bottom"
            style={{
              position: "absolute",
            }}
          />
        </div>
      </div>
    </section>
  );
}
