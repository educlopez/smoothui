"use client";

import GooeyFilter from "@repo/smoothui/components/gooey-filter";
import SmoothButton from "@repo/smoothui/components/smooth-button";
import type { LucideIcon } from "lucide-react";
import {
  Bell,
  Image as ImageIcon,
  Link2,
  Plus,
  Smile,
  Type,
} from "lucide-react";
import { motion, useMotionValue, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { useState } from "react";

const EASE_IN_OUT = [0.645, 0.045, 0.355, 1] as const;
const SPRING = { bounce: 0.1, duration: 0.25, type: "spring" } as const;
const INSTANT = { duration: 0 } as const;

const FAB_SIZE = 60;
const ACTION_SIZE = 44;
const CLOSED_SCALE = 0.55;

/** Four actions on a 96px arc above the trigger. */
const FAB_ACTIONS: {
  Icon: LucideIcon;
  dx: number;
  dy: number;
  label: string;
}[] = [
  { dx: -83, dy: -48, Icon: ImageIcon, label: "Add image" },
  { dx: -33, dy: -90, Icon: Type, label: "Add text" },
  { dx: 33, dy: -90, Icon: Link2, label: "Add link" },
  { dx: 83, dy: -48, Icon: Smile, label: "Add reaction" },
];

const DOT_SIZE = 28;
const DOT_TRAVEL = 32;
const DOT_OFFSETS = [-42, 0, 42];

const HOST_SIZE = 96;
const BADGE_SIZE = 32;
const BADGE_INSET_X = HOST_SIZE / 2 - BADGE_SIZE / 2 - 4;
const BADGE_INSET_Y = -HOST_SIZE / 2 - BADGE_SIZE / 2 + 10;

const anchorStyle = (size: number, top: string) => ({
  height: size,
  left: "50%",
  marginLeft: -size / 2,
  marginTop: -size / 2,
  position: "absolute" as const,
  top,
  width: size,
});

const Panel = ({
  children,
  description,
  enabled,
  onToggle,
  title,
}: {
  children: ReactNode;
  description: string;
  enabled: boolean;
  onToggle: () => void;
  title: string;
}) => (
  <section className="flex h-full min-h-[280px] flex-col gap-3 rounded-xl border border-foreground/10 bg-background p-4">
    <header className="flex flex-col gap-1.5">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium text-[14px] text-foreground tracking-tight">
          {title}
        </h3>
        <SmoothButton
          aria-pressed={enabled}
          color="accent"
          onClick={onToggle}
          shape="pill"
          size="xs"
          variant={enabled ? "solid" : "outline"}
        >
          {enabled ? "Goo on" : "Goo off"}
        </SmoothButton>
      </div>
      <p className="text-[12px] text-muted-foreground leading-snug">
        {description}
      </p>
    </header>
    <div className="relative min-h-0 flex-1 overflow-hidden rounded-lg bg-foreground/[0.03]">
      {children}
    </div>
  </section>
);

export default function GooeyFilterDemo() {
  const shouldReduceMotion = useReducedMotion();
  const [fabGoo, setFabGoo] = useState(true);
  const [loaderGoo, setLoaderGoo] = useState(true);
  const [badgeGoo, setBadgeGoo] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const badgeX = useMotionValue(0);
  const badgeY = useMotionValue(0);

  const actionTransform = (dx: number, dy: number) =>
    isOpen
      ? `translate3d(${dx}px, ${dy}px, 0) scale(1)`
      : `translate3d(0px, 0px, 0) scale(${CLOSED_SCALE})`;

  return (
    <div className="grid h-full w-full grid-cols-1 gap-4 overflow-y-auto md:grid-cols-3">
      <Panel
        description="Child actions pull out of the trigger and visibly un-merge as they travel."
        enabled={fabGoo}
        onToggle={() => setFabGoo((value) => !value)}
        title="Fluid action button"
      >
        <GooeyFilter
          className="absolute inset-0"
          contrast={22}
          disabled={!fabGoo}
          strength={9}
        >
          {FAB_ACTIONS.map(({ dx, dy, label }) => (
            <motion.span
              animate={{ transform: actionTransform(dx, dy) }}
              aria-hidden="true"
              key={label}
              style={{
                ...anchorStyle(ACTION_SIZE, "74%"),
                background: "var(--color-brand)",
                borderRadius: 9999,
              }}
              transition={shouldReduceMotion ? INSTANT : SPRING}
            />
          ))}
          <span
            aria-hidden="true"
            style={{
              ...anchorStyle(FAB_SIZE, "74%"),
              background: "var(--color-brand)",
              borderRadius: 9999,
            }}
          />
        </GooeyFilter>

        <div className="absolute inset-0">
          {FAB_ACTIONS.map(({ Icon, dx, dy, label }) => (
            <motion.div
              animate={{
                opacity: isOpen ? 1 : 0,
                transform: actionTransform(dx, dy),
              }}
              key={label}
              style={{
                ...anchorStyle(ACTION_SIZE, "74%"),
                pointerEvents: isOpen ? "auto" : "none",
              }}
              transition={shouldReduceMotion ? INSTANT : SPRING}
            >
              <SmoothButton
                aria-label={label}
                className="size-full text-white hover:bg-white/15"
                disabled={!isOpen}
                shape="pill"
                size="icon"
                variant="ghost"
              >
                <Icon />
              </SmoothButton>
            </motion.div>
          ))}
          <div style={anchorStyle(FAB_SIZE, "74%")}>
            <SmoothButton
              aria-expanded={isOpen}
              aria-label={isOpen ? "Close actions" : "Open actions"}
              className="size-full text-white hover:bg-white/15"
              onClick={() => setIsOpen((value) => !value)}
              shape="pill"
              size="icon-lg"
              variant="ghost"
            >
              <motion.span
                animate={{ transform: `rotate(${isOpen ? 45 : 0}deg)` }}
                className="flex"
                transition={shouldReduceMotion ? INSTANT : SPRING}
              >
                <Plus className="size-6" />
              </motion.span>
            </SmoothButton>
          </div>
        </div>
      </Panel>

      <Panel
        description="Dots crossing the same point fuse into one blob and split again."
        enabled={loaderGoo}
        onToggle={() => setLoaderGoo((value) => !value)}
        title="Merging loader"
      >
        <GooeyFilter
          className="absolute inset-0"
          contrast={20}
          disabled={!loaderGoo}
          strength={10}
        >
          {DOT_OFFSETS.map((offset, index) => {
            const travel = index === 1 ? 0 : -Math.sign(offset) * DOT_TRAVEL;
            return (
              <motion.span
                animate={
                  shouldReduceMotion
                    ? undefined
                    : {
                        transform: [
                          `translate3d(${offset}px, 0px, 0)`,
                          `translate3d(${offset + travel}px, 0px, 0)`,
                          `translate3d(${offset}px, 0px, 0)`,
                        ],
                      }
                }
                key={offset}
                style={{
                  ...anchorStyle(DOT_SIZE, "46%"),
                  background: "var(--color-brand)",
                  borderRadius: 9999,
                  transform: `translate3d(${offset}px, 0px, 0)`,
                }}
                transition={{
                  duration: 1.6,
                  ease: EASE_IN_OUT,
                  repeat: Number.POSITIVE_INFINITY,
                }}
              />
            );
          })}
        </GooeyFilter>
        <p className="absolute inset-x-0 bottom-4 text-center text-[11px] text-muted-foreground">
          Loading assets
        </p>
      </Panel>

      <Panel
        description="Drag the badge off its host: the goo holds a bridge until it snaps."
        enabled={badgeGoo}
        onToggle={() => setBadgeGoo((value) => !value)}
        title="Elastic badge"
      >
        <GooeyFilter
          className="absolute inset-0"
          contrast={20}
          disabled={!badgeGoo}
          strength={11}
        >
          <span
            aria-hidden="true"
            style={{
              ...anchorStyle(HOST_SIZE, "46%"),
              background: "var(--color-brand)",
              borderRadius: 26,
            }}
          />
          <motion.span
            aria-hidden="true"
            className="cursor-grab touch-none active:cursor-grabbing"
            drag
            dragConstraints={{ bottom: 80, left: -100, right: 100, top: -70 }}
            dragElastic={0.55}
            dragMomentum={false}
            dragSnapToOrigin
            style={{
              ...anchorStyle(BADGE_SIZE, "46%"),
              background: "var(--color-destructive)",
              borderRadius: 9999,
              marginLeft: BADGE_INSET_X,
              marginTop: BADGE_INSET_Y,
              x: badgeX,
              y: badgeY,
            }}
            transition={
              shouldReduceMotion
                ? INSTANT
                : { bounce: 0.2, duration: 0.4, type: "spring" }
            }
          />
        </GooeyFilter>

        <div className="pointer-events-none absolute inset-0">
          <span
            className="flex items-center justify-center text-white"
            style={anchorStyle(HOST_SIZE, "46%")}
          >
            <Bell className="size-8" strokeWidth={1.75} />
          </span>
          <motion.span
            className="flex items-center justify-center font-semibold text-[12px] text-white tabular-nums"
            style={{
              ...anchorStyle(BADGE_SIZE, "46%"),
              marginLeft: BADGE_INSET_X,
              marginTop: BADGE_INSET_Y,
              x: badgeX,
              y: badgeY,
            }}
          >
            3
          </motion.span>
        </div>
        <p className="absolute inset-x-0 bottom-4 text-center text-[11px] text-muted-foreground">
          3 unread — drag the badge with a pointer
        </p>
      </Panel>
    </div>
  );
}
