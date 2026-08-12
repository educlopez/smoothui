"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import SmoothButton from "@repo/smoothui/components/smooth-button";
import { BadgeCheck } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { FocusEvent, KeyboardEvent, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

const DEFAULT_OPEN_DELAY = 350;
const DEFAULT_CLOSE_DELAY = 150;
const CARD_MIN_SPACE_PX = 260;
const COUNT_UP_DURATION_MS = 600;
const SPRING_TRANSITION = {
  bounce: 0.1,
  duration: 0.25,
  type: "spring" as const,
};

export type SocialProfileStat = {
  label: string;
  value: number | string;
};

export type SocialProfile = {
  avatar: string;
  banner?: string;
  bio?: string;
  handle: string;
  id: string;
  name: string;
  stats?: SocialProfileStat[];
  url?: string;
  verified?: boolean;
};

export type SocialHoverCardPlacement = "auto" | "bottom" | "top";

export type SocialHoverCardProps = {
  className?: string;
  closeDelay?: number;
  following?: boolean;
  loading?: boolean;
  onFollowChange?: (following: boolean) => void;
  openDelay?: number;
  placement?: SocialHoverCardPlacement;
  profile: SocialProfile;
  trigger?: ReactNode;
};

const easeOutCubic = (progress: number) => 1 - (1 - progress) ** 3;

const CountUpValue = ({
  value,
  shouldAnimate,
}: {
  shouldAnimate: boolean;
  value: number;
}) => {
  const [display, setDisplay] = useState(shouldAnimate ? 0 : value);

  useEffect(() => {
    if (!shouldAnimate) {
      setDisplay(value);
      return;
    }

    let frameId = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / COUNT_UP_DURATION_MS, 1);
      setDisplay(Math.round(value * easeOutCubic(progress)));
      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [value, shouldAnimate]);

  return <span>{display.toLocaleString()}</span>;
};

const StatValue = ({
  stat,
  shouldAnimate,
}: {
  shouldAnimate: boolean;
  stat: SocialProfileStat;
}) => {
  if (typeof stat.value === "number") {
    return <CountUpValue shouldAnimate={shouldAnimate} value={stat.value} />;
  }
  return <span>{stat.value}</span>;
};

const CardSkeleton = () => (
  <div aria-hidden="true" className="animate-pulse p-4">
    <div className="h-16 rounded-lg bg-foreground/10" />
    <div className="mt-3 flex items-center gap-3">
      <div className="size-12 rounded-full bg-foreground/10" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-2/3 rounded bg-foreground/10" />
        <div className="h-3 w-1/3 rounded bg-foreground/10" />
      </div>
    </div>
    <div className="mt-4 h-3 w-full rounded bg-foreground/10" />
    <div className="mt-2 h-3 w-4/5 rounded bg-foreground/10" />
  </div>
);

const SocialHoverCard = ({
  profile,
  trigger,
  openDelay = DEFAULT_OPEN_DELAY,
  closeDelay = DEFAULT_CLOSE_DELAY,
  placement = "auto",
  following,
  onFollowChange,
  loading = false,
  className,
}: SocialHoverCardProps) => {
  const shouldReduceMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [openedVia, setOpenedVia] = useState<"focus" | "hover">("hover");
  const [isHoverDevice, setIsHoverDevice] = useState(false);
  const [resolvedPlacement, setResolvedPlacement] = useState<"bottom" | "top">(
    placement === "top" ? "top" : "bottom"
  );
  const [internalFollowing, setInternalFollowing] = useState(
    following ?? false
  );

  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const openTimeoutRef = useRef<number | undefined>(undefined);
  const closeTimeoutRef = useRef<number | undefined>(undefined);

  const isFollowingControlled = following !== undefined;
  const isFollowing = isFollowingControlled ? following : internalFollowing;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    setIsHoverDevice(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setIsHoverDevice(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    if (!(isOpen && placement === "auto" && triggerRef.current)) {
      return;
    }
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    setResolvedPlacement(
      spaceBelow < CARD_MIN_SPACE_PX && spaceAbove > spaceBelow
        ? "top"
        : "bottom"
    );
  }, [isOpen, placement]);

  useEffect(
    () => () => {
      window.clearTimeout(openTimeoutRef.current);
      window.clearTimeout(closeTimeoutRef.current);
    },
    []
  );

  const clearTimers = () => {
    window.clearTimeout(openTimeoutRef.current);
    window.clearTimeout(closeTimeoutRef.current);
  };

  const openCard = (via: "focus" | "hover") => {
    clearTimers();
    setOpenedVia(via);
    if (via === "hover") {
      openTimeoutRef.current = window.setTimeout(() => {
        setIsOpen(true);
      }, openDelay);
    } else {
      setIsOpen(true);
    }
  };

  const closeCard = (immediate = false) => {
    clearTimers();
    if (immediate) {
      setIsOpen(false);
      return;
    }
    closeTimeoutRef.current = window.setTimeout(() => {
      setIsOpen(false);
    }, closeDelay);
  };

  const handleTriggerClick = () => {
    if (isHoverDevice) {
      return;
    }
    if (isOpen) {
      closeCard(true);
    } else {
      openCard("focus");
    }
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Escape" && isOpen) {
      event.preventDefault();
      closeCard(true);
      triggerRef.current?.focus();
    }
  };

  const handleWrapperBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!wrapperRef.current?.contains(event.relatedTarget as Node | null)) {
      closeCard(true);
    }
  };

  const toggleFollow = () => {
    const next = !isFollowing;
    if (!isFollowingControlled) {
      setInternalFollowing(next);
    }
    onFollowChange?.(next);
  };

  const transformOrigin =
    resolvedPlacement === "top" ? "bottom center" : "top center";
  const cardId = `social-hover-card-${profile.id}`;

  return (
    <div
      className="relative inline-block"
      onBlur={handleWrapperBlur}
      onMouseEnter={() => isHoverDevice && openCard("hover")}
      onMouseLeave={() => isHoverDevice && closeCard()}
      ref={wrapperRef}
    >
      <button
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className={cn(
          "rounded font-medium text-brand text-sm underline-offset-2 hover:underline",
          className
        )}
        onClick={handleTriggerClick}
        onFocus={() => openCard("focus")}
        onKeyDown={handleTriggerKeyDown}
        ref={triggerRef}
        type="button"
      >
        {trigger ?? `@${profile.handle}`}
      </button>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            aria-label={
              openedVia === "focus"
                ? `${profile.name} profile preview`
                : undefined
            }
            className={cn(
              "absolute left-1/2 z-30 w-80 -translate-x-1/2 overflow-hidden rounded-2xl border border-foreground/10 bg-background shadow-xl",
              resolvedPlacement === "top" ? "bottom-full mb-2" : "top-full mt-2"
            )}
            exit={
              shouldReduceMotion
                ? { opacity: 0, transition: { duration: 0 } }
                : { opacity: 0, scale: 0.92 }
            }
            id={cardId}
            initial={
              shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92 }
            }
            onMouseEnter={() => isHoverDevice && clearTimers()}
            onMouseLeave={() => isHoverDevice && closeCard()}
            role={openedVia === "focus" ? "dialog" : undefined}
            style={{ transformOrigin }}
            transition={
              shouldReduceMotion ? { duration: 0 } : SPRING_TRANSITION
            }
          >
            {loading ? (
              <CardSkeleton />
            ) : (
              <div>
                {profile.banner ? (
                  <img
                    alt=""
                    className="h-16 w-full object-cover"
                    height={64}
                    src={profile.banner}
                    width={320}
                  />
                ) : (
                  <div className="h-16 w-full bg-gradient-to-r from-brand/40 to-brand/10" />
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        alt={profile.name}
                        className="size-12 shrink-0 rounded-full border-2 border-background object-cover"
                        height={48}
                        src={profile.avatar}
                        width={48}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          {profile.url ? (
                            <a
                              className="truncate font-semibold text-foreground text-sm hover:underline"
                              href={profile.url}
                              rel="noopener noreferrer"
                              target="_blank"
                            >
                              {profile.name}
                            </a>
                          ) : (
                            <p className="truncate font-semibold text-foreground text-sm">
                              {profile.name}
                            </p>
                          )}
                          {profile.verified ? (
                            <BadgeCheck
                              aria-label="Verified account"
                              className="size-4 shrink-0 text-brand"
                            />
                          ) : null}
                        </div>
                        <p className="truncate text-muted-foreground text-xs">
                          @{profile.handle}
                        </p>
                      </div>
                    </div>
                    <SmoothButton
                      asChild
                      color={isFollowing ? "neutral" : "accent"}
                      shape="pill"
                      size="xs"
                      variant={isFollowing ? "soft" : "solid"}
                    >
                      <motion.button
                        aria-pressed={isFollowing}
                        className="shrink-0"
                        layout
                        onClick={toggleFollow}
                        transition={
                          shouldReduceMotion
                            ? { duration: 0 }
                            : SPRING_TRANSITION
                        }
                        type="button"
                      >
                        <AnimatePresence initial={false} mode="wait">
                          <motion.span
                            animate={{ opacity: 1 }}
                            className="inline-block"
                            exit={{ opacity: 0 }}
                            initial={{ opacity: 0 }}
                            key={isFollowing ? "following" : "follow"}
                            transition={
                              shouldReduceMotion
                                ? { duration: 0 }
                                : { duration: 0.15 }
                            }
                          >
                            {isFollowing ? "Following" : "Follow"}
                          </motion.span>
                        </AnimatePresence>
                      </motion.button>
                    </SmoothButton>
                  </div>

                  {profile.bio ? (
                    <p className="mt-3 text-foreground/80 text-sm leading-relaxed">
                      {profile.bio}
                    </p>
                  ) : null}

                  {profile.stats?.length ? (
                    <ul className="mt-4 flex items-center gap-4">
                      {profile.stats.map((stat) => (
                        <li className="flex flex-col" key={stat.label}>
                          <span className="font-semibold text-foreground text-sm">
                            <StatValue
                              shouldAnimate={!shouldReduceMotion}
                              stat={stat}
                            />
                          </span>
                          <span className="text-muted-foreground text-xs">
                            {stat.label}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default SocialHoverCard;
