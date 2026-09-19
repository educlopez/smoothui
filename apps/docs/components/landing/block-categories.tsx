"use client";

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

import { getAllPeople, getAvatarUrl, getImageKitUrl } from "@smoothui/data";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";
import Image from "next/image";
import Link from "next/link";
import {
  IconChevronDownFill24,
  IconChevronLeftFill24,
  IconChevronRightFill24,
  IconCircleQuestionFill24,
  IconExternalLinkFill24,
  IconStarFill24,
} from "nucleo-core-fill-24";
import { IconGithub, IconXTwitter } from "nucleo-social-media";
import { useRef, useState } from "react";

const EASE_OUT_QUAD = [0.25, 0.46, 0.45, 0.94] as const;

const blockCategories = [
  {
    blockCount: 4,
    href: "/docs/blocks/hero",
    preview: HeroPreview,
    title: "Hero",
  },
  {
    blockCount: 3,
    href: "/docs/blocks/pricing",
    preview: PricingPreview,
    title: "Pricing",
  },
  {
    blockCount: 3,
    href: "/docs/blocks/testimonial",
    preview: TestimonialPreview,
    title: "Testimonial",
  },
  {
    blockCount: 2,
    href: "/docs/blocks/faqs",
    preview: FAQPreview,
    title: "FAQs",
  },
  {
    blockCount: 2,
    href: "/docs/blocks/footer",
    preview: FooterPreview,
    title: "Footer",
  },
  {
    blockCount: 2,
    href: "/docs/blocks/logo-clouds",
    preview: LogoCloudPreview,
    title: "Logo Clouds",
  },
  {
    blockCount: 2,
    href: "/docs/blocks/stats",
    preview: StatsPreview,
    title: "Stats",
  },
  {
    blockCount: 2,
    href: "/docs/blocks/team-sections",
    preview: TeamPreview,
    title: "Team Sections",
  },
];

function HeroPreview({ active = false }: PreviewProps) {
  return (
    <div className="group/preview flex h-full w-full items-center justify-between gap-3 p-5">
      <div className="flex flex-1 flex-col items-start gap-1.5">
        <span className="rounded-full bg-muted px-2 py-0.5 font-medium text-[9px] text-brand">
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
      <div
        className={`relative size-20 shrink-0 transition-transform duration-300 motion-reduce:transition-none ${active ? "motion-safe:rotate-6 motion-safe:scale-110" : ""}`}
      >
        <Image
          alt=""
          aria-hidden
          className="size-full object-contain"
          draggable={false}
          height={160}
          src={getImageKitUrl("/images/hero-example_xertaz.png", {
            format: "auto",
            height: 160,
            quality: 75,
            width: 160,
          })}
          width={160}
        />
      </div>
    </div>
  );
}

const PRICING_PLANS = [
  { base: 0, hover: 5, name: "Free", popular: false },
  { base: 19, hover: 24, name: "Pro", popular: true },
  { base: 29, hover: 34, name: "Scale", popular: false },
];

function PricingPreview({ active = false }: PreviewProps) {
  return (
    <div className="flex h-full items-center p-4">
      <div className="w-full rounded-xl border border-border bg-muted/40 p-2 shadow-[inset_0_1px_2px_#00000004]">
        {PRICING_PLANS.slice(0, 2).map((plan) => (
          <motion.div
            key={plan.name}
            animate={{ y: active && plan.popular ? -2 : 0 }}
            transition={{ duration: 0.2 }}
            className={`flex items-center gap-3 rounded-lg p-3 ${plan.popular ? "border border-border bg-background shadow-[0_2px_3px_#00000004,0_5px_10px_#00000004]" : ""}`}
          >
            <span
              className={`flex size-4 shrink-0 items-center justify-center rounded-full border ${plan.popular ? "border-foreground" : "border-border"}`}
            >
              {plan.popular ? (
                <span className="size-1.5 rounded-full bg-brand" />
              ) : null}
            </span>
            <div className="flex-1">
              <p className="font-medium text-xs">{plan.name}</p>
              <p className="mt-0.5 text-[9px] text-muted-foreground">
                {plan.popular
                  ? "For your next project"
                  : "Start with the essentials"}
              </p>
            </div>
            <span className="font-semibold text-lg tabular-nums">
              ${plan.base}
              <span className="ml-0.5 font-normal text-[9px] text-muted-foreground">
                /mo
              </span>
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const TESTIMONIAL_QUOTES = [
  "Best component library I've shipped with.",
  "The animations just work out of the box.",
  "Dropped straight into my app — love it.",
];

function TestimonialPreview({ active = false }: PreviewProps) {
  const people = getAllPeople().slice(0, 3);
  const currentIndex = active ? 1 : 0;
  const currentPerson = people[currentIndex] || people[0];
  const quote = TESTIMONIAL_QUOTES[currentIndex % TESTIMONIAL_QUOTES.length];

  const slide = {
    center: { opacity: 1, transform: "translateY(0px)" },
    enter: { opacity: 0, transform: "translateY(6px)" },
    exit: { opacity: 0, transform: "translateY(-6px)" },
  };

  return (
    <motion.div className="group/preview relative flex h-full w-full items-center justify-center p-4">
      <div className="relative flex w-full max-w-[240px] flex-col items-start gap-2 overflow-hidden rounded-xl border border-border bg-background p-5 shadow-[0_2px_4px_#00000003,0_8px_16px_#00000005]">
        <IconChevronLeftFill24 className="absolute top-1/2 left-1.5 size-3 -translate-y-1/2 text-foreground/30" />
        <IconChevronRightFill24 className="absolute top-1/2 right-1.5 size-3 -translate-y-1/2 text-foreground/30" />
        <AnimatePresence mode="wait">
          <motion.div
            animate="center"
            className="flex flex-col items-start gap-2"
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
                draggable={false}
                height={32}
                src={
                  currentPerson ? getAvatarUrl(currentPerson.avatar, 32) : ""
                }
                width={32}
              />
            </span>
            <div className="flex gap-0.5">
              {[...new Array(5)].map((_, i) => (
                <IconStarFill24
                  className="size-2 fill-foreground text-foreground"
                  // biome-ignore lint/suspicious/noArrayIndexKey: static 5-star rating
                  key={`star-${i}`}
                />
              ))}
            </div>
            <p className="text-balance text-left text-[9px] text-foreground/70 leading-snug">
              "{quote}"
            </p>
            <span className="font-medium text-[8px] text-muted-foreground">
              Example customer
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function FAQPreview({ active = false }: PreviewProps) {
  const chevronVariants = {
    closed: { rotate: 0 },
    open: { rotate: 180 },
  };

  const contentVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 },
  };

  return (
    <motion.div
      className="group/preview relative flex h-full w-full flex-col items-stretch justify-center gap-2 p-4"
      animate={active ? "open" : "closed"}
      initial={false}
    >
      <motion.div
        className="flex flex-col overflow-hidden rounded-lg border border-border bg-background p-2.5 shadow-[0_1px_2px_#00000004]"
        transition={{ duration: 0.2, ease: EASE_OUT_QUAD }}
        animate={{ opacity: active ? 0.65 : 1 }}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <IconCircleQuestionFill24 className="size-2.5 shrink-0 text-muted-foreground" />
            <span className="font-medium text-[11px] text-foreground/80">
              Is it free to use?
            </span>
          </div>
          <motion.div
            transition={{ duration: 0.2, ease: EASE_OUT_QUAD }}
            variants={chevronVariants}
          >
            <IconChevronDownFill24 className="size-3 text-foreground/30" />
          </motion.div>
        </div>
        <motion.div
          className="mt-1 overflow-hidden pl-3.5"
          transition={{ duration: 0.2, ease: EASE_OUT_QUAD }}
          variants={contentVariants}
        >
          <p className="text-[10px] text-foreground/55 leading-snug">
            Yes — MIT licensed. Copy any block into your project, free forever.
          </p>
        </motion.div>
      </motion.div>
      {["Does it work with shadcn?", "Can I customize the theme?"].map(
        (question) => (
          <motion.div
            className="flex items-center justify-between gap-2 rounded-lg border border-border bg-background p-2.5 shadow-[0_1px_2px_#00000004]"
            key={question}
            transition={{ duration: 0.2, ease: EASE_OUT_QUAD }}
            animate={{ opacity: active ? 0.65 : 1 }}
          >
            <div className="flex items-center gap-1">
              <IconCircleQuestionFill24 className="size-2.5 shrink-0 text-muted-foreground" />
              <span className="font-medium text-[11px] text-foreground/80">
                {question}
              </span>
            </div>
            <IconChevronDownFill24 className="size-3 text-foreground/30" />
          </motion.div>
        )
      )}
    </motion.div>
  );
}

function FooterPreview({ active = false }: PreviewProps) {
  return (
    <motion.div
      className="group/preview relative flex h-full w-full items-center justify-center p-4"
      animate={{ scale: active ? 1.02 : 1 }}
    >
      <div className="flex w-full flex-col gap-2 rounded-lg border border-border bg-background p-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-3.5 items-center justify-center rounded bg-brand text-[7px] text-white">
            S
          </div>
          <div className="flex items-center gap-8">
            {["Docs", "Blocks", "Pricing"].map((label) => (
              <span
                className="text-[9px] text-foreground/60 transition-colors group-hover/preview:text-foreground"
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
            {(
              [
                { Icon: IconXTwitter, key: "twitter" },
                { Icon: IconGithub, key: "github" },
                { Icon: IconExternalLinkFill24, key: "link" },
              ] as const
            ).map(({ Icon, key }) => (
              <span
                className="flex size-3.5 items-center justify-center rounded-full bg-muted text-foreground/40"
                key={key}
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

function LogoCloudPreview({ active = false }: PreviewProps) {
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

  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  return (
    <div
      ref={ref}
      className="flex h-full w-full items-center overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
      data-logo-strip
    >
      <InfiniteSlider
        gap={10}
        speed={15}
        speedOnHover={0}
        paused={!inView || active}
      >
        {logos.map((LogoComponent) => (
          <div
            key={LogoComponent.name}
            data-logo-name={LogoComponent.name}
            className="flex h-20 w-32 shrink-0 items-center justify-center text-foreground [&_svg]:h-40 [&_svg]:w-40 [&_svg]:max-w-none [&_svg]:shrink-0 [&_svg]:fill-current"
          >
            <LogoComponent />
          </div>
        ))}
      </InfiniteSlider>
    </div>
  );
}

const STATS = [
  { base: 70, hover: 72, label: "Components" },
  { base: 24, hover: 26, label: "Blocks" },
  { base: 813, hover: 820, label: "GitHub stars" },
];

function StatsPreview({ active = false }: PreviewProps) {
  const hovered = active;

  return (
    <motion.div className="group/preview relative flex h-full w-full items-center justify-center p-4">
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
              <span className="text-xl tabular-nums">
                {hovered ? stat.hover : stat.base}
              </span>
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

function TeamPreview({ active = false }: PreviewProps) {
  const people = getAllPeople().slice(0, 3);

  return (
    <motion.div
      className="group/preview relative flex h-full w-full items-center justify-center gap-2.5 p-4"
      animate={{ scale: active ? 1.04 : 1, y: active ? -3 : 0 }}
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
              draggable={false}
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

type PreviewProps = { active?: boolean };

function BlockPreview({
  category,
}: {
  category: (typeof blockCategories)[number];
}) {
  const [active, setActive] = useState(false);
  return (
    <motion.div
      className="relative"
      onHoverStart={() => setActive(true)}
      onHoverEnd={() => setActive(false)}
    >
      <div className="frame-box relative h-[220px] w-full overflow-hidden rounded-2xl p-2">
        <MotionConfig reducedMotion="user">
          <div
            aria-hidden="true"
            className="motion-reduce:[&_*]:!transform-none h-full"
          >
            <category.preview active={active} />
          </div>
        </MotionConfig>
      </div>
      <Link
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        className="mt-3 flex min-h-11 items-center justify-center gap-2 rounded-lg focus-visible:outline-2 focus-visible:outline-ring"
        href={category.href}
      >
        <span className="font-medium text-foreground text-sm">
          {category.title}
        </span>
        <span className="text-muted-foreground text-xs">
          {category.blockCount} Blocks ↗
        </span>
      </Link>
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

        <div className="relative mt-8 md:mt-16">
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
                        delay: index * 0.05,
                        duration: 0.3,
                        ease: EASE_OUT_QUAD,
                      }
                }
              >
                <BlockPreview category={category} />
              </motion.div>
            ))}
          </div>

          <Button
            asChild
            className="mx-auto mt-8 flex w-fit"
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
        </div>
      </div>
    </section>
  );
}
