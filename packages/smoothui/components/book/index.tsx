"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export type BookVariant = "stripe" | "simple";

export interface BookProps {
  /** Additional CSS classes */
  className?: string;
  /** Cover accent color (CSS color value) */
  color?: string;
  /** Custom illustration for the stripe area (stripe variant only) */
  illustration?: ReactNode;
  /** Logo or icon displayed at the bottom of the content area */
  logo?: ReactNode;
  /** Title text color override */
  textColor?: string;
  /** Book title text displayed on the cover */
  title: string;
  /** Visual variant of the book */
  variant?: BookVariant;
  /** Book width in pixels */
  width?: number;
}

const BOOK_DEPTH = "29cqw";
const BOOK_BORDER_RADIUS = "6px 4px 4px 6px";
const DEFAULT_WIDTH = 196;
const DEFAULT_COLOR = "#e5a00d";

const BG_SHADOW =
  "linear-gradient(90deg, #fff0 0%, #fff0 12%, #ffffff40 29.25%, #fff0 50.5%, #fff0 75.25%, #ffffff40 91%, #fff0 100%), linear-gradient(90deg, #00000008 0%, #0000001a 12%, #0000 30%, #00000005 50%, #0003 73.5%, #00000080 75.25%, #00000026 85.25%, #0000 100%)";

const Book = ({
  title,
  variant = "stripe",
  color = DEFAULT_COLOR,
  textColor,
  width = DEFAULT_WIDTH,
  illustration,
  logo,
  className,
}: BookProps) => {
  const shouldReduceMotion = useReducedMotion();
  const bookWidth = `${width}px`;

  return (
    <div
      className={cn("inline-block w-fit", className)}
      style={{
        perspective: "900px",
        // CSS custom properties for internal use
        ["--book-width" as string]: bookWidth,
        ["--book-color" as string]: color,
        ["--book-text-color" as string]:
          textColor || "var(--color-fd-foreground)",
        ["--book-depth" as string]: BOOK_DEPTH,
        ["--book-border-radius" as string]: BOOK_BORDER_RADIUS,
        ["--bg-shadow" as string]: BG_SHADOW,
      }}
    >
      {/* Rotate wrapper - handles 3D rotation on hover */}
      <div
        className={cn(
          "relative w-fit",
          "[transform-style:preserve-3d]",
          "[container-type:inline-size]",
          !shouldReduceMotion && [
            "transition-transform duration-[250ms] ease-out",
            "hover:[transform:rotateY(-20deg)_scale(1.066)_translateX(-8px)]",
          ]
        )}
        style={{
          aspectRatio: "49 / 60",
          minWidth: bookWidth,
        }}
      >
        {/* Front cover */}
        <div
          className={cn(
            "absolute flex flex-col",
            "overflow-hidden",
            "[transform:translateZ(0px)]",
            "shadow-[rgba(0,0,0,0.02)_0px_1px_1px,rgba(0,0,0,0.1)_0px_4px_8px_-4px,rgba(0,0,0,0.03)_0px_16px_24px_-8px]",
            "dark:bg-[linear-gradient(rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_50%,rgba(255,255,255,0)_100%),rgb(31,31,31)]",
            "dark:shadow-[rgba(0,0,0,0.05)_0px_1.8px_3.6px,rgba(0,0,0,0.08)_0px_10.8px_21.6px,rgba(0,0,0,0.1)_0px_-0.9px_inset,rgba(255,255,255,0.1)_0px_1.8px_1.8px_inset,rgba(0,0,0,0.1)_3.6px_0px_3.6px_inset]"
          )}
          style={{
            width: bookWidth,
            height: "100%",
            borderRadius: BOOK_BORDER_RADIUS,
            background:
              variant === "simple" ? color : "var(--color-fd-background)",
          }}
        >
          {variant === "stripe" ? (
            <StripeContent
              illustration={illustration}
              logo={logo}
              title={title}
              width={width}
            />
          ) : (
            <SimpleContent logo={logo} title={title} width={width} />
          )}

          {/* Border overlay */}
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-0",
              "border border-black/10",
              "shadow-[rgba(255,255,255,0.3)_0px_1px_2px_inset]",
              "dark:border-0"
            )}
            style={{ borderRadius: "inherit" }}
          />
        </div>

        {/* Page edges (right side) */}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute",
            "bg-[linear-gradient(90deg,rgb(234,234,234)_0%,rgba(0,0,0,0)_70%),linear-gradient(rgb(255,255,255),rgb(250,250,250))]",
            "dark:bg-[linear-gradient(90deg,rgb(60,60,60)_0%,rgba(0,0,0,0)_70%),linear-gradient(rgb(40,40,40),rgb(35,35,35))]"
          )}
          style={{
            height: "calc(100% - 6px)",
            width: `calc(${BOOK_DEPTH} - 2px)`,
            top: "3px",
            transform: `translateX(calc(${bookWidth} - ${BOOK_DEPTH} / 2 - 3px)) rotateY(90deg) translateX(calc(${BOOK_DEPTH} / 2))`,
          }}
        />

        {/* Back cover */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-0"
          style={{
            width: bookWidth,
            height: "100%",
            borderRadius: BOOK_BORDER_RADIUS,
            transform: `translateZ(calc(-1 * ${BOOK_DEPTH}))`,
            backgroundColor:
              variant === "simple" ? color : "var(--color-fd-background)",
          }}
        />
      </div>
    </div>
  );
};

/** Stripe variant: color band at top, white body below */
const StripeContent = ({
  title,
  illustration,
  logo,
  width,
}: {
  title: string;
  illustration?: ReactNode;
  logo?: ReactNode;
  width: number;
}) => (
  <>
    {/* Colored stripe area */}
    <div
      className="relative flex w-full flex-1 flex-row items-stretch gap-2 overflow-hidden [transform:translateZ(0px)]"
      style={{ background: "var(--book-color)" }}
    >
      {illustration ? (
        <div className="flex-1 object-cover">{illustration}</div>
      ) : (
        <div className="flex-1" />
      )}
      {/* Spine binding overlay on stripe */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: "var(--bg-shadow)",
          mixBlendMode: "overlay",
        }}
      />
    </div>

    {/* Body with title */}
    <div className="flex flex-row items-stretch">
      {/* Spine binding on body */}
      <div
        aria-hidden
        className="min-w-[8.2%] opacity-20"
        style={{ background: "var(--bg-shadow)" }}
      />
      {/* Content */}
      <div
        className="flex w-full flex-col justify-between [container-type:inline-size]"
        style={{
          padding: "6.1%",
          gap: `${(24 / DEFAULT_WIDTH) * width}px`,
        }}
      >
        <span
          className="text-balance font-semibold leading-[1.25em] tracking-[-0.02em]"
          style={{
            fontSize: "10.5cqw",
            color: "var(--book-text-color)",
          }}
        >
          {title}
        </span>
        {logo && <div>{logo}</div>}
      </div>
    </div>
  </>
);

/** Simple variant: full-color cover with title */
const SimpleContent = ({
  title,
  logo,
  width,
}: {
  title: string;
  logo?: ReactNode;
  width: number;
}) => (
  <div className="flex h-full w-full flex-row items-stretch">
    {/* Spine binding */}
    <div
      aria-hidden
      className="min-w-[8.2%]"
      style={{
        background: "var(--bg-shadow)",
        mixBlendMode: "overlay",
        opacity: 1,
      }}
    />
    {/* Content */}
    <div
      className="flex w-full flex-col justify-between [container-type:inline-size]"
      style={{
        padding: "6.1%",
        gap: `${(16 / DEFAULT_WIDTH) * width}px`,
      }}
    >
      <span
        className="text-balance font-semibold leading-[1.25em] tracking-[-0.02em]"
        style={{
          fontSize: "12cqw",
          color: "var(--book-text-color)",
        }}
      >
        {title}
      </span>
      {logo && <div>{logo}</div>}
    </div>
  </div>
);

export default Book;
