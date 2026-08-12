"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import SmoothButton from "@repo/smoothui/components/smooth-button";
import { ArrowLeftRight, ChevronDown } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { useEffect, useId, useRef, useState } from "react";

const SPRING_TRANSITION = {
  bounce: 0.1,
  duration: 0.25,
  type: "spring" as const,
};
const SHIMMER_DURATION = 1.4;
const SHIMMER_EASE = [0, 0, 1, 1] as const;
const RING_SIZE = 20;
const RING_RADIUS = 8;
const RING_STROKE = 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const RING_TICK_MS = 100;

const decimalFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 6,
});
const percentFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
  style: "percent",
});

export interface SwapToken {
  balance?: number;
  icon?: ReactNode;
  name: string;
  symbol: string;
}

export interface SwapQuote {
  expiresAt?: number;
  fee?: number;
  output: number;
  priceImpact?: number;
  rate: number;
}

export type SwapStatus = "idle" | "quoting" | "ready" | "submitting" | "error";

export interface SwapPanelProps {
  amount: string;
  className?: string;
  error?: string;
  from: SwapToken;
  onAmountChange: (value: string) => void;
  onFlip: () => void;
  onSelectToken?: (side: "from" | "to") => void;
  onSubmit: () => void;
  quote?: SwapQuote;
  slippage?: number;
  status: SwapStatus;
  to: SwapToken;
}

const RollingFigure = ({
  shouldReduceMotion,
  value,
}: {
  shouldReduceMotion: boolean;
  value: string;
}) => (
  <span className="relative inline-flex overflow-hidden">
    <AnimatePresence initial={false} mode="popLayout">
      <motion.span
        animate={{ opacity: 1, y: 0 }}
        exit={
          shouldReduceMotion
            ? { opacity: 0, transition: { duration: 0 } }
            : { opacity: 0, y: -12 }
        }
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
        key={value}
        transition={shouldReduceMotion ? { duration: 0 } : SPRING_TRANSITION}
      >
        {value}
      </motion.span>
    </AnimatePresence>
  </span>
);

const CountdownRing = ({
  expiresAt,
  shouldReduceMotion,
}: {
  expiresAt: number;
  shouldReduceMotion: boolean;
}) => {
  const startRef = useRef(Date.now());
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    startRef.current = Date.now();
    setNow(Date.now());
    const interval = setInterval(() => setNow(Date.now()), RING_TICK_MS);
    return () => clearInterval(interval);
  }, [expiresAt]);

  const totalMs = expiresAt - startRef.current;
  const remainingMs = Math.max(expiresAt - now, 0);
  const fraction = totalMs > 0 ? remainingMs / totalMs : 0;
  // Exception to the transform/opacity-only rule: a radial countdown needs to animate
  // `stroke-dashoffset`, a paint-only SVG property with no reasonable transform equivalent.
  // This is the standard low-cost technique for progress rings.
  const dashOffset = RING_CIRCUMFERENCE * (1 - fraction);

  return (
    <svg
      aria-hidden="true"
      className="shrink-0"
      height={RING_SIZE}
      viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
      width={RING_SIZE}
    >
      <circle
        className="text-muted-foreground/20"
        cx={RING_SIZE / 2}
        cy={RING_SIZE / 2}
        fill="none"
        r={RING_RADIUS}
        stroke="currentColor"
        strokeWidth={RING_STROKE}
      />
      <circle
        className="text-brand"
        cx={RING_SIZE / 2}
        cy={RING_SIZE / 2}
        fill="none"
        r={RING_RADIUS}
        stroke="currentColor"
        strokeDasharray={RING_CIRCUMFERENCE}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        strokeWidth={RING_STROKE}
        style={{
          transform: "rotate(-90deg)",
          transformOrigin: "50% 50%",
          transition: shouldReduceMotion
            ? "none"
            : `stroke-dashoffset ${RING_TICK_MS}ms linear`,
        }}
      />
    </svg>
  );
};

const TokenChip = ({
  onSelect,
  side,
  token,
}: {
  onSelect?: () => void;
  side: "from" | "to";
  token: SwapToken;
}) => (
  <SmoothButton
    aria-label={`Change ${side === "from" ? "pay" : "receive"} token, currently ${token.symbol}`}
    className="shrink-0 text-foreground"
    onClick={onSelect}
    prefix={
      token.icon ?? (
        <span
          aria-hidden="true"
          className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground/10 font-semibold text-[10px] text-foreground"
        >
          {token.symbol.charAt(0)}
        </span>
      )
    }
    shape="pill"
    size="sm"
    suffix={
      <ChevronDown aria-hidden="true" className="text-muted-foreground" />
    }
    variant="secondary"
  >
    {token.symbol}
  </SmoothButton>
);

export default function SwapPanel({
  amount,
  className = "",
  error,
  from,
  onAmountChange,
  onFlip,
  onSelectToken,
  onSubmit,
  quote,
  slippage,
  status,
  to,
}: SwapPanelProps) {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const [flipped, setFlipped] = useState(false);
  const fromInputId = useId();
  const toLabelId = useId();

  const isBusy = status === "quoting" || status === "submitting";
  const outputFormatted = decimalFormatter.format(quote?.output ?? 0);

  const actionLabel =
    status === "submitting"
      ? "Swapping…"
      : status === "error"
        ? "Try again"
        : "Review swap";

  const handleFlip = () => {
    setFlipped((prev) => !prev);
    onFlip();
  };

  const rows: { side: "from" | "to"; token: SwapToken }[] = [
    { side: "from", token: from },
    { side: "to", token: to },
  ];

  return (
    <div
      className={cn(
        "w-full max-w-sm rounded-2xl border bg-background p-4",
        className
      )}
    >
      <div className="flex flex-col gap-2">
        {rows.map((row) => (
          <motion.div
            className="relative"
            key={row.token.symbol}
            layout={!shouldReduceMotion}
            transition={
              shouldReduceMotion ? { duration: 0 } : SPRING_TRANSITION
            }
          >
            {row.side === "from" ? (
              <div>
                <label
                  className="mb-1 block px-1 text-muted-foreground text-xs"
                  htmlFor={fromInputId}
                >
                  You pay
                </label>
                <div className="flex items-center justify-between gap-2 rounded-xl border bg-secondary/40 px-3 py-2">
                  <input
                    className="w-full min-w-0 bg-transparent font-semibold text-2xl outline-none placeholder:text-muted-foreground/40"
                    id={fromInputId}
                    inputMode="decimal"
                    onChange={(event) => onAmountChange(event.target.value)}
                    placeholder="0.0"
                    type="text"
                    value={amount}
                  />
                  <TokenChip
                    onSelect={() => onSelectToken?.("from")}
                    side="from"
                    token={from}
                  />
                </div>
                {typeof from.balance === "number" ? (
                  <div className="mt-1 flex items-center gap-2 px-1 text-muted-foreground text-xs">
                    <span>Balance {decimalFormatter.format(from.balance)}</span>
                    <button
                      className="rounded font-medium text-foreground underline decoration-foreground/30 underline-offset-2 transition-colors hover:decoration-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      onClick={() => onAmountChange(String(from.balance))}
                      type="button"
                    >
                      Max
                    </button>
                  </div>
                ) : null}
              </div>
            ) : (
              <div>
                <span
                  className="mb-1 block px-1 text-muted-foreground text-xs"
                  id={toLabelId}
                >
                  You receive
                </span>
                <div className="relative flex items-center justify-between gap-2 overflow-hidden rounded-xl border bg-secondary/40 px-3 py-2">
                  {status === "quoting" &&
                    (shouldReduceMotion ? (
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-muted-foreground/10"
                      />
                    ) : (
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 overflow-hidden"
                      >
                        <motion.div
                          animate={{ x: ["-100%", "220%"] }}
                          className="h-full w-1/3 bg-gradient-to-r from-transparent via-foreground/10 to-transparent"
                          transition={{
                            duration: SHIMMER_DURATION,
                            ease: SHIMMER_EASE,
                            repeat: Number.POSITIVE_INFINITY,
                          }}
                        />
                      </div>
                    ))}
                  <div
                    aria-labelledby={toLabelId}
                    aria-live="polite"
                    className="relative min-h-8 flex-1 font-semibold text-2xl"
                  >
                    <RollingFigure
                      shouldReduceMotion={shouldReduceMotion}
                      value={outputFormatted}
                    />
                  </div>
                  <TokenChip
                    onSelect={() => onSelectToken?.("to")}
                    side="to"
                    token={to}
                  />
                </div>
              </div>
            )}
          </motion.div>
        ))}

        <div className="flex justify-center">
          <SmoothButton
            aria-label="Flip pay and receive tokens"
            className="z-10 -my-4"
            onClick={handleFlip}
            shape="pill"
            size="icon-sm"
            variant="outline"
          >
            {/* The rotation rides the icon, not the button: the frame is a
                circle, so spinning it only ever moved its shadow. */}
            <motion.span
              animate={{ rotate: flipped ? 180 : 0 }}
              className="flex"
              transition={
                shouldReduceMotion ? { duration: 0 } : SPRING_TRANSITION
              }
            >
              <ArrowLeftRight aria-hidden="true" />
            </motion.span>
          </SmoothButton>
        </div>
      </div>

      {quote ? (
        <div className="mt-3 flex flex-wrap items-center gap-2 px-1 text-muted-foreground text-xs">
          {quote.expiresAt ? (
            <CountdownRing
              expiresAt={quote.expiresAt}
              shouldReduceMotion={shouldReduceMotion}
            />
          ) : null}
          <span>
            1 {from.symbol} = {decimalFormatter.format(quote.rate)} {to.symbol}
          </span>
          {typeof quote.fee === "number" ? (
            <span>
              Fee {decimalFormatter.format(quote.fee)} {to.symbol}
            </span>
          ) : null}
          {typeof quote.priceImpact === "number" ? (
            <span>Impact {percentFormatter.format(quote.priceImpact)}</span>
          ) : null}
          {typeof slippage === "number" ? (
            <span>Max slippage {percentFormatter.format(slippage)}</span>
          ) : null}
        </div>
      ) : null}

      {error ? (
        <p className="mt-2 px-1 text-destructive text-xs" role="alert">
          {error}
        </p>
      ) : null}

      <SmoothButton
        className="mt-3 w-full rounded-xl font-semibold"
        disabled={isBusy}
        loading={status === "submitting"}
        onClick={onSubmit}
        // `candy` is the house primary, matching the CTA and footer blocks.
        variant="candy"
      >
        {actionLabel}
      </SmoothButton>
    </div>
  );
}
