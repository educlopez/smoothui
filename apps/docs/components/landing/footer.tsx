"use client";

import { HeroDither } from "@docs/components/landing/hero-dither";
import { GsapLogo } from "@docs/components/landing/logos/gsap-logo";
import { MotionLogo } from "@docs/components/landing/logos/motion-logo";
import { ReactLogo } from "@docs/components/landing/logos/react-logo";
import { ShadcnLogo } from "@docs/components/landing/logos/shadcn-logo";
import { TailwindLogo } from "@docs/components/landing/logos/tailwind-logo";
import { MascotCompanion } from "@docs/components/mascot-companion";
import Link from "next/link";
import { IconArrowUpRightFill24 } from "nucleo-core-fill-24";
import { type RefObject, useEffect, useRef, useState } from "react";

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
  links: [
    { href: "/docs/components", label: "Components" },
    { href: "/docs/blocks", label: "Blocks" },
    { href: "/docs/templates", label: "Templates" },
    { href: "/docs/components/dynamic-island", label: "Dynamic Island" },
    { href: "/docs/components/ai-prompt-input", label: "AI Prompt Input" },
    { href: "/docs/components/siri-orb", label: "Siri Orb" },
    { href: "/docs/components/infinite-slider", label: "Infinite Slider" },
  ],
  title: "Navigate",
};

const developColumn: FooterColumn = {
  links: [
    { href: "/docs/guides/getting-started", label: "Getting Started" },
    { href: "/docs/guides/installation", label: "Installation" },
    { href: "/docs/guides/animation-best-practices", label: "Animations" },
    { href: "/docs/guides/accessibility", label: "Accessibility" },
    { href: "/docs/guides/changelog", label: "Changelog" },
  ],
  title: "Develop",
};

const connectColumn: FooterColumn = {
  links: [
    {
      external: true,
      href: "https://wingtics.com",
      label: "wingtics.com",
    },
    { external: true, href: "https://sparkbites.dev", label: "sparkbites.dev" },
    { external: true, href: "https://codevator.dev", label: "codevator.dev" },
    { external: true, href: "https://thegridcn.com", label: "thegridcn.com" },
    {
      external: true,
      href: "https://skills.smoothui.dev",
      label: "ui-craft",
    },
  ],
  title: "By the maker",
};

const techStack = [
  { className: "size-4", icon: ReactLogo, name: "React" },
  { className: "h-3.5 w-auto", icon: TailwindLogo, name: "Tailwind CSS" },
  { className: "size-4", icon: ShadcnLogo, name: "shadcn/ui" },
  { className: "h-3.5 w-auto", icon: MotionLogo, name: "Motion" },
  { className: "h-3.5 w-auto", icon: GsapLogo, name: "GSAP" },
];

/** Same pink dunes as the hero — bookends the page. */
const BACKGROUND_SRC = "/hero/pink-dunes.jpg";

// ---------------------------------------------------------------------------
// Shared styles
// ---------------------------------------------------------------------------

const columnTitleClass = "mb-4 block font-medium text-foreground text-sm";
const linkClass =
  "inline-flex items-center gap-1 text-muted-foreground text-sm transition-colors duration-200 hover:text-brand";

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

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
// Full-bleed pink dither atmosphere
// ---------------------------------------------------------------------------

function PinkAtmosphere({
  band,
  showPhoto,
  onFallback,
  bandRef,
}: {
  band: { height: number; width: number };
  showPhoto: boolean;
  onFallback: () => void;
  bandRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      aria-hidden
      className="mask-t-from-0% mask-t-to-18% mask-b-from-48% mask-b-to-82% dark:mask-t-to-22% pointer-events-none absolute inset-0"
      ref={bandRef}
    >
      {showPhoto ? (
        <img
          alt=""
          className="size-full object-cover object-center"
          height={1024}
          src={BACKGROUND_SRC}
          width={1024}
        />
      ) : null}
      {band.width > 1 ? (
        <HeroDither
          height={band.height}
          onFallback={onFallback}
          src={BACKGROUND_SRC}
          width={band.width}
        />
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Giant cropped wordmark — footer.design “Decimals” move
// ---------------------------------------------------------------------------

function GiantMark() {
  return (
    <div
      aria-hidden
      className="pointer-events-none relative z-10 select-none overflow-hidden"
    >
      <p className="translate-y-[18%] text-center font-semibold font-title text-[clamp(4.5rem,16vw,12rem)] text-foreground/[0.07] leading-[0.8] tracking-tighter dark:text-foreground/[0.09]">
        SmoothUI
      </p>
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
// Footer — pink band + links + giant mark
// ---------------------------------------------------------------------------

export default function Footer() {
  const bandRef = useRef<HTMLDivElement>(null);
  const [band, setBand] = useState({ height: 0, width: 0 });
  const [showPhoto, setShowPhoto] = useState(false);

  useEffect(() => {
    const node = bandRef.current;
    if (!node) {
      return;
    }
    const measure = () => {
      const box = node.getBoundingClientRect();
      setBand({
        height: Math.max(1, Math.round(box.height)),
        width: Math.max(1, Math.round(box.width)),
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <footer className="relative z-30 overflow-hidden bg-background">
      <PinkAtmosphere
        band={band}
        bandRef={bandRef}
        onFallback={() => setShowPhoto(true)}
        showPhoto={showPhoto}
      />

      <div className="relative z-10 pt-16 pb-10 sm:pt-20 sm:pb-12">
        <FooterBody showMark={false} />
      </div>

      <GiantMark />
    </footer>
  );
}

// ---------------------------------------------------------------------------
// Footer body — link columns + bottom bar (also used in docs chrome)
// ---------------------------------------------------------------------------

export function FooterBody({ showMark = true }: { showMark?: boolean } = {}) {
  return (
    <>
      <div className="mx-auto w-full max-w-7xl px-8">
        <div className="grid gap-12 md:grid-cols-5">
          <div className="space-y-6 md:col-span-2 md:space-y-8">
            <MascotCompanion message="You made it. Now make something." />
            <p className="max-w-xs text-balance text-muted-foreground text-sm leading-relaxed">
              Animated React components with smooth Motion animations. Drop-in
              shadcn/ui compatible.
            </p>
          </div>

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
      </div>

      <div
        aria-hidden
        className="mt-14 h-px w-full bg-[length:6px_1px] bg-repeat-x opacity-30 [background-image:linear-gradient(90deg,var(--color-foreground)_1px,transparent_1px)]"
      />

      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-8 pt-14">
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

      {showMark ? (
        <div className="mt-10">
          <GiantMark />
        </div>
      ) : null}
    </>
  );
}
