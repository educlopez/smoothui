"use client";

import {
  InstallDrawing,
  MotionDrawing,
  ReactDrawing,
  TokensDrawing,
} from "@docs/components/illustrations/feature-drawings";
import { VividLeadCard } from "@docs/components/illustrations/illustration-card";
import { ArtworkPattern } from "@docs/components/landing/artwork-pattern";
import Divider from "@docs/components/landing/divider";
import { ReactLogo } from "@docs/components/landing/logos/react-logo";
import { ShadcnLogo } from "@docs/components/landing/logos/shadcn-logo";
import { TailwindLogo } from "@docs/components/landing/logos/tailwind-logo";
import { SectionHeader } from "@docs/components/landing/section-header";
import { landingBackgrounds } from "@docs/lib/landing-backgrounds";
import { cn } from "@repo/shadcn-ui/lib/utils";
import Image from "next/image";
import Link from "next/link";
import type { ComponentType, ReactNode } from "react";
import { useState } from "react";

const lead = {
  description:
    "Every component ships with motion built in — powered by Motion and GSAP, tuned for spring physics, and fully reduced-motion aware.",
  title: "Smooth animations",
};

const cardBase =
  "group relative flex flex-col rounded-2xl border bg-primary/40 p-6 transition-colors hover:bg-primary";

const CardHeading = ({
  icon: Icon,
  title,
  description,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) => (
  <>
    <div className="flex items-center gap-2">
      <Icon className="size-4" />
      <h3 className="font-semibold text-foreground text-lg tracking-tight">
        {title}
      </h3>
    </div>
    <p className="mt-1.5 text-muted-foreground text-sm">{description}</p>
  </>
);

const DrawingStage = ({
  children,
  active,
  onActiveChange,
}: {
  children: (active: boolean) => ReactNode;
  active: boolean;
  onActiveChange: (active: boolean) => void;
}) => (
  <div
    className="mb-5 flex min-h-40 items-center justify-center"
    onBlur={() => onActiveChange(false)}
    onFocus={() => onActiveChange(true)}
    onMouseEnter={() => onActiveChange(true)}
    onMouseLeave={() => onActiveChange(false)}
  >
    {children(active)}
  </div>
);

export function Features() {
  const [motionActive, setMotionActive] = useState(false);
  const [reactActive, setReactActive] = useState(false);
  const [tokensActive, setTokensActive] = useState(false);
  const [installActive, setInstallActive] = useState(false);

  return (
    <section className="relative bg-background px-8 py-24 transition">
      <Divider />
      <SectionHeader
        description="Built on the foundations you already love, with the polish you've been wishing for."
        title={
          <>
            Why choose Smooth<span className="text-brand">UI</span>?
          </>
        }
      />
      <div className="mt-16 grid w-full gap-4 md:grid-cols-2 lg:grid-cols-4 lg:items-start">
        <VividLeadCard
          background={
            <Image
              alt=""
              aria-hidden
              className="object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-105 motion-safe:group-focus-within:scale-105"
              data-landing-background="features"
              draggable={false}
              fill
              sizes="(max-width: 768px) 100vw, 420px"
              src={`${landingBackgrounds.features.src}?tr=w-1280,f-auto`}
              unoptimized
            />
          }
          caption={
            <>
              <h3 className="mb-2 font-semibold text-xl tracking-tight">
                <Link
                  className="rounded focus-visible:outline-2 focus-visible:outline-ring"
                  href="/docs/components"
                >
                  {lead.title}
                </Link>
              </h3>
              <p className="max-w-md text-muted-foreground text-sm">
                {lead.description}
              </p>
            </>
          }
          className="md:col-span-2 lg:col-span-2 lg:row-span-2 lg:self-stretch"
          onHoverEnd={() => setMotionActive(false)}
          onHoverStart={() => setMotionActive(true)}
          pattern={<ArtworkPattern variant="squares" />}
          stage="features"
        >
          <MotionDrawing active={motionActive} />
        </VividLeadCard>

        <div className={cn(cardBase, "lg:col-span-2")}>
          <DrawingStage active={reactActive} onActiveChange={setReactActive}>
            {(active) => <ReactDrawing active={active} />}
          </DrawingStage>
          <CardHeading
            description="Server Components, TypeScript and hooks throughout — built for React 19."
            icon={ReactLogo}
            title="Modern React"
          />
        </div>

        <div className={cardBase}>
          <DrawingStage active={tokensActive} onActiveChange={setTokensActive}>
            {(active) => <TokensDrawing active={active} />}
          </DrawingStage>
          <CardHeading
            description="The latest utility-first engine, with a unified token spine."
            icon={TailwindLogo}
            title="Tailwind CSS v4"
          />
        </div>

        <div className={cn(cardBase, "self-stretch")}>
          <DrawingStage
            active={installActive}
            onActiveChange={setInstallActive}
          >
            {(active) => <InstallDrawing active={active} />}
          </DrawingStage>
          <CardHeading
            description="Drops into any shadcn project — same patterns, one command."
            icon={ShadcnLogo}
            title="shadcn compatible"
          />
        </div>
      </div>
    </section>
  );
}
