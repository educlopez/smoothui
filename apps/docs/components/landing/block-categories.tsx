"use client";

import { BlurMagic } from "@docs/components/blurmagic/blurmagic";
import Divider from "@docs/components/landing/divider";
import { SectionHeader } from "@docs/components/landing/section-header";
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
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Github,
  HelpCircle,
  Link as LinkIcon,
  Star,
  Twitter,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const EASE_OUT_QUAD = [0.25, 0.46, 0.45, 0.94] as const;

const blockCategories = [
  {
    title: "Hero",
    href: "/docs/blocks/hero",
    blockCount: 4,
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
  return (
    <div className="group/preview flex h-full w-full items-center justify-between gap-3 p-5">
      {/* Left — real mini hero copy */}
      <div className="flex flex-1 flex-col items-start gap-1.5">
        <span className="rounded-full bg-brand/10 px-2 py-0.5 font-medium text-[9px] text-brand">
          New
        </span>
        <h4 className="font-semibold text-foreground text-sm leading-tight tracking-tight">
          Ship beautiful UI
        </h4>
        <p className="text-[10px] text-muted-foreground leading-snug">
          Production-ready React blocks, animated out of the box.
        </p>
        <div className="mt-1.5 flex items-center gap-1.5">
          <span className="rounded-md bg-brand px-2 py-1 font-medium text-[9px] text-white transition-transform group-hover/preview:scale-105">
            Get started
          </span>
          <span className="rounded-md border border-border bg-background px-2 py-1 text-[9px] text-foreground/70">
            Docs
          </span>
        </div>
      </div>
      {/* Right — the SmoothUI orb */}
      <div className="relative size-20 shrink-0 transition-transform duration-300 group-hover/preview:scale-105">
        <Image
          alt=""
          aria-hidden
          className="size-full object-contain"
          height={160}
          src={getImageKitUrl("/images/hero-example_xertaz.png", {
            width: 160,
            height: 160,
            quality: 75,
            format: "auto",
          })}
          width={160}
        />
      </div>
    </div>
  );
}

const PRICING_PLANS = [
  { name: "Free", base: 0, hover: 5, popular: false },
  { name: "Pro", base: 19, hover: 24, popular: true },
  { name: "Scale", base: 29, hover: 34, popular: false },
];

function PricingPreview() {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="group/preview relative flex h-full w-full items-center justify-center p-4"
      onHoverEnd={() => setHovered(false)}
      onHoverStart={() => setHovered(true)}
    >
      <div className="grid w-full grid-cols-3 gap-2">
        {PRICING_PLANS.map((plan) => (
          <motion.div
            className={`relative flex flex-col gap-2 rounded-lg border p-2.5 ${
              plan.popular
                ? "border-brand/30 bg-background shadow-sm"
                : "border-border bg-primary"
            }`}
            key={plan.name}
            transition={{ duration: 0.2, ease: EASE_OUT_QUAD }}
            whileHover={{ scale: 1.02, y: -2 }}
          >
            {plan.popular && (
              <span className="absolute -top-1.5 left-1/2 flex h-3 w-fit -translate-x-1/2 items-center rounded-full bg-brand px-1.5 font-medium text-[8px] text-white">
                Popular
              </span>
            )}
            <span className="font-medium text-[9px] text-foreground/70">
              {plan.name}
            </span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-[10px] text-foreground/40">$</span>
              <div className="origin-left scale-75">
                <PriceFlow value={hovered ? plan.hover : plan.base} />
              </div>
              <span className="text-[8px] text-foreground/30">/mo</span>
            </div>
            <span
              className={`mt-1 block rounded-md py-1 text-center font-medium text-[8px] ${
                plan.popular
                  ? "bg-brand text-white"
                  : "border border-border bg-background text-foreground/70"
              }`}
            >
              {plan.popular ? "Choose" : "Start"}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

const TESTIMONIAL_QUOTES = [
  "Best component library I've shipped with.",
  "The animations just work out of the box.",
  "Dropped straight into my app — love it.",
];

function TestimonialPreview() {
  const people = getAllPeople().slice(0, 3);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentPerson = people[currentIndex] || people[0];
  const quote = TESTIMONIAL_QUOTES[currentIndex % TESTIMONIAL_QUOTES.length];

  const slide = {
    enter: { opacity: 0, transform: "translateY(6px)" },
    center: { opacity: 1, transform: "translateY(0px)" },
    exit: { opacity: 0, transform: "translateY(-6px)" },
  };

  return (
    <motion.div
      className="group/preview relative flex h-full w-full items-center justify-center p-4"
      onHoverStart={() => setCurrentIndex((prev) => (prev + 1) % people.length)}
    >
      <div className="relative flex w-[180px] flex-col items-center gap-2 overflow-hidden rounded-xl border border-border bg-background p-4 shadow-sm">
        <ChevronLeft className="absolute top-1/2 left-1.5 size-3 -translate-y-1/2 text-foreground/30" />
        <ChevronRight className="absolute top-1/2 right-1.5 size-3 -translate-y-1/2 text-foreground/30" />
        <AnimatePresence mode="wait">
          <motion.div
            animate="center"
            className="flex flex-col items-center gap-1.5"
            exit="exit"
            initial="enter"
            key={currentIndex}
            transition={{ duration: 0.25, ease: EASE_OUT_QUAD }}
            variants={slide}
          >
            <span className="relative size-8 overflow-hidden rounded-full">
              <Image
                alt={currentPerson?.name || ""}
                className="size-full object-cover"
                height={32}
                src={
                  currentPerson ? getAvatarUrl(currentPerson.avatar, 32) : ""
                }
                width={32}
              />
            </span>
            <div className="flex gap-0.5">
              {[...new Array(5)].map((_, i) => (
                <Star
                  className="size-2 fill-brand text-brand"
                  // biome-ignore lint/suspicious/noArrayIndexKey: static 5-star rating
                  key={`star-${i}`}
                />
              ))}
            </div>
            <p className="text-balance text-center text-[9px] text-foreground/70 leading-snug">
              “{quote}”
            </p>
            <span className="font-medium text-[8px] text-muted-foreground">
              {currentPerson?.name}
            </span>
          </motion.div>
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
      className="group/preview relative flex h-full w-full flex-col items-stretch justify-center gap-2 p-4"
      initial="open"
      whileHover="closed"
    >
      {/* First FAQ — expanded by default, closes on hover */}
      <motion.div
        className="flex flex-col overflow-hidden rounded-md border border-border bg-background p-2"
        transition={{ duration: 0.2, ease: EASE_OUT_QUAD }}
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <HelpCircle className="size-2.5 shrink-0 text-brand/60" />
            <span className="font-medium text-[9px] text-foreground/80">
              Is it free to use?
            </span>
          </div>
          <motion.div
            transition={{ duration: 0.2, ease: EASE_OUT_QUAD }}
            variants={chevronVariants}
          >
            <ChevronDown className="size-3 text-foreground/30" />
          </motion.div>
        </div>
        <motion.div
          className="overflow-hidden pl-3.5"
          transition={{ duration: 0.2, ease: EASE_OUT_QUAD }}
          variants={contentVariants}
        >
          <p className="text-[8px] text-foreground/55 leading-snug">
            Yes — MIT licensed. Copy any block into your project, free forever.
          </p>
        </motion.div>
      </motion.div>
      {["Does it work with shadcn?", "Can I customize the theme?"].map(
        (question) => (
          <motion.div
            className="flex items-center justify-between gap-2 rounded-md border border-border bg-background p-2"
            key={question}
            transition={{ duration: 0.2, ease: EASE_OUT_QUAD }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-1">
              <HelpCircle className="size-2.5 shrink-0 text-brand/60" />
              <span className="font-medium text-[9px] text-foreground/80">
                {question}
              </span>
            </div>
            <ChevronDown className="size-3 text-foreground/30" />
          </motion.div>
        )
      )}
    </motion.div>
  );
}

function FooterPreview() {
  return (
    <motion.div
      className="group/preview relative flex h-full w-full items-center justify-center p-4"
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex w-full flex-col gap-2 rounded-lg border border-border bg-background p-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-3.5 items-center justify-center rounded bg-brand text-[7px] text-white">
            S
          </div>
          <div className="flex gap-2.5">
            {["Docs", "Blocks", "Pricing"].map((label) => (
              <span
                className="text-[9px] text-foreground/60 transition-colors group-hover/preview:text-brand"
                key={label}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
        <div className="h-px w-full bg-border" />
        <div className="flex items-center justify-between">
          <span className="text-[8px] text-muted-foreground">
            © 2026 SmoothUI
          </span>
          <div className="flex gap-1.5">
            {[Twitter, Github, LinkIcon].map((Icon) => (
              <span
                className="flex size-3.5 items-center justify-center rounded-full bg-muted text-foreground/40"
                key={Icon.displayName}
              >
                <Icon className="size-2" />
              </span>
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
          {logos.map((LogoComponent) => (
            <motion.div
              className="relative flex shrink-0 flex-col items-center gap-1"
              initial="rest"
              key={LogoComponent.name}
              transition={{
                duration: 0.2,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              variants={logoVariants}
              whileHover="hover"
            >
              <div className="relative flex size-9 items-center justify-center rounded-lg border border-border bg-background text-foreground transition-opacity duration-200 [&_svg]:h-5 [&_svg]:w-5 [&_svg]:fill-current">
                <LogoComponent />
              </div>
            </motion.div>
          ))}
        </InfiniteSlider>
      </div>
    </div>
  );
}

const STATS = [
  { base: 70, hover: 72, label: "Components" },
  { base: 24, hover: 26, label: "Blocks" },
  { base: 813, hover: 820, label: "GitHub stars" },
];

function StatsPreview() {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="group/preview relative flex h-full w-full items-center justify-center p-4"
      onHoverEnd={() => setHovered(false)}
      onHoverStart={() => setHovered(true)}
    >
      <div className="grid w-full grid-cols-3 divide-x divide-border">
        {STATS.map((stat) => (
          <motion.div
            className="flex flex-col items-center gap-1 text-center"
            key={stat.label}
            transition={{ duration: 0.2, ease: EASE_OUT_QUAD }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-baseline justify-center gap-0.5 font-bold text-foreground">
              <span className="text-[8px] text-brand">+</span>
              <PriceFlow value={hovered ? stat.hover : stat.base} />
            </div>
            <span className="text-[9px] text-muted-foreground">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

const TEAM_ROLES = ["Maintainer", "Designer", "Engineer"];

function TeamPreview() {
  const people = getAllPeople().slice(0, 3);

  return (
    <motion.div
      className="group/preview relative flex h-full w-full items-center justify-center gap-2.5 p-4"
      whileHover={{ scale: 1.04, y: -3 }}
    >
      {people.map((person, i) => (
        <div
          className="flex flex-col items-center gap-1 rounded-lg border border-border bg-background p-2.5"
          key={person.name}
        >
          <span className="relative size-9 overflow-hidden rounded-full">
            <Image
              alt={person.name}
              className="size-full object-cover"
              height={36}
              src={getAvatarUrl(person.avatar, 36)}
              width={36}
            />
          </span>
          <span className="max-w-14 truncate font-medium text-[9px] text-foreground/80">
            {person.name}
          </span>
          <span className="text-[8px] text-muted-foreground">
            {TEAM_ROLES[i]}
          </span>
        </div>
      ))}
    </motion.div>
  );
}

export function BlockCategories() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative bg-background px-8 py-24 transition">
      <Divider />
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          description={
            <>
              <span className="font-medium text-foreground">Customizable</span>{" "}
              blocks that seamlessly{" "}
              <span className="font-medium text-foreground">adapt</span> to your
              project needs
            </>
          }
          title="Elevate your design with premium blocks"
        />

        {/* Grid Container with overflow */}
        <div className="relative -mx-3 mt-8 h-[480px] overflow-hidden sm:mx-0 md:mt-16 md:h-[672px]">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-6 xl:grid-cols-4">
            {blockCategories.map((category, index) => (
              <motion.div
                animate={
                  shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }
                }
                initial={
                  shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }
                }
                key={category.title}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : {
                        duration: 0.3,
                        delay: index * 0.05,
                        ease: EASE_OUT_QUAD,
                      }
                }
              >
                <Link className="relative block" href={category.href}>
                  {/* Preview Area - Simple rounded container with frame-box */}
                  <div className="w-full overflow-hidden">
                    <div className="frame-box relative h-[220px] w-full overflow-hidden rounded-[13px] p-2 md:rounded-2xl">
                      <category.preview />
                    </div>
                  </div>

                  {/* Content - Centered with pill tag */}
                  <div className="mt-3 flex items-center justify-center gap-2 md:mt-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-0.5 font-medium text-foreground text-xs">
                      <span className="size-1.5 rounded-full bg-brand" />
                      {category.title}
                    </span>
                    <span className="text-foreground/50 text-xs">
                      {category.blockCount} Blocks
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Bottom Button Overlay */}
          <Button
            asChild
            className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 md:bottom-24"
            size="lg"
            variant="candy"
          >
            <Link href="/docs/blocks">
              <span className="flex items-center gap-1">
                <span>Browse All Blocks</span>
              </span>
              <svg
                aria-hidden="true"
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
