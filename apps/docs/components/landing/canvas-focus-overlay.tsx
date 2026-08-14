"use client";

import { Button } from "@docs/components/smoothbutton";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { type ComponentType, useEffect, useRef } from "react";

/**
 * Opening a tile swaps the canvas demo for the **docs example**.
 *
 * The canvas demo is a poster: small, self-animating, and deliberately inert so
 * dragging the plane works. The docs example is the real thing — full size and
 * interactive — and one already exists for every component, so focusing a tile
 * costs nothing extra and every demo here is interactive by construction.
 *
 * It also avoids a collision: canvas demos drive themselves with synthetic
 * pointer events, which would fight a visitor actually using the component.
 */
const exampleCache = new Map<string, ComponentType>();

const getDocsExample = (slug: string): ComponentType => {
  const cached = exampleCache.get(slug);
  if (cached) {
    return cached;
  }
  const Example = dynamic(
    () =>
      import(`@docs/examples/${slug}`).catch(() => ({
        default: () => null,
      })),
    { loading: () => null, ssr: false }
  );
  exampleCache.set(slug, Example);
  return Example;
};

const SPRING = { bounce: 0.12, duration: 0.32, type: "spring" as const };
const INSTANT = { duration: 0 };

export type CanvasFocusOverlayProps = {
  onClose: () => void;
  slug: string | null;
  title: string | null;
};

export function CanvasFocusOverlay({
  onClose,
  slug,
  title,
}: CanvasFocusOverlayProps) {
  const shouldReduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const isOpen = slug !== null;

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    // The page behind must not scroll while a panel is over it.
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
    };
  }, [isOpen, onClose]);

  const Example = slug ? getDocsExample(slug) : null;

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          transition={shouldReduceMotion ? INSTANT : { duration: 0.2 }}
        >
          {/* Backdrop: the canvas stays visible behind, pushed back rather than
              hidden, so the panel reads as sitting on top of the same space. */}
          <button
            aria-label="Close"
            className="absolute inset-0 cursor-default bg-background/70 backdrop-blur-md"
            onClick={onClose}
            type="button"
          />

          <motion.div
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            aria-label={title ?? undefined}
            aria-modal="true"
            className="relative flex max-h-[86vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-[0_40px_120px_-40px_rgb(0_0_0/0.45)] outline-none"
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
            initial={
              shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }
            }
            ref={panelRef}
            role="dialog"
            tabIndex={-1}
            transition={shouldReduceMotion ? INSTANT : SPRING}
          >
            <header className="flex items-center justify-between gap-4 border-border/60 border-b px-4 py-3">
              <p className="truncate font-medium text-sm">
                <span className="text-muted-foreground">Components</span>
                <span className="mx-2 text-muted-foreground/60">/</span>
                {title}
              </p>
              <div className="flex shrink-0 items-center gap-2">
                <Button asChild size="sm" variant="outline">
                  <Link href={`/docs/components/${slug}`}>Open docs</Link>
                </Button>
                <Button
                  aria-label="Close"
                  onClick={onClose}
                  size="icon-sm"
                  variant="ghost"
                >
                  <svg
                    aria-hidden="true"
                    fill="none"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="m5 5 10 10M15 5 5 15"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth="1.5"
                    />
                  </svg>
                </Button>
              </div>
            </header>

            <div className="flex min-h-[320px] flex-1 items-center justify-center overflow-auto p-8">
              {Example ? <Example /> : null}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
