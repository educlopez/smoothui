"use client";

import { cn } from "@repo/smoothui-utils";
import { cva, type VariantProps } from "class-variance-authority";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  type ButtonHTMLAttributes,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
  type Ref,
  useEffect,
  useRef,
} from "react";

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
  "relative inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap font-medium outline-none ring-offset-background transition-[transform,background-color,border-color,color,box-shadow] duration-150 ease-out focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.97] disabled:pointer-events-none disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none disabled:ring-1 disabled:ring-foreground/20 motion-reduce:transition-none motion-reduce:active:scale-100 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    defaultVariants: {
      shape: "default",
      size: "default",
      variant: "default",
    },
    variants: {
      color: {
        accent:
          "[--btn-fg:var(--color-on-brand)] [--btn-hover:var(--color-brand-secondary)] [--btn:var(--color-brand)]",
        amber:
          "[--btn-fg:var(--color-amber-fg)] [--btn-hover:var(--color-amber-hover)] [--btn:var(--color-amber)]",
        blue: "[--btn-fg:var(--color-blue-fg)] [--btn-hover:var(--color-blue-hover)] [--btn:var(--color-blue)]",
        destructive:
          "[--btn-fg:var(--color-destructive-fg)] [--btn-hover:var(--color-destructive-hover)] [--btn:var(--color-destructive)]",
        green:
          "[--btn-fg:var(--color-green-fg)] [--btn-hover:var(--color-green-hover)] [--btn:var(--color-green)]",
        neutral:
          "[--btn-fg:var(--color-background)] [--btn-hover:var(--color-smooth-900)] [--btn:var(--color-foreground)]",
      },
      shape: {
        default: "",
        pill: "rounded-full!",
        square: "rounded-none!",
      },
      size: {
        default: "h-10 gap-2 rounded-md px-4 py-2 text-sm [&_svg]:size-4",
        icon: "size-10 rounded-md [&_svg]:size-4",
        "icon-lg": "size-11 rounded-lg [&_svg]:size-5",
        "icon-sm": "hit-area size-9 rounded-md [&_svg]:size-4",
        lg: "h-11 gap-2 rounded-lg px-8 text-base [&_svg]:size-5",
        sm: "hit-area h-9 gap-1.5 rounded-md px-3 text-sm [&_svg]:size-4",
        xs: "hit-area h-7 gap-1.5 rounded-sm px-2.5 text-xs [&_svg]:size-3.5",
      },
      variant: {
        candy:
          "border-[0.5px] border-on-brand/25 bg-gradient-to-b from-[var(--btn,var(--color-brand))] to-[var(--btn-hover,var(--color-brand-secondary))] text-[var(--btn-fg,var(--color-on-brand))] text-shadow-sm shadow-black/20 shadow-md ring-1 ring-[color-mix(in_oklab,var(--color-foreground)_15%,var(--btn,var(--color-brand)))] hover:from-[var(--btn-hover,var(--color-brand-secondary))] hover:to-[var(--btn-hover,var(--color-brand-secondary))] [&_svg]:drop-shadow-sm",
        // --- legacy (preserved verbatim, ignore `color`) ---
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-gradient-to-b from-destructive-top to-destructive text-destructive-fg text-shadow-sm shadow-[0px_1px_2px_var(--color-btn-drop),0px_0px_0px_1px_var(--color-destructive-edge),inset_0px_0.75px_0px_var(--color-btn-sheen)] hover:from-destructive hover:to-destructive",
        ghost:
          "text-[var(--btn,var(--color-foreground))] hover:bg-[color-mix(in_oklab,var(--btn,var(--color-foreground))_10%,transparent)]",
        link: "text-[var(--btn,var(--color-foreground))] underline-offset-4 hover:underline",
        outline:
          "border border-transparent bg-background text-[var(--btn,var(--color-foreground))] shadow-black/15 shadow-sm ring-1 ring-foreground/10 hover:bg-primary dark:ring-foreground/15",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        soft: "bg-[color-mix(in_oklab,var(--btn,var(--color-foreground))_12%,transparent)] text-[var(--btn,var(--color-foreground))] hover:bg-[color-mix(in_oklab,var(--btn,var(--color-foreground))_18%,transparent)]",
        // --- new decoupled system (consume --btn / --btn-hover / --btn-fg) ---
        solid:
          "bg-[var(--btn,var(--color-foreground))] text-[var(--btn-fg,var(--color-background))] shadow-xs hover:bg-[var(--btn-hover,var(--color-smooth-900))]",
      },
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

const mergeRefs =
  <T,>(...refs: (Ref<T> | undefined)[]) =>
  (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        (ref as { current: T | null }).current = node;
      }
    }
  };

/**
 * SmoothUI SmoothButton — Base UI twin (default).
 * Same visuals/variants as the Radix twin; `asChild` via cloneElement (no Slot).
 */
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
    smoothButtonVariants({ className, color, shape, size, variant })
  );
  const variantName = variant ?? "default";

  // asChild defers all rendering to the consumer's element — slots/loading
  // are not injected (single-child contract, Slot-compatible).
  if (asChild) {
    if (!isValidElement(children)) {
      return null;
    }
    const child = children as ReactElement<{
      className?: string;
      ref?: Ref<HTMLButtonElement>;
    }>;
    return cloneElement(child, {
      ...props,
      className: cn(classes, child.props.className),
      "data-variant": variantName,
      ref: mergeRefs(ref, child.props.ref, localRef),
    } as never);
  }

  const setRefs = mergeRefs(ref, localRef);

  return (
    <button
      aria-busy={loading || undefined}
      className={classes}
      data-variant={variantName}
      disabled={disabled || loading}
      ref={setRefs}
      type={props.type ?? "button"}
      {...props}
    >
      <AnimatePresence initial={false}>
        {loading ? (
          <motion.span
            animate={{ marginRight: "0.5rem", opacity: 1, width: "1em" }}
            className="inline-flex shrink-0 items-center justify-center overflow-hidden"
            exit={{ marginRight: 0, opacity: 0, width: 0 }}
            initial={
              shouldReduceMotion
                ? { marginRight: "0.5rem", opacity: 1, width: "1em" }
                : { marginRight: 0, opacity: 0, width: 0 }
            }
            key="spinner"
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { bounce: 0.1, duration: 0.25, type: "spring" }
            }
          >
            <Spinner />
          </motion.span>
        ) : null}
      </AnimatePresence>
      {prefix}
      {children}
      {suffix}
    </button>
  );
}

export default SmoothButton;
export { smoothButtonVariants };
