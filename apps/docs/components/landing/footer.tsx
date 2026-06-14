"use client";

import { Icon } from "@docs/components/icon";
import { GsapLogo } from "@docs/components/landing/logos/gsap-logo";
import { MotionLogo } from "@docs/components/landing/logos/motion-logo";
import { ReactLogo } from "@docs/components/landing/logos/react-logo";
import { ShadcnLogo } from "@docs/components/landing/logos/shadcn-logo";
import { TailwindLogo } from "@docs/components/landing/logos/tailwind-logo";
import { SponsorLogo } from "@docs/components/sponsor-logo";
import { getExternalSponsors } from "@docs/lib/sponsors";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { IconArrowUpRightFill24, IconHeartFill24 } from "nucleo-core-fill-24";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FooterLink {
  external?: boolean;
  href: string;
  label: string;
}

interface FooterColumn {
  links: FooterLink[];
  title: string;
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const navigateColumn: FooterColumn = {
  title: "Navigate",
  links: [
    { label: "Components", href: "/docs/components" },
    { label: "Blocks", href: "/docs/blocks" },
    { label: "Dynamic Island", href: "/docs/components/dynamic-island" },
    { label: "AI Input", href: "/docs/components/ai-input" },
    { label: "Siri Orb", href: "/docs/components/siri-orb" },
    { label: "Infinite Slider", href: "/docs/components/infinite-slider" },
  ],
};

const developColumn: FooterColumn = {
  title: "Develop",
  links: [
    { label: "Getting Started", href: "/docs/guides/getting-started" },
    { label: "Installation", href: "/docs/guides/installation" },
    { label: "Animations", href: "/docs/guides/animation-best-practices" },
    { label: "Accessibility", href: "/docs/guides/accessibility" },
    { label: "Changelog", href: "/docs/guides/changelog" },
  ],
};

const connectColumn: FooterColumn = {
  title: "By the maker",
  links: [
    { label: "sparkbites.dev", href: "https://sparkbites.dev", external: true },
    { label: "codevator.dev", href: "https://codevator.dev", external: true },
    { label: "thegridcn.com", href: "https://thegridcn.com", external: true },
    {
      label: "ui-craft",
      href: "https://skills.smoothui.dev",
      external: true,
    },
  ],
};

const techStack = [
  { name: "React", icon: ReactLogo, className: "size-4" },
  { name: "Tailwind CSS", icon: TailwindLogo, className: "h-3.5 w-auto" },
  { name: "shadcn/ui", icon: ShadcnLogo, className: "size-4" },
  { name: "Motion", icon: MotionLogo, className: "h-3.5 w-auto" },
  { name: "GSAP", icon: GsapLogo, className: "h-3.5 w-auto" },
];

// ---------------------------------------------------------------------------
// Shared styles
// ---------------------------------------------------------------------------

const columnTitleClass = "mb-4 block font-medium text-foreground text-sm";
const linkClass =
  "inline-flex items-center gap-1 text-muted-foreground text-sm transition-colors duration-200 hover:text-brand";

// ---------------------------------------------------------------------------
// Decorative SmoothUI logomark (watermark inside CTA card)
// ---------------------------------------------------------------------------

function SmoothLogoMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={cn("text-muted", className)}
      fill="none"
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clipRule="evenodd"
        d="M329.205 6.05469C331.396 0.985458 337.281 -1.34888 342.351 0.84082L355.644 6.58301C356.018 6.74496 356.377 6.93032 356.722 7.13086L439.729 42.9902C444.799 45.1805 447.134 51.066 444.944 56.1357L439.202 69.4277C437.012 74.4976 431.126 76.8315 426.056 74.6416L351.12 42.2705L330.918 89.0332C376.141 114.344 408.567 159.794 416.052 213.239H429.756V278.752H397.765L397.27 282.408L386.144 369.047C383.266 392.108 380.937 415.238 377.957 438.284C376.66 448.318 375.865 459.058 373.398 468.858C372.384 471.375 371.168 473.657 369.527 475.817C353.072 497.475 312.68 504.556 287.003 508.111C273.789 510.037 260.45 510.964 247.098 510.888C217.287 510.485 162.338 502.749 138.37 484.41C133.049 480.338 128.118 475.314 126.057 468.793C124.143 462.739 123.772 455.672 122.899 449.391L117.649 411.719L99.9443 278.752H67.7119V213.239H80.5723C92.1014 130.913 162.808 67.5599 248.312 67.5596C266.066 67.5596 283.183 70.2933 299.265 75.3594L329.205 6.05469ZM298.618 347.714C290.008 349.185 284.699 357.994 277.604 362.6C260.758 373.533 233.532 371.369 217.451 359.928C211.198 355.48 206.551 346.709 197.798 348.069C194.209 348.628 190.796 350.598 188.722 353.611C186.781 356.428 186.276 360.028 186.956 363.345C188.187 369.351 193.243 374.041 197.507 378.105C213.771 391.889 237.722 397.757 258.754 395.938C277.382 394.327 294.852 386.112 306.932 371.629C309.792 368.2 311.798 364.372 311.3 359.786C310.918 356.283 309.287 352.397 306.453 350.188C304.098 348.351 301.526 347.879 298.618 347.714ZM187.43 188.242C177.489 188.242 169.43 196.301 169.43 206.242V305.578C169.43 315.519 177.489 323.578 187.43 323.578H194.529C204.47 323.578 212.529 315.519 212.529 305.578V206.242C212.529 196.301 204.47 188.242 194.529 188.242H187.43ZM302.939 188.242C292.998 188.242 284.94 196.301 284.939 206.242V305.578C284.939 315.519 292.998 323.578 302.939 323.578H310.04C319.981 323.578 328.04 315.519 328.04 305.578V206.242C328.04 196.301 319.981 188.242 310.04 188.242H302.939Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>GitHub</title>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>X (Twitter)</title>
      <path d="M10.488 14.651L15.25 21h7l-7.858-10.478L20.93 3h-2.65l-5.117 5.886L8.75 3h-7l7.51 10.015L2.32 21h2.65zM16.25 19L5.75 5h2l10.5 14z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// CTA card — sits on the seam between page and footer (tailark pattern)
// ---------------------------------------------------------------------------

function CtaCard() {
  const externalSponsors = getExternalSponsors();
  const hasSponsors = externalSponsors.length > 0;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-card p-10 text-card-foreground shadow-lg ring-1 ring-border/70",
        "shadow-foreground/5 md:px-20 md:py-16"
      )}
    >
      {/* Decorative logomark watermark */}
      <SmoothLogoMark className="pointer-events-none absolute inset-0 size-full translate-y-3/4 opacity-50" />

      <div className="relative text-center">
        {hasSponsors ? (
          <>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 font-medium text-xs backdrop-blur-sm">
              <IconHeartFill24
                aria-hidden
                className="size-3.5 fill-brand text-brand"
              />
              <span className="text-foreground">Thank you to our sponsors</span>
            </div>
            <h2 className="text-balance font-semibold font-title text-3xl text-foreground md:text-4xl">
              Backed by great people
            </h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-8">
              {externalSponsors.map((sponsor) => (
                <Link
                  aria-label={`Visit ${sponsor.name}`}
                  className="group relative flex h-16 w-16 items-center justify-center text-foreground opacity-60 transition-all duration-200 ease-out hover:scale-110 hover:opacity-100 md:h-20 md:w-20"
                  href={sponsor.url}
                  key={sponsor.name}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <SponsorLogo
                    className="h-full w-full"
                    height={80}
                    sponsor={sponsor}
                    width={80}
                  />
                </Link>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 font-medium text-xs backdrop-blur-sm">
              <span aria-hidden className="relative flex size-2">
                <span className="absolute inset-0 inline-flex size-full animate-ping rounded-full bg-brand/60 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-brand" />
              </span>
              <span className="text-foreground">Open source & free</span>
            </div>
            <h2 className="text-balance font-semibold font-title text-3xl text-foreground md:text-4xl">
              Support <span className="text-brand">SmoothUI</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-balance text-muted-foreground">
              Help keep SmoothUI free and actively maintained. Every sponsor
              helps ship more components, blocks, and animation recipes.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link
                className="inline-flex items-center justify-center gap-1.5 rounded-md bg-foreground px-4 py-2 font-medium text-background text-sm transition-transform duration-200 hover:-translate-y-0.5"
                href="/docs/guides/sponsors"
              >
                Become a sponsor
                <IconArrowUpRightFill24 aria-hidden className="size-4" />
              </Link>
              <a
                className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border/70 bg-background/60 px-4 py-2 font-medium text-foreground text-sm backdrop-blur-sm transition-colors duration-200 hover:border-brand/40 hover:text-brand"
                href="https://github.com/educlopez/smoothui"
                rel="noopener noreferrer"
                target="_blank"
              >
                <GithubIcon className="size-4" />
                Star on GitHub
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Link columns
// ---------------------------------------------------------------------------

function FooterLinkItem({ link }: { link: FooterLink }) {
  if (link.external) {
    return (
      <a
        className={linkClass}
        href={link.href}
        rel="noopener noreferrer"
        target="_blank"
      >
        <span>{link.label}</span>
        <IconArrowUpRightFill24
          aria-hidden
          className="size-3 shrink-0 opacity-60 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </a>
    );
  }
  return (
    <Link className={linkClass} href={link.href}>
      {link.label}
    </Link>
  );
}

function LinkColumn({ column }: { column: FooterColumn }) {
  return (
    <nav aria-label={column.title}>
      <span className={columnTitleClass}>{column.title}</span>
      <div className="flex flex-col gap-3">
        {column.links.map((link) => (
          <span className="group block" key={link.href}>
            <FooterLinkItem link={link} />
          </span>
        ))}
      </div>
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Footer body
// ---------------------------------------------------------------------------

const ENTER_EASE = [0.23, 1, 0.32, 1] as const;

export default function Footer() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative z-30">
      {/* CTA bridge — top half page bg, bottom half footer bg */}
      <section
        aria-label="Support SmoothUI"
        className="relative bg-linear-to-b from-50% from-background to-50% to-muted/60 pt-16 md:pt-24"
      >
        <div className="relative mx-auto max-w-5xl px-6">
          <motion.div
            initial={
              shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }
            }
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { duration: 0.5, ease: ENTER_EASE }
            }
            viewport={{ once: true, margin: "-100px" }}
            whileInView={
              shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }
            }
          >
            <CtaCard />
          </motion.div>
        </div>
      </section>

      {/* Footer body */}
      <footer className="bg-muted/60 py-16 sm:py-20">
        <FooterBody />
      </footer>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Footer body — link columns + bottom bar, reusable without the CTA card
// ---------------------------------------------------------------------------

export function FooterBody() {
  return (
    <div className="mx-auto max-w-5xl space-y-14 px-6">
      <div className="grid gap-12 md:grid-cols-5">
        {/* Brand column (spans 2) */}
        <div className="space-y-6 md:col-span-2 md:space-y-8">
          <Link
            aria-label="SmoothUI home"
            className="inline-flex items-center gap-2 transition-opacity hover:opacity-80"
            href="/"
          >
            <Icon className="h-6 w-auto" />
            <span className="mt-0.5 select-none font-medium font-title text-foreground text-xl">
              Smooth<span className="text-brand">UI</span>
            </span>
          </Link>
          <p className="max-w-xs text-balance text-muted-foreground text-sm leading-relaxed">
            Animated React components with smooth Motion animations. Drop-in
            shadcn/ui compatible.
          </p>
        </div>

        {/* 3 link columns */}
        <div className="grid gap-8 sm:grid-cols-3 md:col-span-3">
          <LinkColumn column={navigateColumn} />
          <LinkColumn column={developColumn} />
          <div>
            <LinkColumn column={connectColumn} />
            <div className="mt-5 flex items-center gap-3">
              <a
                className="text-muted-foreground transition-colors duration-200 hover:text-brand"
                href="https://x.com/educalvolpz"
                rel="noopener noreferrer"
                target="_blank"
              >
                <XIcon className="size-[18px]" />
              </a>
              <a
                aria-label="SmoothUI on GitHub"
                className="text-muted-foreground transition-colors duration-200 hover:text-brand"
                href="https://github.com/educlopez/smoothui"
                rel="noopener noreferrer"
                target="_blank"
              >
                <GithubIcon className="size-[18px]" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Dotted divider */}
      <div
        aria-hidden
        className="h-px bg-[length:6px_1px] bg-repeat-x opacity-30 [background-image:linear-gradient(90deg,var(--color-foreground)_1px,transparent_1px)]"
      />

      {/* Bottom bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} SmoothUI. Built by{" "}
            <a
              className="text-foreground underline underline-offset-4 transition-colors hover:text-brand"
              href="https://x.com/educalvolpz"
              rel="noopener noreferrer"
              target="_blank"
            >
              Eduardo Calvo
            </a>
            .
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Tech stack row */}
          <div className="hidden items-center gap-3 text-smooth-800 sm:flex">
            {techStack.map((tech) => (
              <span
                aria-label={tech.name}
                className="transition-colors duration-200 hover:text-brand"
                key={tech.name}
                role="img"
                title={tech.name}
              >
                <tech.icon className={tech.className} />
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
