"use client";

import { AddToKitButton } from "@docs/components/add-to-kit-button";
import { MotionLogo } from "@docs/components/landing/logos/motion-logo";
import { ReactLogo } from "@docs/components/landing/logos/react-logo";
import { TailwindLogo } from "@docs/components/landing/logos/tailwind-logo";
import { Button } from "@repo/shadcn-ui/components/ui/button";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { Boxes, KeyRound, SquareArrowOutUpRight, Terminal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { TEMPLATE_SHOTS } from "./template-shots";

export type TemplateShowcaseProps = {
  description: string;
  /** Registry name; also the id of the isolated preview route. */
  installer: string;
  /** Names of the registry items this template pulls in. */
  registryDependencies?: string[];
  title: string;
  updatedAt?: string;
};

/** The stack, each with the isotype the landing already uses for it. */
const STACK: { icon: ReactNode; name: string }[] = [
  { icon: <ReactLogo className="size-4" />, name: "React" },
  { icon: <TailwindLogo className="h-3 w-auto" />, name: "Tailwind CSS" },
  { icon: <MotionLogo className="h-3 w-auto" />, name: "Motion" },
];

/** Claims that hold for every template we ship, not marketing padding. */
const FACTS: { body: string; icon: ReactNode; title: string }[] = [
  {
    body: "One registry item that pulls in every component it composes.",
    icon: <Terminal aria-hidden="true" size={18} />,
    title: "Installs in one command",
  },
  {
    body: "Layout, state and the interaction between them — not a static mockup.",
    icon: <Boxes aria-hidden="true" size={18} />,
    title: "A whole surface",
  },
  {
    body: "Every reply is scripted. No model, no network call, no API key.",
    icon: <KeyRound aria-hidden="true" size={18} />,
    title: "Runs with nothing wired",
  },
];

/**
 * A template page, laid out the way a kit is sold rather than the way a
 * component is documented.
 *
 * Title and actions first, then the screens, then what is in the box. The source
 * is one command away and reading it is not how anyone decides whether they want
 * a chat app — so this page never shows any.
 */
export const TemplateShowcase = ({
  description,
  installer,
  registryDependencies = [],
  title,
  updatedAt,
}: TemplateShowcaseProps) => {
  const shots = TEMPLATE_SHOTS[installer] ?? [];

  return (
    <div className="not-prose">
      {/* Two columns, because the name and the actions are two different
          questions: what is this, and can I try it. */}
      <header className="grid gap-6 border-b pb-10 md:grid-cols-2 md:items-end md:gap-10">
        <div>
          <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
            Template
          </span>
          <h1 className="mt-2 font-bold text-3xl tracking-tight md:text-4xl">
            {title}
          </h1>
          {/* Named with its isotype, the way the landing lists the stack. Only
              the three we have marks for — a name without one looks like an
              oversight next to the others. */}
          <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            {STACK.map((tech) => (
              <li
                className="flex items-center gap-1.5 text-muted-foreground text-sm"
                key={tech.name}
              >
                <span className="text-smooth-700">{tech.icon}</span>
                {tech.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="md:pb-1">
          <p className="text-foreground/70 leading-relaxed">{description}</p>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Button asChild variant="outline">
              <Link href={`/blocks/preview/${installer}`} target="_blank">
                Live preview
                <SquareArrowOutUpRight aria-hidden="true" size={14} />
              </Link>
            </Button>
            <AddToKitButton slug={installer} title={title} />
          </div>
          {updatedAt ? (
            <p className="mt-3 text-muted-foreground text-xs">
              Last updated {updatedAt}
            </p>
          ) : null}
        </div>
      </header>

      {shots.length > 0 && (
        // Side by side on a wide screen, with one shared row height: each image
        // is scaled to that height rather than to a column width, so the wide
        // shot and the phone line up top and bottom and neither is clipped.
        // Stacked below `md`, where two of them side by side would be thumbnails.
        <div className="mt-10 flex flex-col gap-8 md:h-[30rem] md:flex-row md:items-stretch md:gap-6">
          {shots.map((shot) => (
            <figure
              className={cn(
                "flex min-w-0 flex-col gap-3",
                shot.narrow ? "md:shrink-0" : "md:min-w-0 md:flex-1"
              )}
              key={shot.alt}
            >
              <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-xl bg-muted/40 p-3 ring-1 ring-border">
                <Image
                  alt={shot.alt}
                  className="max-h-full w-auto max-w-full rounded-lg object-contain shadow-black/10 shadow-md"
                  placeholder="blur"
                  sizes={
                    shot.narrow
                      ? "(min-width: 768px) 16rem, 100vw"
                      : "(min-width: 768px) 48rem, 100vw"
                  }
                  src={shot.image}
                />
              </div>
              <figcaption className="text-center text-muted-foreground text-xs">
                {shot.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      <div className="mt-12 grid gap-8 border-y py-8 sm:grid-cols-3 sm:gap-0">
        {FACTS.map((fact, index) => (
          <div
            className={cn(
              "px-0 text-center sm:px-6",
              index > 0 && "sm:border-l"
            )}
            key={fact.title}
          >
            <span className="inline-flex text-foreground">{fact.icon}</span>
            <p className="mt-2 font-medium text-foreground text-sm">
              {fact.title}
            </p>
            <p className="mt-1 text-muted-foreground text-xs leading-relaxed">
              {fact.body}
            </p>
          </div>
        ))}
      </div>

      {registryDependencies.length > 0 && (
        <TemplateContents registryDependencies={registryDependencies} />
      )}
    </div>
  );
};

/**
 * What installing it actually gives you.
 *
 * Read from the registry rather than typed by hand, so the list cannot drift
 * from the real thing. No buttons here: the header already carries them, and the
 * same pair twice on one page is a coin toss rather than a choice.
 */
const TemplateContents = ({
  registryDependencies,
}: {
  registryDependencies: string[];
}) => (
  <aside className="mt-12 rounded-xl border bg-card p-5">
    <p className="text-muted-foreground text-xs">
      Installed with it — {registryDependencies.length} components
    </p>
    <ul className="mt-3 flex flex-wrap gap-1.5">
      {registryDependencies.map((dependency) => (
        <li key={dependency}>
          <Link
            className="inline-flex rounded-md bg-muted px-2 py-1 font-mono text-foreground/80 text-xs transition-colors hover:text-foreground"
            href={`/docs/components/${dependency}`}
          >
            {dependency}
          </Link>
        </li>
      ))}
    </ul>
  </aside>
);
