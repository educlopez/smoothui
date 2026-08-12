"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { SmilePlus } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  type KeyboardEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

export type EmojiReactionSize = "sm" | "md" | "lg";

export type EmojiReactionItem = {
  count?: number;
  emoji: string;
  id: string;
  label: string;
  reacted?: boolean;
};

export type EmojiReactionProps = {
  /** When false (default), reacting to one item clears any other active reaction. */
  allowMultiple?: boolean;
  /** Emits a particle burst when a reaction is selected. */
  burst?: boolean;
  burstCount?: number;
  className?: string;
  /** Renders the picker popover already open. Useful for docs and screenshots. */
  defaultPickerOpen?: boolean;
  onReact?: (id: string, nextReacted: boolean) => void;
  /** Extra emojis offered by the picker popover. */
  pickerEmojis?: string[];
  reactions: EmojiReactionItem[];
  /** Shows a hover/focus popover with extra reaction options. */
  showPicker?: boolean;
  size?: EmojiReactionSize;
};

type BurstParticle = {
  id: string;
  opacity: number;
  size: number;
  x: number;
  y: number;
};

const DEFAULT_BURST_COUNT = 10;
const DEFAULT_PICKER_EMOJIS = ["🎉", "🔥", "😍", "👀", "🚀", "💯"];
const BURST_ANGLE_JITTER_DEG = 22;
const BURST_DISTANCE_MIN_PX = 22;
const BURST_DISTANCE_RANGE_PX = 18;
const BURST_DURATION_S = 0.55;
const BURST_DOT_MIN_PX = 3;
const BURST_DOT_RANGE_PX = 3;
const BURST_OPACITY_MIN = 0.45;
const BURST_OPACITY_RANGE = 0.55;
const ODOMETER_OFFSET_PX = 12;
const CLOSE_DELAY_MS = 140;
const STAGGER_S = 0.03;
const PRESS_SCALE = 0.97;
const POP_SCALE = 0.7;
const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const LCG_MULTIPLIER = 1_664_525;
const LCG_INCREMENT = 1_013_904_223;
const UINT32_MAX = 0xff_ff_ff_ff;
const DEGREES_PER_TURN = 360;
const DEGREES_TO_RADIANS = Math.PI / 180;

const SPRING = { bounce: 0.1, duration: 0.25, type: "spring" } as const;
const POP_SPRING = { bounce: 0.4, duration: 0.4, type: "spring" } as const;
const INSTANT = { duration: 0 } as const;

const SIZE_CLASSES: Record<EmojiReactionSize, string> = {
  lg: "h-11 gap-2 px-4 text-base",
  md: "h-9 gap-1.5 px-3 text-sm",
  sm: "h-7 gap-1 px-2 text-xs",
};

const EMOJI_CLASSES: Record<EmojiReactionSize, string> = {
  lg: "text-xl",
  md: "text-base",
  sm: "text-sm",
};

const TRIGGER_CLASSES: Record<EmojiReactionSize, string> = {
  lg: "size-11",
  md: "size-9",
  sm: "size-7",
};

const MENU_VARIANTS = {
  closed: {
    opacity: 0,
    scale: 0.94,
    transition: { duration: 0.15, ease: EASE_OUT },
    y: 6,
  },
  open: {
    opacity: 1,
    scale: 1,
    transition: { ...SPRING, staggerChildren: STAGGER_S },
    y: 0,
  },
};

const MENU_VARIANTS_REDUCED = {
  closed: { opacity: 0, transition: INSTANT },
  open: { opacity: 1, transition: INSTANT },
};

const MENU_ITEM_VARIANTS = {
  closed: { opacity: 0, scale: 0.9 },
  open: { opacity: 1, scale: 1 },
};

const MENU_ITEM_VARIANTS_REDUCED = {
  closed: { opacity: 0 },
  open: { opacity: 1 },
};

const DIGIT_VARIANTS = {
  center: { opacity: 1, y: 0 },
  enter: (direction: number) => ({
    opacity: 0,
    y: direction * ODOMETER_OFFSET_PX,
  }),
  exit: (direction: number) => ({
    opacity: 0,
    y: -direction * ODOMETER_OFFSET_PX,
  }),
};

const DIGIT_VARIANTS_REDUCED = {
  center: { opacity: 1 },
  enter: { opacity: 0 },
  exit: { opacity: 0 },
};

/** Deterministic seeded jitter — no `Math.random()`, called from the click handler. */
const createBurstParticles = (count: number, seed: number): BurstParticle[] => {
  let state = seed;
  const next = () => {
    state = (state * LCG_MULTIPLIER + LCG_INCREMENT) >>> 0;
    return state / UINT32_MAX;
  };
  return Array.from({ length: count }, (_, index) => {
    const baseAngle = (DEGREES_PER_TURN / count) * index;
    const jitter = (next() - 0.5) * BURST_ANGLE_JITTER_DEG;
    const angle = (baseAngle + jitter) * DEGREES_TO_RADIANS;
    const distance = BURST_DISTANCE_MIN_PX + next() * BURST_DISTANCE_RANGE_PX;
    return {
      id: `${seed}-${index}`,
      opacity: BURST_OPACITY_MIN + next() * BURST_OPACITY_RANGE,
      size: BURST_DOT_MIN_PX + Math.round(next() * BURST_DOT_RANGE_PX),
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
    };
  });
};

const useHoverCapable = () => {
  const [isHoverCapable, setIsHoverCapable] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    setIsHoverCapable(mediaQuery.matches);
    const handleChange = (event: MediaQueryListEvent) => {
      setIsHoverCapable(event.matches);
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isHoverCapable;
};

/**
 * One burst = one ring plus a handful of dots, all keyed to the same seed.
 * The ring owns the lifecycle: when its animation completes the whole layer
 * is unmounted, so particles can never leak across reactions.
 */
const BurstLayer = ({
  count,
  onComplete,
  seed,
}: {
  count: number;
  onComplete: () => void;
  seed: number;
}) => {
  const particles = useMemo(
    () => createBurstParticles(count, seed),
    [count, seed]
  );

  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
    >
      <motion.span
        animate={{ opacity: 0, scale: 1.9 }}
        className="absolute size-6 rounded-full border border-brand/50"
        initial={{ opacity: 0.7, scale: 0.4 }}
        onAnimationComplete={onComplete}
        transition={{ duration: BURST_DURATION_S, ease: EASE_OUT }}
      />
      {particles.map((particle) => (
        <motion.span
          animate={{ opacity: 0, scale: 0.4, x: particle.x, y: particle.y }}
          className="absolute rounded-full bg-brand"
          initial={{ opacity: particle.opacity, scale: 1, x: 0, y: 0 }}
          key={particle.id}
          style={{ height: particle.size, width: particle.size }}
          transition={{ duration: BURST_DURATION_S, ease: EASE_OUT }}
        />
      ))}
    </span>
  );
};

const OdometerCount = ({
  count,
  shouldReduceMotion,
}: {
  count: number;
  shouldReduceMotion: boolean;
}) => {
  const previousRef = useRef(count);
  const direction = count < previousRef.current ? -1 : 1;

  useEffect(() => {
    previousRef.current = count;
  }, [count]);

  return (
    <span
      aria-hidden="true"
      className="relative inline-flex h-[1.15em] items-center overflow-hidden text-center tabular-nums leading-none"
    >
      <AnimatePresence custom={direction} initial={false} mode="popLayout">
        <motion.span
          animate="center"
          className="block leading-none"
          custom={direction}
          exit="exit"
          initial="enter"
          key={count}
          transition={shouldReduceMotion ? INSTANT : SPRING}
          variants={
            shouldReduceMotion ? DIGIT_VARIANTS_REDUCED : DIGIT_VARIANTS
          }
        >
          {count}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

type ReactionButtonProps = {
  burst: boolean;
  burstCount: number;
  onSelect: (id: string) => void;
  reaction: EmojiReactionItem;
  shouldReduceMotion: boolean;
  size: EmojiReactionSize;
};

const ReactionButton = ({
  burst,
  burstCount,
  onSelect,
  reaction,
  shouldReduceMotion,
  size,
}: ReactionButtonProps) => {
  const [burstId, setBurstId] = useState<number | null>(null);
  const [popKey, setPopKey] = useState(0);
  const seedRef = useRef(0);
  const count = reaction.count ?? 0;
  const reacted = Boolean(reaction.reacted);

  const handleClick = () => {
    const nextReacted = !reacted;
    onSelect(reaction.id);
    if (!nextReacted) {
      return;
    }
    setPopKey((key) => key + 1);
    if (burst && !shouldReduceMotion) {
      seedRef.current += 1;
      setBurstId(seedRef.current);
    }
  };

  const handleBurstComplete = useCallback(() => {
    setBurstId(null);
  }, []);

  return (
    <motion.button
      aria-label={`${reaction.label}, ${count} ${count === 1 ? "reaction" : "reactions"}`}
      aria-pressed={reacted}
      className={cn(
        "relative inline-flex cursor-pointer select-none items-center rounded-full border font-medium",
        "transition-[background-color,border-color,box-shadow,color] duration-150 ease-out",
        "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "before:absolute before:-inset-1 before:content-['']",
        SIZE_CLASSES[size],
        // A pill holding a saturated emoji must not be painted: brand fill
        // fights the glyph it contains. The toggle reads physically instead —
        // resting pills sit a hair proud of the page, a reacted pill is
        // pressed into a well with a crisper rim and full-strength label.
        // Brand shows up only in the burst, at the moment of the press.
        reacted
          ? "border-foreground/20 bg-foreground/[0.06] text-foreground shadow-[inset_0_1px_2px_rgb(0_0_0/0.10)] dark:border-foreground/25 dark:bg-foreground/[0.10] dark:shadow-[inset_0_1px_2px_rgb(0_0_0/0.45)]"
          : "border-foreground/12 bg-background text-muted-foreground shadow-[0_1px_1px_rgb(0_0_0/0.04)] hover:border-foreground/25 hover:bg-foreground/[0.03] hover:text-foreground dark:shadow-none"
      )}
      onClick={handleClick}
      type="button"
      whileTap={shouldReduceMotion ? undefined : { scale: PRESS_SCALE }}
    >
      <span className="relative inline-flex items-center justify-center">
        <motion.span
          animate={{ scale: 1, y: 0 }}
          aria-hidden="true"
          className={cn("block leading-none", EMOJI_CLASSES[size])}
          initial={
            popKey === 0 || shouldReduceMotion
              ? false
              : { scale: POP_SCALE, y: 2 }
          }
          key={popKey}
          transition={shouldReduceMotion ? INSTANT : POP_SPRING}
        >
          {reaction.emoji}
        </motion.span>
        {burstId === null ? null : (
          <BurstLayer
            count={burstCount}
            key={burstId}
            onComplete={handleBurstComplete}
            seed={burstId}
          />
        )}
      </span>
      <OdometerCount count={count} shouldReduceMotion={shouldReduceMotion} />
    </motion.button>
  );
};

type EmojiPickerProps = {
  defaultOpen: boolean;
  emojis: string[];
  onSelect: (emoji: string) => void;
  shouldReduceMotion: boolean;
  size: EmojiReactionSize;
};

const EmojiPicker = ({
  defaultOpen,
  emojis,
  onSelect,
  shouldReduceMotion,
  size,
}: EmojiPickerProps) => {
  const isHoverCapable = useHoverCapable();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const closeTimerRef = useRef<number | null>(null);
  const shouldFocusRef = useRef(false);
  const menuId = useId();

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const open = useCallback(
    (withFocus: boolean) => {
      clearCloseTimer();
      shouldFocusRef.current = withFocus;
      setIsOpen(true);
    },
    [clearCloseTimer]
  );

  const close = useCallback(
    (returnFocus: boolean) => {
      clearCloseTimer();
      setIsOpen(false);
      if (returnFocus) {
        triggerRef.current?.focus();
      }
    },
    [clearCloseTimer]
  );

  // A delayed close keeps the popover alive while the pointer crosses the
  // gap between the trigger and the card, which is what causes flicker.
  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      setIsOpen(false);
    }, CLOSE_DELAY_MS);
  }, [clearCloseTimer]);

  useEffect(() => clearCloseTimer, [clearCloseTimer]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        close(false);
      }
    };
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        close(true);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [close, isOpen]);

  // Only a keyboard or click open moves focus — hovering must never steal it.
  useEffect(() => {
    if (isOpen && shouldFocusRef.current) {
      shouldFocusRef.current = false;
      setActiveIndex(0);
      itemRefs.current[0]?.focus();
    }
  }, [isOpen]);

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      open(true);
    }
  };

  const focusItem = (index: number) => {
    setActiveIndex(index);
    itemRefs.current[index]?.focus();
  };

  const handleItemKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      focusItem((index + 1) % emojis.length);
      return;
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      focusItem((index - 1 + emojis.length) % emojis.length);
      return;
    }
    if (event.key === "Escape") {
      close(true);
      return;
    }
    if (event.key === "Tab") {
      close(false);
    }
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => {
        if (isHoverCapable) {
          open(false);
        }
      }}
      onMouseLeave={() => {
        if (isHoverCapable) {
          scheduleClose();
        }
      }}
      ref={containerRef}
    >
      <motion.button
        aria-controls={menuId}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="More reactions"
        className={cn(
          "inline-flex cursor-pointer items-center justify-center rounded-full border border-foreground/12 bg-background text-muted-foreground",
          "transition-[background-color,border-color,color] duration-150 ease-out hover:border-foreground/25 hover:bg-foreground/5 hover:text-foreground",
          "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          TRIGGER_CLASSES[size]
        )}
        onClick={() => (isOpen ? close(false) : open(true))}
        onKeyDown={handleTriggerKeyDown}
        ref={triggerRef}
        type="button"
        whileTap={shouldReduceMotion ? undefined : { scale: PRESS_SCALE }}
      >
        <SmilePlus aria-hidden="true" className="size-4" />
      </motion.button>

      <AnimatePresence>
        {isOpen ? (
          // The wrapper carries the offset as padding, not margin, so the
          // pointer never leaves the hover region on its way to the card.
          <span
            className="absolute bottom-full left-1/2 z-20 block -translate-x-1/2 pb-2"
            key="picker"
          >
            <motion.div
              animate="open"
              className="flex gap-1 rounded-2xl border border-foreground/10 bg-background p-1.5 shadow-black/5 shadow-lg"
              exit="closed"
              id={menuId}
              initial="closed"
              role="menu"
              style={{ transformOrigin: "bottom center" }}
              variants={
                shouldReduceMotion ? MENU_VARIANTS_REDUCED : MENU_VARIANTS
              }
            >
              {emojis.map((emoji, index) => (
                <motion.button
                  aria-label={`React with ${emoji}`}
                  className="flex size-9 cursor-pointer items-center justify-center rounded-xl text-lg outline-none transition-colors duration-150 ease-out hover:bg-foreground/10 focus-visible:ring-2 focus-visible:ring-ring"
                  key={emoji}
                  onClick={() => {
                    onSelect(emoji);
                    close(true);
                  }}
                  onKeyDown={(event) => handleItemKeyDown(event, index)}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  role="menuitem"
                  tabIndex={activeIndex === index ? 0 : -1}
                  type="button"
                  variants={
                    shouldReduceMotion
                      ? MENU_ITEM_VARIANTS_REDUCED
                      : MENU_ITEM_VARIANTS
                  }
                >
                  {emoji}
                </motion.button>
              ))}
            </motion.div>
          </span>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

const EmojiReaction = ({
  allowMultiple = false,
  burst = true,
  burstCount = DEFAULT_BURST_COUNT,
  className,
  defaultPickerOpen = false,
  onReact,
  pickerEmojis = DEFAULT_PICKER_EMOJIS,
  reactions,
  showPicker = false,
  size = "md",
}: EmojiReactionProps) => {
  const shouldReduceMotion = Boolean(useReducedMotion());

  const handleReact = useCallback(
    (id: string) => {
      const target = reactions.find((reaction) => reaction.id === id);
      if (!target) {
        return;
      }
      const nextReacted = !target.reacted;
      if (!allowMultiple && nextReacted) {
        for (const other of reactions) {
          if (other.id !== id && other.reacted) {
            onReact?.(other.id, false);
          }
        }
      }
      onReact?.(id, nextReacted);
    },
    [allowMultiple, onReact, reactions]
  );

  // A picked emoji that already exists in the bar toggles that reaction so
  // the exclusivity rule still applies; anything else is reported as new.
  const handlePickerSelect = useCallback(
    (emoji: string) => {
      const existing = reactions.find(
        (reaction) => reaction.id === emoji || reaction.emoji === emoji
      );
      if (existing) {
        if (!existing.reacted) {
          handleReact(existing.id);
        }
        return;
      }
      onReact?.(emoji, true);
    },
    [handleReact, onReact, reactions]
  );

  return (
    <div
      aria-label="Reactions"
      className={cn("flex flex-wrap items-center gap-2", className)}
      role="group"
    >
      {reactions.map((reaction) => (
        <ReactionButton
          burst={burst}
          burstCount={burstCount}
          key={reaction.id}
          onSelect={handleReact}
          reaction={reaction}
          shouldReduceMotion={shouldReduceMotion}
          size={size}
        />
      ))}
      {showPicker ? (
        <EmojiPicker
          defaultOpen={defaultPickerOpen}
          emojis={pickerEmojis}
          onSelect={handlePickerSelect}
          shouldReduceMotion={shouldReduceMotion}
          size={size}
        />
      ) : null}
    </div>
  );
};

export default EmojiReaction;
