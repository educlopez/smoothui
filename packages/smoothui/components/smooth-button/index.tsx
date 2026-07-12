"use client";

import { Slot } from "@radix-ui/react-slot";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";
import { useEffect, useRef } from "react";

/**
 * SmoothButton — the first primitive of the SmoothUI Design System.
 *
 * Three orthogonal axes (see design-system/components/button.md):
 *   variant → appearance only (solid | soft | outline | ghost | link | candy)
 *   color   → hue (accent | neutral | destructive | blue | amber | green)
 *   size    → xs | sm | default | lg + icon-*
 *
 * The `color` axis only sets CSS custom props (--btn, --btn-hover, --btn-fg);
 * each `variant` consumes them generically, so 6 variants × 6 colors stay 12
 * class strings, not 36. When no `color` is given, CSS var fallbacks apply
 * (candy → brand, everything else → neutral/foreground).
 *
 * Legacy variants `default` / `secondary` / `destructive` are preserved verbatim
 * for back-compat with existing call sites and ignore the `color` axis.
 */
const smoothButtonVariants = cva(
  "relative inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap font-medium outline-none ring-offset-background transition-[transform,background-color,border-color,color,box-shadow] duration-150 ease-out focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none motion-reduce:active:scale-100 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // --- new decoupled system (consume --btn / --btn-hover / --btn-fg) ---
        solid:
          "bg-[var(--btn,var(--color-foreground))] text-[var(--btn-fg,var(--color-background))] shadow-xs hover:bg-[var(--btn-hover,var(--color-smooth-900))]",
        soft: "bg-[color-mix(in_oklab,var(--btn,var(--color-foreground))_12%,transparent)] text-[var(--btn,var(--color-foreground))] hover:bg-[color-mix(in_oklab,var(--btn,var(--color-foreground))_18%,transparent)]",
        outline:
          "border border-transparent bg-background text-[var(--btn,var(--color-foreground))] shadow-black/15 shadow-sm ring-1 ring-foreground/10 hover:bg-primary dark:ring-foreground/15",
        ghost:
          "text-[var(--btn,var(--color-foreground))] hover:bg-[color-mix(in_oklab,var(--btn,var(--color-foreground))_10%,transparent)]",
        link: "text-[var(--btn,var(--color-foreground))] underline-offset-4 hover:underline",
        candy:
          "border-[0.5px] border-white/25 bg-gradient-to-b from-[var(--btn,var(--color-brand))] to-[var(--btn-hover,var(--color-brand-secondary))] text-[var(--btn-fg,#fff)] text-shadow-sm shadow-black/20 shadow-md ring-1 ring-[color-mix(in_oklab,var(--color-foreground)_15%,var(--btn,var(--color-brand)))] hover:from-[var(--btn-hover,var(--color-brand-secondary))] hover:to-[var(--btn-hover,var(--color-brand-secondary))] [&_svg]:drop-shadow-sm",
        // --- legacy (preserved verbatim, ignore `color`) ---
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        destructive:
          "bg-gradient-to-b from-[#FD4B4E] to-destructive text-shadow-sm text-white shadow-[0px_1px_2px_rgba(0,0,0,0.4),0px_0px_0px_1px_#F61418,inset_0px_0.75px_0px_rgba(255,255,255,0.2)] hover:from-destructive hover:to-destructive",
      },
      color: {
        accent:
          "[--btn-fg:#fff] [--btn-hover:var(--color-brand-secondary)] [--btn:var(--color-brand)]",
        neutral:
          "[--btn-fg:var(--color-background)] [--btn-hover:var(--color-smooth-900)] [--btn:var(--color-foreground)]",
        destructive:
          "[--btn-fg:#fff] [--btn-hover:color-mix(in_oklab,var(--color-destructive)_85%,black)] [--btn:var(--color-destructive)]",
        blue: "[--btn-fg:var(--color-blue-fg)] [--btn-hover:var(--color-blue-hover)] [--btn:var(--color-blue)]",
        amber:
          "[--btn-fg:var(--color-amber-fg)] [--btn-hover:var(--color-amber-hover)] [--btn:var(--color-amber)]",
        green:
          "[--btn-fg:var(--color-green-fg)] [--btn-hover:var(--color-green-hover)] [--btn:var(--color-green)]",
      },
      size: {
        xs: "h-7 gap-1.5 rounded-sm px-2.5 text-xs [&_svg]:size-3.5",
        sm: "h-9 gap-1.5 rounded-md px-3 text-sm [&_svg]:size-4",
        default: "h-10 gap-2 rounded-md px-4 py-2 text-sm [&_svg]:size-4",
        lg: "h-11 gap-2 rounded-lg px-8 text-base [&_svg]:size-5",
        icon: "size-10 rounded-md [&_svg]:size-4",
        "icon-sm": "size-9 rounded-md [&_svg]:size-4",
        "icon-lg": "size-11 rounded-lg [&_svg]:size-5",
      },
      shape: {
        default: "",
        square: "rounded-none!",
        pill: "rounded-full!",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "default",
    },
  }
);

export type SmoothButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "prefix" | "color"
> &
  VariantProps<typeof smoothButtonVariants> & {
    asChild?: boolean;
    /** Show a spinner that morphs the button width without layout jump. */
    loading?: boolean;
    /** Content before the label (icon, Kbd…). */
    prefix?: ReactNode;
    /** Content after the label. */
    suffix?: ReactNode;
    /** Opt-in Safari force-press depth (scales to 0.94 under pressure). */
    forcePress?: boolean;
    ref?: Ref<HTMLButtonElement>;
  };

const Spinner = () => (
  <svg
    aria-hidden="true"
    className="size-[1em] animate-spin"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="3"
    />
    <path
      className="opacity-90"
      d="M12 2a10 10 0 0 1 10 10"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="3"
    />
  </svg>
);

function SmoothButton({
  className,
  variant,
  color,
  size,
  shape,
  asChild = false,
  loading = false,
  forcePress = false,
  prefix,
  suffix,
  disabled,
  children,
  ref,
  ...props
}: SmoothButtonProps) {
  const shouldReduceMotion = useReducedMotion();
  const localRef = useRef<HTMLButtonElement>(null);

  // Safari-only force-press: deepen the press past the normal active scale.
  useEffect(() => {
    const node = localRef.current;
    if (!(forcePress && node) || shouldReduceMotion) {
      return;
    }
    const FORCE_THRESHOLD = 2; // Safari's "force click" boundary
    const onForce = (e: Event) => {
      const force = (e as Event & { webkitForce?: number }).webkitForce ?? 0;
      node.style.transform = force >= FORCE_THRESHOLD ? "scale(0.94)" : "";
    };
    const reset = () => {
      node.style.transform = "";
    };
    node.addEventListener("webkitmouseforcechanged", onForce);
    node.addEventListener("mouseup", reset);
    node.addEventListener("mouseleave", reset);
    return () => {
      node.removeEventListener("webkitmouseforcechanged", onForce);
      node.removeEventListener("mouseup", reset);
      node.removeEventListener("mouseleave", reset);
    };
  }, [forcePress, shouldReduceMotion]);

  const classes = cn(
    smoothButtonVariants({ variant, color, size, shape, className })
  );

  // asChild defers all rendering to the consumer's element — slots/loading
  // are not injected (single-child contract of Radix Slot).
  if (asChild) {
    return (
      <Slot className={classes} ref={ref} {...props}>
        {children}
      </Slot>
    );
  }

  const setRefs = (node: HTMLButtonElement | null) => {
    localRef.current = node;
    if (typeof ref === "function") {
      ref(node);
    } else if (ref) {
      (ref as { current: HTMLButtonElement | null }).current = node;
    }
  };

  return (
    <button
      aria-busy={loading || undefined}
      className={classes}
      disabled={disabled || loading}
      ref={setRefs}
      type={props.type ?? "button"}
      {...props}
    >
      <AnimatePresence initial={false}>
        {loading && (
          <motion.span
            animate={{ width: "1em", opacity: 1, marginRight: "0.5rem" }}
            className="inline-flex shrink-0 items-center justify-center overflow-hidden"
            exit={{ width: 0, opacity: 0, marginRight: 0 }}
            initial={
              shouldReduceMotion
                ? { width: "1em", opacity: 1, marginRight: "0.5rem" }
                : { width: 0, opacity: 0, marginRight: 0 }
            }
            key="spinner"
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { type: "spring", duration: 0.25, bounce: 0.1 }
            }
          >
            <Spinner />
          </motion.span>
        )}
      </AnimatePresence>
      {prefix}
      {children}
      {suffix}
    </button>
  );
}

export default SmoothButton;
export { smoothButtonVariants };
