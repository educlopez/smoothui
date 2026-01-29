"use client";

import { BlurMagic } from "@docs/components/blurmagic/blurmagic";
import { FloatNav } from "@docs/components/float-nav";
import { Icon as SmoothUiIcon } from "@docs/components/icon";
import { BgLines } from "@docs/components/landing/bg-lines";
import Divider from "@docs/components/landing/divider";
import Footer from "@docs/components/landing/footer";
import Navbar from "@docs/components/landing/navbar/navbar";
import { Button } from "@docs/components/smoothbutton";
import { ArrowLeft, Home } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

const quotes = [
  {
    text: "I have a feeling we're not in Kansas anymore.",
    source: "The Wizard of Oz (1939)",
  },
  {
    text: "Game over, man! Game over!",
    source: "Aliens (1986)",
  },
  {
    text: "We're gonna need a bigger boat.",
    source: "Jaws (1975)",
  },
  {
    text: "Don't panic.",
    source: "The Hitchhiker's Guide to the Galaxy (2005)",
  },
  {
    text: "Roads? Where we're going, we don't need roads.",
    source: "Back to the Future (1985)",
  },
  {
    text: "I'm gonna make him an offer he can't refuse.",
    source: "The Godfather (1972)",
  },
  {
    text: "Houston, we have a problem.",
    source: "Apollo 13 (1995)",
  },
  {
    text: "May the Force be with you.",
    source: "Star Wars (1977)",
  },
  {
    text: "You shall not pass!",
    source: "The Lord of the Rings: The Fellowship of the Ring (2001)",
  },
  {
    text: "Life finds a way.",
    source: "Jurassic Park (1993)",
  },
  {
    text: "Why so serious?",
    source: "The Dark Knight (2008)",
  },
] as const;

const CONTAINER_DURATION = 0.24;
const CONTAINER_EASE_X0 = 0.22;
const CONTAINER_EASE_X1 = 0.8;
const CONTAINER_EASE_X2 = 0.2;
const CONTAINER_EASE_X3 = 1;
const CONTAINER_EASE = [
  CONTAINER_EASE_X0,
  CONTAINER_EASE_X1,
  CONTAINER_EASE_X2,
  CONTAINER_EASE_X3,
] as const;

export default function NotFound() {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();

  const quote = useMemo(
    () => quotes[Math.floor(Math.random() * quotes.length)],
    []
  );

  const containerMotion = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: CONTAINER_DURATION, ease: CONTAINER_EASE },
      };

  return (
    <div className="relative isolate bg-primary transition">
      <BgLines />
      <main className="relative mx-auto min-h-screen w-full max-w-7xl overflow-y-auto">
        <BlurMagic
          background="var(--color-background)"
          blur="4px"
          className="left-1/2! z-20 h-[120px]! w-full! max-w-[inherit]! -translate-x-1/2!"
          side="top"
          stop="50%"
        />
        <Navbar className="mx-auto w-full" />
        <Divider orientation="vertical" />
        <Divider className="right-auto left-0" orientation="vertical" />
        <section className="flex flex-col overflow-hidden">
          <div className="relative mx-auto flex w-full flex-1 flex-col items-center pt-32 pb-24 text-center">
            <motion.div
              {...containerMotion}
              className="flex w-full flex-col items-center gap-8 border bg-background/80 p-10 backdrop-blur"
            >
              <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-border/50 bg-muted/40">
                <SmoothUiIcon className="h-20 w-20 text-foreground" />
                <span className="sr-only">
                  SmoothUI mascot looking confused
                </span>
              </div>
              <div className="space-y-3">
                <p className="font-semibold text-brand text-sm uppercase tracking-[0.3em]">
                  Error 404
                </p>
                <h1 className="text-balance font-semibold font-title text-4xl text-foreground tracking-tight sm:text-5xl">
                  You found the smooth void.
                </h1>
                <p className="text-balance text-muted-foreground">
                  Looks like you took a wrong turn in the component galaxy. But
                  hey, as{" "}
                  {quote.text ? "someone once said" : "the movies teach us"}, "
                  {quote.text}" — {quote.source}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button onClick={() => router.back()} variant="outline">
                  <ArrowLeft aria-hidden className="h-4 w-4" />
                  Go back
                </Button>
                <Button asChild variant="candy">
                  <Link href="/">
                    <Home aria-hidden className="h-4 w-4" />
                    Take me home
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
          <Footer />
        </section>
        <BlurMagic
          background="var(--color-background)"
          className="left-1/2! z-20 h-[120px]! w-full! max-w-[inherit]! -translate-x-1/2!"
          side="bottom"
        />
        <FloatNav />
      </main>
    </div>
  );
}
