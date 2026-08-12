"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import SmoothButton from "@repo/smoothui/components/smooth-button";
import { Eye, EyeOff } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import type { KeyboardEvent, PointerEvent, ReactNode } from "react";
import { useEffect, useId, useRef, useState } from "react";

const STACK_OFFSET_DEFAULT = 13;
const STACK_SCALE_STEP = 0.05;
const MAX_STACK_DEPTH = 3;
/** Cards held in a hand tip away from you — this is that tilt. */
const RECEDE_ROTATE_X = 7;
/** Selected card comes toward the viewer instead of just growing. */
const ACTIVE_LIFT_Z = 36;
const PERSPECTIVE = 1400;
const AVATAR_OVERFLOW_THRESHOLD = 4;
const AVATAR_OVERLAP = 12;
const BLUR_AMOUNT = 6;
const CHAR_STAGGER = 0.018;
const INITIALS_MAX = 2;
const MASK_LENGTH = 6;
const SHEEN_HOME_X = 28;
const SHEEN_HOME_Y = 18;
const PERCENT = 100;

const SPRING_TRANSITION = {
  bounce: 0.1,
  duration: 0.25,
  type: "spring" as const,
};
const LIFT_TRANSITION = {
  bounce: 0.1,
  duration: 0.3,
  type: "spring" as const,
};
const SHEEN_SPRING = { damping: 26, mass: 0.4, stiffness: 140 };

/**
 * Fine grain over the whole card. Real cards are printed, not painted —
 * a flat gradient is the single biggest tell that a card is a CSS box.
 */
const NOISE_BACKGROUND =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E\")";

const DEFAULT_CARD_SURFACE =
  "bg-[linear-gradient(145deg,oklch(0.42_0.02_264),oklch(0.24_0.015_264))]";

export type WalletCardNetwork = "visa" | "mastercard" | "amex" | "generic";

export interface WalletAccount {
  balance: number;
  currency: string;
  /** Printed expiry, e.g. `"08/29"`. */
  expiry?: string;
  /** Tailwind classes for the card surface (gradient, colour, pattern). */
  gradient?: string;
  /** Embossed cardholder name. */
  holder?: string;
  id: string;
  label: string;
  last4?: string;
  network?: WalletCardNetwork;
}

export interface WalletMember {
  avatar?: string;
  id: string;
  name: string;
}

export interface WalletCardProps {
  accounts: WalletAccount[];
  actions?: ReactNode;
  activeId?: string;
  className?: string;
  hidden?: boolean;
  members?: WalletMember[];
  onActiveChange?: (id: string) => void;
  onHiddenChange?: (hidden: boolean) => void;
  stackOffset?: number;
}

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, INITIALS_MAX)
    .map((part) => part[0]?.toUpperCase())
    .join("");

/** EMV chip, contact grid and all. */
const EmvChip = () => {
  const gradientId = useId();

  return (
    <svg
      aria-hidden="true"
      className="h-[26px] w-[34px] shrink-0"
      fill="none"
      viewBox="0 0 34 26"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Chip</title>
      <defs>
        <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#f4e3ab" />
          <stop offset="45%" stopColor="#c9a544" />
          <stop offset="100%" stopColor="#8f6f22" />
        </linearGradient>
      </defs>
      <rect
        fill={`url(#${gradientId})`}
        height="25"
        rx="4.5"
        stroke="rgba(0,0,0,0.22)"
        width="33"
        x="0.5"
        y="0.5"
      />
      <g stroke="rgba(0,0,0,0.3)" strokeWidth="1">
        <path d="M0 8.5H11" />
        <path d="M0 17.5H11" />
        <path d="M23 8.5H34" />
        <path d="M23 17.5H34" />
        <path d="M11 3.5V22.5" />
        <path d="M23 3.5V22.5" />
        <path d="M11 13H23" />
      </g>
    </svg>
  );
};

/** Contactless payment glyph — three nested arcs. */
const ContactlessGlyph = () => (
  <svg
    aria-hidden="true"
    className="h-[18px] w-[18px] shrink-0 text-white/65"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeWidth="1.7"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>Contactless</title>
    <path d="M5.5 9.4a5.4 5.4 0 0 1 0 5.2" />
    <path d="M9.2 7a9.4 9.4 0 0 1 0 10" />
    <path d="M12.9 4.7a13.4 13.4 0 0 1 0 14.6" />
  </svg>
);

const NetworkMark = ({ network }: { network: WalletCardNetwork }) => {
  if (network === "mastercard") {
    return (
      <svg
        aria-hidden="true"
        className="h-6 w-10 shrink-0"
        fill="none"
        viewBox="0 0 40 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Mastercard</title>
        <circle cx="15" cy="12" fill="#eb001b" r="8.5" />
        <circle cx="25" cy="12" fill="#f79e1b" r="8.5" />
        <path
          d="M20 5.1a8.5 8.5 0 0 0 0 13.8 8.5 8.5 0 0 0 0-13.8Z"
          fill="#ff5f00"
        />
      </svg>
    );
  }

  if (network === "amex") {
    return (
      <span className="rounded-[3px] bg-white/90 px-1.5 py-0.5 font-bold text-[#2e77bc] text-[9px] uppercase tracking-[0.06em]">
        Amex
      </span>
    );
  }

  if (network === "visa") {
    return (
      <span className="font-bold text-[15px] text-white italic leading-none tracking-[-0.02em]">
        VISA
      </span>
    );
  }

  return (
    <svg
      aria-hidden="true"
      className="h-5 w-8 shrink-0 text-white/55"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      viewBox="0 0 32 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Card network</title>
      <rect height="13" rx="2.5" width="19" x="1" y="3.5" />
      <path d="M1 8h19" />
    </svg>
  );
};

const BalanceDisplay = ({
  currency,
  hidden,
  shouldReduceMotion,
  value,
}: {
  currency: string;
  hidden: boolean;
  shouldReduceMotion: boolean;
  value: number;
}) => {
  const formatter = new Intl.NumberFormat(undefined, {
    currency,
    style: "currency",
  });
  const formatted = formatter.format(value);
  // Keeping the currency symbol while masking the digits makes the hidden
  // state read as a deliberate choice rather than missing data.
  const symbol =
    formatter.formatToParts(value).find((part) => part.type === "currency")
      ?.value ?? "";
  const characters = hidden
    ? [...symbol.split(""), ...Array.from({ length: MASK_LENGTH }, () => "•")]
    : formatted.split("");

  return (
    <span
      aria-label={hidden ? "Balance hidden" : formatted}
      className={cn(
        "flex font-semibold text-[26px] text-white tabular-nums leading-none",
        hidden && "text-white/75 tracking-[0.06em]"
      )}
    >
      <AnimatePresence initial={false} mode="popLayout">
        {characters.map((char, index) => (
          <motion.span
            animate={{ filter: "blur(0px)", opacity: 1 }}
            aria-hidden="true"
            exit={
              shouldReduceMotion
                ? { opacity: 0, transition: { duration: 0 } }
                : { filter: `blur(${BLUR_AMOUNT}px)`, opacity: 0 }
            }
            initial={
              shouldReduceMotion
                ? { opacity: 1 }
                : { filter: `blur(${BLUR_AMOUNT}px)`, opacity: 0 }
            }
            key={`${hidden}-${index}-${char}`}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { ...SPRING_TRANSITION, delay: index * CHAR_STAGGER }
            }
          >
            {char}
          </motion.span>
        ))}
      </AnimatePresence>
    </span>
  );
};

interface AccountCardProps {
  account: WalletAccount;
  buttonRef: (node: HTMLButtonElement | null) => void;
  hidden: boolean;
  isActive: boolean;
  onSelect: () => void;
  rank: number;
  shouldReduceMotion: boolean;
  stackOffset: number;
  zIndex: number;
}

const AccountCard = ({
  account,
  buttonRef,
  hidden,
  isActive,
  onSelect,
  rank,
  shouldReduceMotion,
  stackOffset,
  zIndex,
}: AccountCardProps) => {
  const pointerX = useMotionValue(SHEEN_HOME_X);
  const pointerY = useMotionValue(SHEEN_HOME_Y);
  const sheenX = useSpring(pointerX, SHEEN_SPRING);
  const sheenY = useSpring(pointerY, SHEEN_SPRING);
  const sheen = useMotionTemplate`radial-gradient(120% 90% at ${sheenX}% ${sheenY}%, rgba(255,255,255,0.30), rgba(255,255,255,0.06) 45%, transparent 72%)`;
  const isHoverCapableRef = useRef(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    isHoverCapableRef.current = mediaQuery.matches;

    const handleChange = (event: MediaQueryListEvent) => {
      isHoverCapableRef.current = event.matches;
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (!isHoverCapableRef.current || shouldReduceMotion) {
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - rect.left) / rect.width) * PERCENT);
    pointerY.set(((event.clientY - rect.top) / rect.height) * PERCENT);
  };

  const handlePointerLeave = () => {
    pointerX.set(SHEEN_HOME_X);
    pointerY.set(SHEEN_HOME_Y);
  };

  const network = account.network ?? "generic";

  return (
    <motion.div
      animate={
        shouldReduceMotion
          ? { rotateX: 0, scale: 1, y: 0, z: 0 }
          : {
              rotateX: isActive ? 0 : RECEDE_ROTATE_X,
              scale: 1 - rank * STACK_SCALE_STEP,
              y: rank * stackOffset,
              z: isActive ? ACTIVE_LIFT_Z : 0,
            }
      }
      className="col-start-1 row-start-1"
      initial={false}
      // Presentational so the listbox still directly owns its options — the
      // motion layer must not sit in the accessibility tree between them.
      role="presentation"
      style={{ transformStyle: "preserve-3d", zIndex }}
      transition={shouldReduceMotion ? { duration: 0 } : LIFT_TRANSITION}
    >
      <button
        aria-selected={isActive}
        className={cn(
          "relative block aspect-[1.586] w-full cursor-pointer overflow-hidden rounded-[16px] text-left outline-none ring-offset-2 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring",
          account.gradient ?? DEFAULT_CARD_SURFACE,
          isActive
            ? "shadow-[0_2px_4px_rgba(0,0,0,0.10),0_14px_28px_-10px_rgba(0,0,0,0.34),0_34px_60px_-24px_rgba(0,0,0,0.40)]"
            : "shadow-[0_1px_2px_rgba(0,0,0,0.10),0_10px_20px_-10px_rgba(0,0,0,0.28)]"
        )}
        onClick={onSelect}
        onPointerLeave={handlePointerLeave}
        onPointerMove={handlePointerMove}
        ref={buttonRef}
        role="option"
        tabIndex={isActive ? 0 : -1}
        type="button"
      >
        {/* Printed grain. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-overlay"
          style={{ backgroundImage: NOISE_BACKGROUND }}
        />
        {/* Specular highlight that tracks the pointer. */}
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 mix-blend-soft-light"
          style={{ backgroundImage: sheen }}
        />
        {/* Bright top edge — light catching the card's lip. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[16px] ring-1 ring-white/12 ring-inset"
        />

        <span className="relative flex h-full w-full flex-col justify-between p-5">
          <span className="flex items-start justify-between gap-3">
            <span className="flex items-center gap-2.5">
              <EmvChip />
              <ContactlessGlyph />
            </span>
            <span className="font-medium text-[11px] text-white/70 tracking-[0.02em]">
              {account.label}
            </span>
          </span>

          <span className="block">
            <BalanceDisplay
              currency={account.currency}
              hidden={hidden}
              shouldReduceMotion={shouldReduceMotion}
              value={account.balance}
            />
          </span>

          <span className="block font-medium text-[15px] text-white/85 tabular-nums tracking-[0.14em]">
            &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull;
            &bull;&bull;&bull;&bull; {account.last4 ?? "••••"}
          </span>

          <span className="flex items-end justify-between gap-3">
            <span className="flex min-w-0 items-end gap-5">
              <span className="block min-w-0">
                <span className="block text-[8px] text-white/45 uppercase tracking-[0.14em]">
                  Card holder
                </span>
                <span className="block truncate font-medium text-[12px] text-white/90 uppercase tracking-[0.05em]">
                  {account.holder ?? "—"}
                </span>
              </span>
              <span className="block shrink-0">
                <span className="block text-[8px] text-white/45 uppercase tracking-[0.14em]">
                  Valid thru
                </span>
                <span className="block font-medium text-[12px] text-white/90 tabular-nums tracking-[0.05em]">
                  {account.expiry ?? "——/——"}
                </span>
              </span>
            </span>
            <NetworkMark network={network} />
          </span>
        </span>
      </button>
    </motion.div>
  );
};

export default function WalletCard({
  accounts,
  actions,
  activeId: controlledActiveId,
  className,
  hidden: controlledHidden,
  members = [],
  onActiveChange,
  onHiddenChange,
  stackOffset = STACK_OFFSET_DEFAULT,
}: WalletCardProps) {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const [internalActiveId, setInternalActiveId] = useState(accounts[0]?.id);
  const [internalHidden, setInternalHidden] = useState(false);
  const [overflowOpen, setOverflowOpen] = useState(false);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const activeId = controlledActiveId ?? internalActiveId;
  const hidden = controlledHidden ?? internalHidden;

  const setActiveId = (id: string) => {
    if (onActiveChange) {
      onActiveChange(id);
    } else {
      setInternalActiveId(id);
    }
  };

  const setHidden = (next: boolean) => {
    if (onHiddenChange) {
      onHiddenChange(next);
    } else {
      setInternalHidden(next);
    }
  };

  const activeIndex = accounts.findIndex((account) => account.id === activeId);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (accounts.length === 0) {
      return;
    }

    let nextIndex = activeIndex;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      nextIndex = (activeIndex + 1 + accounts.length) % accounts.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      nextIndex = (activeIndex - 1 + accounts.length) % accounts.length;
    } else {
      return;
    }

    const next = accounts[nextIndex];
    if (next) {
      setActiveId(next.id);
      optionRefs.current[nextIndex]?.focus();
    }
  };

  let rankCounter = 0;
  const visibleMembers = members.slice(0, AVATAR_OVERFLOW_THRESHOLD);
  const overflowMembers = members.slice(AVATAR_OVERFLOW_THRESHOLD);

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <div
        aria-label="Cards"
        className="relative grid"
        onKeyDown={handleKeyDown}
        role="listbox"
        style={{
          marginBottom: MAX_STACK_DEPTH * stackOffset,
          perspective: shouldReduceMotion ? undefined : PERSPECTIVE,
          transformStyle: "preserve-3d",
        }}
      >
        {accounts.map((account, index) => {
          const isActive = account.id === activeId;
          const rank = isActive ? 0 : ++rankCounter;
          const cappedRank = Math.min(rank, MAX_STACK_DEPTH);

          return (
            <AccountCard
              account={account}
              buttonRef={(node) => {
                optionRefs.current[index] = node;
              }}
              hidden={hidden}
              isActive={isActive}
              key={account.id}
              onSelect={() => setActiveId(account.id)}
              rank={cappedRank}
              shouldReduceMotion={shouldReduceMotion}
              stackOffset={stackOffset}
              zIndex={accounts.length - rank}
            />
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center">
          {visibleMembers.map((member, index) => (
            <div
              aria-label={member.name}
              className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-muted font-medium text-xs ring-2 ring-background"
              key={member.id}
              role="img"
              style={{
                marginLeft: index === 0 ? 0 : -AVATAR_OVERLAP,
                zIndex: visibleMembers.length - index,
              }}
            >
              {member.avatar ? (
                <img
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full object-cover"
                  src={member.avatar}
                />
              ) : (
                <span aria-hidden="true">{getInitials(member.name)}</span>
              )}
            </div>
          ))}
          {overflowMembers.length > 0 ? (
            <button
              aria-controls="wallet-card-overflow-list"
              aria-expanded={overflowOpen}
              aria-label={`Show ${overflowMembers.length} more members`}
              className="ease ml-1 flex h-8 min-w-[32px] cursor-pointer items-center justify-center rounded-full bg-secondary px-2 font-medium text-xs outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              onClick={() => setOverflowOpen((open) => !open)}
              type="button"
            >
              +{overflowMembers.length}
            </button>
          ) : null}
        </div>
        {actions}
      </div>

      <AnimatePresence>
        {overflowOpen && overflowMembers.length > 0 ? (
          <motion.ul
            animate={{ opacity: 1, y: 0 }}
            aria-label="Additional members"
            className="flex flex-col gap-1 rounded-lg border bg-background p-2 text-sm"
            exit={
              shouldReduceMotion
                ? { opacity: 0, transition: { duration: 0 } }
                : { opacity: 0, y: -4 }
            }
            id="wallet-card-overflow-list"
            initial={
              shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -4 }
            }
            transition={
              shouldReduceMotion ? { duration: 0 } : SPRING_TRANSITION
            }
          >
            {overflowMembers.map((member) => (
              <li key={member.id}>{member.name}</li>
            ))}
          </motion.ul>
        ) : null}
      </AnimatePresence>

      <SmoothButton
        aria-label={hidden ? "Show balance" : "Hide balance"}
        aria-pressed={hidden}
        className="w-fit"
        onClick={() => setHidden(!hidden)}
        prefix={
          hidden ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />
        }
        shape="pill"
        size="sm"
        variant="outline"
      >
        {hidden ? "Show balance" : "Hide balance"}
      </SmoothButton>
    </div>
  );
}
