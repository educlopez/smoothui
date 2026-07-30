"use client";

import { BlurMagic } from "@docs/components/blurmagic/blurmagic";
import { PreviewCode } from "@docs/components/preview/code";
import { Button } from "@repo/shadcn-ui/components/ui/button";
import { Separator } from "@repo/shadcn-ui/components/ui/separator";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@repo/shadcn-ui/components/ui/toggle-group";
import { cn } from "@repo/shadcn-ui/lib/utils";
import {
  Code2,
  FileText,
  Maximize2,
  Minimize2,
  Monitor,
  Smartphone,
  SquareArrowOutUpRight,
  Tablet,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { type ReactNode, useState } from "react";

export type PreviewFile = { code: string; name: string };

type Viewport = "desktop" | "tablet" | "mobile";
type Pane = "info" | "source";

/**
 * Real device widths rather than round numbers: 390 is an iPhone 15/16 and 768 is
 * the iPad portrait width every responsive bug shows up at.
 */
const VIEWPORT_WIDTH: Record<Viewport, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "390px",
};

const VIEWPORTS: { icon: ReactNode; label: string; value: Viewport }[] = [
  {
    icon: <Monitor aria-hidden="true" size={15} />,
    label: "Desktop width",
    value: "desktop",
  },
  {
    icon: <Tablet aria-hidden="true" size={15} />,
    label: "Tablet width",
    value: "tablet",
  },
  {
    icon: <Smartphone aria-hidden="true" size={15} />,
    label: "Mobile width",
    value: "mobile",
  },
];

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const PANE_DURATION = 0.22;
/** Distance the incoming pane travels. Small enough to read as a lift, not a slide. */
const PANE_OFFSET = 14;

export type SplitPreviewShellProps = {
  /** The info column: title, description, install command, MDX body. */
  children: ReactNode;
  /** Every file behind the demo, in tab order: the example first, then its deps. */
  files: PreviewFile[];
  /**
   * Isolated route for this demo. It is both the pop-out target and the iframe
   * the stage renders, so the viewport switcher changes a real viewport.
   */
  popOutHref: string;
  /** The section catalogue trigger + drawer. */
  nav?: ReactNode;
  /** Name shown above the code pane. */
  title: string;
};

/**
 * Component and block pages: the documentation scrolls, the component does not.
 *
 * Two decisions worth knowing about:
 *
 * 1. The split lives *inside* the docs content track — a flex row with a `sticky`
 *    right column — rather than a fixed 100vh app shell. The page keeps scrolling
 *    like a page, so Fumadocs' heading tracking, our full-width footer and the
 *    browser's scroll restoration all keep working.
 * 2. The stage renders the demo in an **iframe** pointed at its isolated route.
 *    Constraining a `div` to 390px only narrows the box — the demo inside still
 *    lays itself out for the wide viewport it thinks it is in, so media queries
 *    never fire and wide content spills. An iframe *is* a viewport, so the
 *    switcher shows what a phone would actually show.
 */
export const SplitPreviewShell = ({
  children,
  files,
  nav,
  popOutHref,
  title,
}: SplitPreviewShellProps) => {
  const shouldReduceMotion = useReducedMotion();
  const [isInfoHidden, setIsInfoHidden] = useState(false);
  const [pane, setPane] = useState<Pane>("info");
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [activeFile, setActiveFile] = useState(0);
  const file = files[activeFile] ?? files[0];

  const paneTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: PANE_DURATION, ease: EASE_OUT };

  return (
    // Preview first in the DOM, reversed on desktop: on a phone the component is
    // what you came for, so it goes above the prose; on a wide screen it belongs
    // on the right.
    // The row stays inside Fumadocs' prose scope so the info column keeps every
    // heading, list and table style it has today; only the stage opts out.
    <div className="flex flex-col-reverse gap-6 lg:flex-row lg:gap-10">
      <div
        className={cn(
          "min-w-0 flex-1",
          isInfoHidden && "hidden lg:hidden",
          // Cancels the page's 56px top padding, same as the stage does, so the
          // row starts where it will end up once pinned instead of travelling
          // down to the navbar on the first scroll.
          "lg:-mt-14",
          // Sections need to read as sections. The gap before a heading is what
          // does that work — roughly 80px before an h2, 48 before an h3 — not
          // boxes or rules around the content.
          "[&_h2]:mt-20 [&_h2]:mb-5 [&_h3]:mt-12 [&_h3]:mb-3",
          "[&_h2:first-child]:mt-0 [&_p]:leading-relaxed"
        )}
      >
        {/* The crumb and the pane switch follow the scroll: on a page this long
            you should never have to scroll back up to change what you are
            reading, or to find your way out. */}
        {/* The gap under the row is deliberate: the blur reaches 170px down from
            the navbar, so content starting right under the crumb would open
            already smudged. It begins past the fade instead. */}
        <div
          className={cn(
            // Below Fumadocs' sidebar wrapper (z-20): the revealed catalogue is an
            // overlay and has to cover this row, not slide under it.
            // `top-[6.5rem]` rather than `top-24`: 10px lower, which lines the crumb
            // up with the centre of the stage's floating controls opposite it.
            "not-prose sticky top-[6.5rem] z-10 mb-6 flex items-center justify-start gap-3 py-2 lg:justify-between",
            // Prose scrolls under the blur, so it starts past it. The code panel
            // has its own scroll and never passes underneath, so it can start
            // right away and use the full height.
            pane === "info" ? "lg:mb-36" : "bg-background lg:mb-4"
          )}
        >
          {/* The blur lives inside the row, so it spans this column and nothing
              else — a viewport-wide fixed blur also washed over the stage, which
              is the one thing on the page that must stay sharp. */}
          {/* The module paints nothing on the top/bottom sides — it only blurs —
              so text stayed legible-but-smudged instead of fading out. Painting
              the page colour under the mask is what makes it dissolve. */}
          {/* Only in the reading pane. `backdrop-filter` blurs whatever paints
              beneath it, and the row is a stacking context above the pane, so in
              code mode it was smudging the top of the editor — which has its own
              scroll and never passes underneath anyway. */}
          {pane === "info" && (
            <BlurMagic
              background="var(--color-background)"
              blur="6px"
              className="absolute! inset-x-0! -top-2! -z-10 h-[178px]! w-auto!"
              side="top"
              stop="25%"
              style={{
                background:
                  "linear-gradient(to bottom, var(--color-background), transparent)",
              }}
            />
          )}

          <div className="hidden lg:block">{nav}</div>
          {/* No background on the row: the blur underneath is what separates it
              from the content, and a second surface on top of that reads as a
              toolbar the page does not need. */}
          <div className="inline-flex items-center gap-1">
            <PaneTab
              icon={<FileText aria-hidden="true" size={14} />}
              isActive={pane === "info"}
              label="Documentation"
              onClick={() => setPane("info")}
            />
            <PaneTab
              icon={<Code2 aria-hidden="true" size={14} />}
              isActive={pane === "source"}
              label="Code"
              onClick={() => setPane("source")}
            />
          </div>
        </div>

        {/* Keyed on the pane, no `AnimatePresence`: waiting for an exit
            animation means the incoming pane never mounts if the frame loop is
            throttled — a background tab froze the switch entirely. Remounting and
            animating in has no such dependency. */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={
            shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: PANE_OFFSET }
          }
          key={pane}
          transition={paneTransition}
        >
          {pane === "info" ? (
            children
          ) : (
            <div className="not-prose flex flex-col lg:sticky lg:top-[9.75rem] lg:h-[calc(100dvh-11rem)]">
              {/* Tabs, like an editor: three unlabelled code blocks told you
                  nothing about which file you were reading. */}
              <div className="flex items-center gap-1 overflow-x-auto rounded-t-lg border border-b-0 bg-muted/40 px-1 pt-1">
                {files.map((entry, index) => (
                  <button
                    aria-pressed={index === activeFile}
                    className={cn(
                      "shrink-0 rounded-t-md px-3 py-1.5 font-mono text-xs transition-colors",
                      index === activeFile
                        ? "bg-background text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    key={entry.name}
                    onClick={() => setActiveFile(index)}
                    type="button"
                  >
                    {entry.name}
                  </button>
                ))}
              </div>
              {/* Fumadocs' code block caps its scroller at 600px, so inside a
                  full-height panel the code stopped halfway and left the rest of
                  the box empty. Let it fill and scroll on its own. */}
              <div className="min-h-0 flex-1 overflow-hidden rounded-b-lg border [&>div]:h-full [&_figure>div]:h-full [&_figure>div]:max-h-none! [&_figure]:h-full">
                {file && (
                  <PreviewCode
                    code={file.code}
                    filename={file.name}
                    language="tsx"
                  />
                )}
              </div>
            </div>
          )}
        </motion.div>

        {/* Reading pane only, like the top one: the code panel has its own
            scroll and nothing passes underneath, so a blur there would just
            smudge the last lines. */}
        {/* Sticky rather than fixed: it rides the bottom of the viewport but only
            ever covers the reading column. */}
        {pane === "info" && (
          <div className="not-prose pointer-events-none sticky bottom-0 z-20 hidden h-[120px] lg:block">
            <BlurMagic
              background="var(--color-background)"
              blur="6px"
              className="absolute! inset-x-0! bottom-0! h-[120px]! w-auto!"
              side="bottom"
              stop="25%"
              style={{
                background:
                  "linear-gradient(to top, var(--color-background), transparent)",
              }}
            />
          </div>
        )}
      </div>

      <div
        className={cn(
          "not-prose relative w-full",
          // Pinned under the navbar and exactly as tall as what is left of the
          // viewport, so the stage never scrolls out from under the component.
          "lg:sticky lg:top-24 lg:h-[calc(100dvh-6rem)] lg:self-start",
          // Measured, not guessed: the docs main area is 56px top / 32px sides at
          // md+, and the navbar bottom sits at 96px.
          // Cancels the docs page's own padding — 56px top, 32px sides at md+ —
          // so the stage reaches the header and bleeds off the right edge instead
          // of floating inside the article's gutter.
          "lg:-mt-14 lg:-mr-8",
          // The reading column stays pinned to the end because it contains the
          // footer, so its container runs to the bottom of the page. The stage
          // has no such tail: it was releasing 24px early, exactly the article's
          // bottom padding. Reclaiming it makes both sides behave the same.
          "lg:-mb-6",
          isInfoHidden ? "lg:w-full" : "lg:w-[46%] xl:w-[50%]"
        )}
      >
        {/* The same dotted stage every preview in the docs uses (`frame-box`), so
            this looks like SmoothUI and not like a second design. On a phone the
            column sits mid-article, where a radius keeps it from bleeding into the
            prose; on desktop it runs edge to edge. */}
        <div className="frame-box relative flex h-[70dvh] items-center justify-center overflow-hidden rounded-xl lg:h-full lg:rounded-none">
          {/* Sized with `max-width`, not `width`: as a flex item the stage's used
              width comes from the layout, so an inline `width` was ignored while a
              `max-width` constrains it — which is what makes the switcher real.
              No card, no border, no white fill: a narrowed viewport is just a
              narrower window onto the same dotted stage. The iframe is loaded with
              `?embed=1` so its document is transparent and the dots show through. */}
          {/* No transition on `max-width`: the desktop value is a percentage and
              the device values are px, and a percentage↔px transition does not
              interpolate — the property got stuck at 100% and the switcher looked
              dead. A viewport change is a discrete change anyway. */}
          <div
            className="relative z-1 h-full w-full min-w-0"
            style={{ maxWidth: VIEWPORT_WIDTH[viewport] }}
          >
            <iframe
              className="size-full border-0 bg-transparent"
              src={`${popOutHref}?embed=1`}
              title={`${title} preview`}
            />
          </div>

          {/* Desktop only: on a phone the stage is the width of the screen, so a
              viewport switcher is meaningless and the rest is chrome over the one
              thing you came to see. */}
          <div className="absolute top-3 right-3 z-10 hidden items-center gap-0.5 rounded-xl border border-border/60 bg-background/80 p-1 shadow-black/5 shadow-sm backdrop-blur lg:flex">
            <ToggleGroup
              className="hidden gap-0.5 sm:flex"
              onValueChange={(value) => {
                if (value) {
                  setViewport(value as Viewport);
                }
              }}
              type="single"
              value={viewport}
            >
              {VIEWPORTS.map(({ icon, label, value }) => (
                <ToggleGroupItem
                  className="size-7 p-0 data-[state=on]:bg-fd-primary/10 data-[state=on]:text-fd-primary"
                  key={value}
                  title={label}
                  value={value}
                >
                  <span className="sr-only">{label}</span>
                  {icon}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <Separator
              className="mx-1 hidden h-5 sm:block"
              orientation="vertical"
            />
            <Button
              asChild
              className="size-7 p-0"
              size="icon-sm"
              variant="ghost"
            >
              <Link href={popOutHref} rel="noopener noreferrer" target="_blank">
                <span className="sr-only">Open preview in a new tab</span>
                <SquareArrowOutUpRight aria-hidden="true" size={15} />
              </Link>
            </Button>
            <Button
              aria-pressed={isInfoHidden}
              className="size-7 p-0"
              onClick={() => setIsInfoHidden((hidden) => !hidden)}
              size="icon-sm"
              title={isInfoHidden ? "Show the docs" : "Preview full width"}
              variant="ghost"
            >
              <span className="sr-only">
                {isInfoHidden ? "Show the docs" : "Preview full width"}
              </span>
              {isInfoHidden ? (
                <Minimize2 aria-hidden="true" size={15} />
              ) : (
                <Maximize2 aria-hidden="true" size={15} />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PaneTab = ({
  icon,
  isActive,
  label,
  onClick,
}: {
  icon: ReactNode;
  isActive: boolean;
  label: string;
  onClick: () => void;
}) => (
  <button
    aria-pressed={isActive}
    className={cn(
      "flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm transition-colors",
      isActive
        ? "text-foreground"
        : "text-muted-foreground/70 hover:text-foreground"
    )}
    onClick={onClick}
    type="button"
  >
    {icon}
    {label}
  </button>
);
