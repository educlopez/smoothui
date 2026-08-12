"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import type { LucideIcon } from "lucide-react";
import { Monitor, Moon, Sun } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

export const THEME_TOGGLE_VARIANTS = [
  "sun-moon",
  "pill",
  "switch",
  "orb",
] as const;

export type ThemeToggleVariant = (typeof THEME_TOGGLE_VARIANTS)[number];
export type ThemeToggleValue = "light" | "dark" | "system";

export type ThemeToggleProps = {
  /** Additional CSS classes */
  className?: string;
  /** Default theme for uncontrolled usage */
  defaultTheme?: ThemeToggleValue;
  /** Accessible label describing the control */
  label?: string;
  /** Called whenever the chosen theme changes */
  onThemeChange?: (theme: ThemeToggleValue) => void;
  /** Whether to include a third "system" option */
  showSystem?: boolean;
  /** Size of the control */
  size?: "sm" | "md" | "lg";
  /** Controlled theme value */
  theme?: ThemeToggleValue;
  /** Visual treatment of the control */
  variant?: ThemeToggleVariant;
};

/* -------------------------------------------------------------------------- */
/* Motion tokens                                                              */
/* -------------------------------------------------------------------------- */

const SPRING = { bounce: 0.1, duration: 0.25, type: "spring" as const };
const MORPH_SPRING = { bounce: 0.1, duration: 0.35, type: "spring" as const };
const KNOB_SPRING = { bounce: 0.1, duration: 0.3, type: "spring" as const };
const INSTANT = { duration: 0 };
const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];
const FADE = { duration: 0.3, ease: EASE_OUT };
const TRAVEL = { duration: 0.4, ease: EASE_OUT };

/* -------------------------------------------------------------------------- */
/* Sizing                                                                     */
/* -------------------------------------------------------------------------- */

type SizeConfig = {
  glyph: number;
  icon: string;
  knob: number;
  orb: number;
  pad: number;
  segment: string;
  text: string;
};

const SIZES: Record<"sm" | "md" | "lg", SizeConfig> = {
  lg: {
    glyph: 74,
    icon: "size-5",
    knob: 44,
    orb: 104,
    pad: 5,
    segment: "h-11 px-5",
    text: "text-sm",
  },
  md: {
    glyph: 58,
    icon: "size-4",
    knob: 34,
    orb: 82,
    pad: 4,
    segment: "h-10 px-4",
    text: "text-sm",
  },
  sm: {
    glyph: 42,
    icon: "size-3.5",
    knob: 26,
    orb: 58,
    pad: 3,
    segment: "h-8 px-3",
    text: "text-xs",
  },
};

type OptionEntry = {
  icon: LucideIcon;
  label: string;
  value: ThemeToggleValue;
};

const THEME_OPTIONS: OptionEntry[] = [
  { icon: Sun, label: "Light", value: "light" },
  { icon: Moon, label: "Dark", value: "dark" },
  { icon: Monitor, label: "System", value: "system" },
];

/* -------------------------------------------------------------------------- */
/* Variant 1 — sun-moon: a single disc carved by a travelling mask circle      */
/* -------------------------------------------------------------------------- */

const VIEWBOX = 24;
const CENTER = 12;
const RAY_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];
const RAY_INNER = 7.3;
const RAY_OUTER = 10.3;
const RAY_STAGGER = 0.025;
const RAY_WIDTH = 1.7;
const GLOW_RADIUS = 9.6;
const RAY_RETRACTED_SCALE = 0.12;

/** Where the carving circle sits: off-canvas (sun), overlapping (crescent), or a
 *  huge disc whose left edge lands exactly on the centre line (half-lit system). */
const MASK_STATE: Record<
  ThemeToggleValue,
  { cx: number; cy: number; r: number }
> = {
  dark: { cx: 17.6, cy: 8, r: 8.6 },
  light: { cx: 38, cy: 4, r: 9 },
  system: { cx: 52, cy: 12, r: 40 },
};

const DISC_RADIUS: Record<ThemeToggleValue, number> = {
  dark: 8.2,
  light: 5,
  system: 7,
};

const RAY_ROTATION: Record<ThemeToggleValue, number> = {
  dark: 60,
  light: 0,
  system: 30,
};

const GLOW_OPACITY: Record<ThemeToggleValue, number> = {
  dark: 0.16,
  light: 0.5,
  system: 0.28,
};

const GLYPH_COLOR: Record<ThemeToggleValue, string> = {
  dark: "text-indigo-400",
  light: "text-amber-500",
  system: "text-foreground",
};

const rayTarget = (angle: number, value: ThemeToggleValue) => {
  if (value === "light") {
    return { opacity: 1, scale: 1 };
  }
  if (value === "dark") {
    return { opacity: 0, scale: RAY_RETRACTED_SCALE };
  }
  // "system" keeps only the rays on the lit half of the disc.
  const isLit = angle > 90 && angle < 270;
  return {
    opacity: isLit ? 1 : 0,
    scale: isLit ? 1 : RAY_RETRACTED_SCALE,
  };
};

type SunMoonGlyphProps = {
  canAnimate: boolean;
  maskId: string;
  size: number;
  value: ThemeToggleValue;
};

const SunMoonGlyph = ({
  canAnimate,
  maskId,
  size,
  value,
}: SunMoonGlyphProps) => {
  const mask = MASK_STATE[value];
  const morph = canAnimate ? MORPH_SPRING : INSTANT;

  return (
    <svg
      aria-hidden="true"
      className={cn("transition-colors duration-300", GLYPH_COLOR[value])}
      height={size}
      viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
      width={size}
    >
      <mask id={maskId}>
        <rect fill="white" height={VIEWBOX} width={VIEWBOX} x={0} y={0} />
        <motion.circle
          animate={mask}
          cx={mask.cx}
          cy={mask.cy}
          fill="black"
          initial={false}
          r={mask.r}
          transition={morph}
        />
      </mask>

      <motion.circle
        animate={{ opacity: GLOW_OPACITY[value] }}
        cx={CENTER}
        cy={CENTER}
        fill="currentColor"
        initial={false}
        r={GLOW_RADIUS}
        style={{ filter: "blur(4px)" }}
        transition={canAnimate ? FADE : INSTANT}
      />

      <motion.circle
        animate={{ r: DISC_RADIUS[value] }}
        cx={CENTER}
        cy={CENTER}
        fill="currentColor"
        initial={false}
        mask={`url(#${maskId})`}
        r={DISC_RADIUS[value]}
        transition={morph}
      />

      <motion.g
        animate={{ rotate: RAY_ROTATION[value] }}
        initial={false}
        style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}
        transition={morph}
      >
        {RAY_ANGLES.map((angle, index) => {
          const radians = (angle * Math.PI) / 180;
          return (
            <motion.line
              animate={rayTarget(angle, value)}
              initial={false}
              key={angle}
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth={RAY_WIDTH}
              style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}
              transition={
                canAnimate ? { ...SPRING, delay: index * RAY_STAGGER } : INSTANT
              }
              x1={CENTER + Math.cos(radians) * RAY_INNER}
              x2={CENTER + Math.cos(radians) * RAY_OUTER}
              y1={CENTER + Math.sin(radians) * RAY_INNER}
              y2={CENTER + Math.sin(radians) * RAY_OUTER}
            />
          );
        })}
      </motion.g>
    </svg>
  );
};

/* -------------------------------------------------------------------------- */
/* Variant 2 — pill: segmented control with a shared-layout thumb              */
/* -------------------------------------------------------------------------- */

const ACTIVE_ICON_COLOR: Record<ThemeToggleValue, string> = {
  dark: "text-indigo-400",
  light: "text-amber-500",
  system: "text-foreground",
};

type PillToggleProps = {
  canAnimate: boolean;
  groupLabel: string;
  iconClassName: string;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>, index: number) => void;
  onSelect: (value: ThemeToggleValue) => void;
  options: OptionEntry[];
  registerRef: (index: number, el: HTMLButtonElement | null) => void;
  segmentClassName: string;
  selectedIndex: number;
  textClassName: string;
  thumbId: string;
};

const PillToggle = ({
  canAnimate,
  groupLabel,
  iconClassName,
  onKeyDown,
  onSelect,
  options,
  registerRef,
  segmentClassName,
  selectedIndex,
  textClassName,
  thumbId,
}: PillToggleProps) => (
  <div
    aria-label={groupLabel}
    className="relative inline-flex items-center gap-1 rounded-full border border-border bg-muted p-1 shadow-[inset_0_1px_3px_rgba(0,0,0,0.08)]"
    role="radiogroup"
  >
    {options.map((option, index) => {
      const active = index === selectedIndex;
      const Icon = option.icon;
      return (
        <button
          aria-checked={active}
          className={cn(
            "relative flex cursor-pointer items-center justify-center gap-2 rounded-full font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            active
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground/70",
            segmentClassName,
            textClassName
          )}
          key={option.value}
          onClick={() => onSelect(option.value)}
          onKeyDown={(event) => onKeyDown(event, index)}
          ref={(el) => {
            registerRef(index, el);
          }}
          role="radio"
          tabIndex={active ? 0 : -1}
          type="button"
        >
          {active ? (
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 rounded-full bg-background shadow-[0_1px_2px_rgba(0,0,0,0.16),0_8px_18px_-8px_rgba(0,0,0,0.45)] ring-1 ring-foreground/10"
              layoutId={thumbId}
              transition={canAnimate ? SPRING : INSTANT}
            />
          ) : null}
          <Icon
            className={cn(
              "relative z-10 transition-colors duration-200",
              iconClassName,
              active ? ACTIVE_ICON_COLOR[option.value] : ""
            )}
          />
          <span className="relative z-10">{option.label}</span>
        </button>
      );
    })}
  </div>
);

/* -------------------------------------------------------------------------- */
/* Variant 3 — switch: sky-to-night track with a lit knob                      */
/* -------------------------------------------------------------------------- */

const TRACK_LAYERS: Record<ThemeToggleValue, string> = {
  dark: "linear-gradient(180deg,#1e293b 0%,#0f172a 55%,#020617 100%)",
  light: "linear-gradient(180deg,#7dd3fc 0%,#38bdf8 55%,#0284c7 100%)",
  system:
    "linear-gradient(100deg,#38bdf8 0%,#38bdf8 34%,#1e293b 64%,#020617 100%)",
};

const TRACK_LAYER_ORDER: ThemeToggleValue[] = ["light", "dark", "system"];

const STAR_POSITIONS = [
  { left: 0.14, size: 2, top: 0.26 },
  { left: 0.29, size: 1.5, top: 0.64 },
  { left: 0.45, size: 2.5, top: 0.2 },
  { left: 0.58, size: 1.5, top: 0.72 },
  { left: 0.72, size: 2, top: 0.36 },
  { left: 0.86, size: 1.5, top: 0.58 },
];

const KNOB_ICON: Record<ThemeToggleValue, LucideIcon> = {
  dark: Moon,
  light: Sun,
  system: Monitor,
};

const KNOB_ICON_COLOR: Record<ThemeToggleValue, string> = {
  dark: "text-slate-700",
  light: "text-amber-500",
  system: "text-slate-600",
};

const starOpacityFor = (value: ThemeToggleValue) => {
  if (value === "dark") {
    return 1;
  }
  return value === "system" ? 0.55 : 0;
};

type SwitchVisualProps = {
  canAnimate: boolean;
  iconClassName: string;
  index: number;
  knob: number;
  pad: number;
  trackHeight: number;
  trackWidth: number;
  value: ThemeToggleValue;
};

const SwitchVisual = ({
  canAnimate,
  iconClassName,
  index,
  knob,
  pad,
  trackHeight,
  trackWidth,
  value,
}: SwitchVisualProps) => {
  const Icon = KNOB_ICON[value];
  const starOpacity = starOpacityFor(value);

  return (
    <span
      aria-hidden="true"
      className="relative block overflow-hidden rounded-full"
      style={{ height: trackHeight, width: trackWidth }}
    >
      {TRACK_LAYER_ORDER.map((layer) => (
        <motion.span
          animate={{ opacity: layer === value ? 1 : 0 }}
          className="absolute inset-0"
          initial={false}
          key={layer}
          style={{ background: TRACK_LAYERS[layer] }}
          transition={canAnimate ? FADE : INSTANT}
        />
      ))}

      {STAR_POSITIONS.map((star, starIndex) => (
        <motion.span
          animate={{ opacity: starOpacity, scale: starOpacity > 0 ? 1 : 0.4 }}
          className="absolute rounded-full bg-white"
          initial={false}
          key={`${star.left}-${star.top}`}
          style={{
            height: star.size,
            left: star.left * trackWidth,
            top: star.top * trackHeight,
            width: star.size,
          }}
          transition={
            canAnimate ? { ...SPRING, delay: starIndex * RAY_STAGGER } : INSTANT
          }
        />
      ))}

      <span className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_2px_6px_rgba(0,0,0,0.5),inset_0_-1px_0_rgba(255,255,255,0.2)]" />

      <motion.span
        animate={{ x: index * knob }}
        className="absolute flex items-center justify-center rounded-full bg-gradient-to-b from-white to-slate-200 shadow-[0_3px_8px_rgba(0,0,0,0.4),inset_0_-2px_4px_rgba(0,0,0,0.12),inset_0_2px_3px_rgba(255,255,255,0.95)]"
        initial={false}
        style={{ height: knob, left: pad, top: pad, width: knob }}
        transition={canAnimate ? KNOB_SPRING : INSTANT}
      >
        <span className="pointer-events-none absolute top-[12%] left-[18%] h-1/4 w-1/3 rounded-full bg-white/95 blur-[2px]" />
        <AnimatePresence initial={false} mode="wait">
          <motion.span
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            className="relative"
            exit={
              canAnimate
                ? { opacity: 0, rotate: -120, scale: 0.4 }
                : { opacity: 0, transition: INSTANT }
            }
            initial={
              canAnimate ? { opacity: 0, rotate: 120, scale: 0.4 } : false
            }
            key={value}
            transition={canAnimate ? SPRING : INSTANT}
          >
            <Icon className={cn(iconClassName, KNOB_ICON_COLOR[value])} />
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </span>
  );
};

/* -------------------------------------------------------------------------- */
/* Variant 4 — orb: a lit sphere with a travelling specular and a cast bloom    */
/* -------------------------------------------------------------------------- */

const ORB_BODY: Record<ThemeToggleValue, string> = {
  dark: "radial-gradient(circle at 32% 26%, #a8b6cd 0%, #64748b 20%, #334155 52%, #0f172a 82%, #020617 100%)",
  light:
    "radial-gradient(circle at 34% 28%, #fffbeb 0%, #fde68a 24%, #fbbf24 54%, #ea580c 86%, #9a3412 100%)",
  system:
    "radial-gradient(circle at 50% 24%, #fef3c7 0%, #fbbf24 30%, #64748b 56%, #1e293b 84%, #020617 100%)",
};

const ORB_LAYER_ORDER: ThemeToggleValue[] = ["light", "dark", "system"];

const ORB_BLOOM: Record<ThemeToggleValue, string> = {
  dark: "#4f46e5",
  light: "#f59e0b",
  system: "#7c8aa5",
};

const ORB_BLOOM_OPACITY: Record<ThemeToggleValue, number> = {
  dark: 0.5,
  light: 0.62,
  system: 0.36,
};

const SPECULAR: Record<
  ThemeToggleValue,
  { opacity: number; x: number; y: number }
> = {
  dark: { opacity: 0.3, x: 0.58, y: 0.2 },
  light: { opacity: 0.92, x: 0.17, y: 0.11 },
  system: { opacity: 0.62, x: 0.38, y: 0.09 },
};

const CRATERS = [
  { left: 0.5, size: 0.2, top: 0.3 },
  { left: 0.28, size: 0.13, top: 0.58 },
  { left: 0.6, size: 0.1, top: 0.66 },
];

type OrbVisualProps = {
  canAnimate: boolean;
  size: number;
  value: ThemeToggleValue;
};

const OrbVisual = ({ canAnimate, size, value }: OrbVisualProps) => {
  const specular = SPECULAR[value];
  const travel = canAnimate ? TRAVEL : INSTANT;

  return (
    <span
      aria-hidden="true"
      className="pointer-events-none relative block"
      style={{ height: size, width: size }}
    >
      <motion.span
        animate={{
          backgroundColor: ORB_BLOOM[value],
          opacity: ORB_BLOOM_OPACITY[value],
        }}
        className="absolute left-1/2 rounded-[50%]"
        initial={false}
        style={{
          bottom: -size * 0.12,
          filter: `blur(${Math.round(size * 0.13)}px)`,
          height: size * 0.3,
          marginLeft: -size * 0.42,
          width: size * 0.84,
        }}
        transition={canAnimate ? FADE : INSTANT}
      />

      <span className="absolute inset-0 overflow-hidden rounded-full">
        {ORB_LAYER_ORDER.map((layer) => (
          <motion.span
            animate={{ opacity: layer === value ? 1 : 0 }}
            className="absolute inset-0"
            initial={false}
            key={layer}
            style={{ background: ORB_BODY[layer] }}
            transition={canAnimate ? FADE : INSTANT}
          />
        ))}

        {CRATERS.map((crater) => (
          <motion.span
            animate={{ opacity: value === "dark" ? 0.32 : 0 }}
            className="absolute rounded-full bg-slate-950"
            initial={false}
            key={`${crater.left}-${crater.top}`}
            style={{
              filter: "blur(2px)",
              height: size * crater.size,
              left: size * crater.left,
              top: size * crater.top,
              width: size * crater.size,
            }}
            transition={canAnimate ? FADE : INSTANT}
          />
        ))}

        <motion.span
          animate={{
            opacity: specular.opacity,
            x: size * specular.x,
            y: size * specular.y,
          }}
          className="absolute top-0 left-0 rounded-[50%] bg-white"
          initial={false}
          style={{
            filter: `blur(${Math.round(size * 0.06)}px)`,
            height: size * 0.24,
            width: size * 0.32,
          }}
          transition={travel}
        />

        <span className="absolute inset-0 rounded-full shadow-[inset_-10px_-14px_28px_rgba(0,0,0,0.5),inset_8px_10px_22px_rgba(255,255,255,0.16)]" />
        <span className="absolute inset-0 rounded-full ring-1 ring-white/20 ring-inset" />
      </span>
    </span>
  );
};

/* -------------------------------------------------------------------------- */
/* Shared trigger for the two "one shape" variants                            */
/* -------------------------------------------------------------------------- */

type CycleButtonProps = {
  ariaLabel: string;
  ariaPressed?: boolean;
  children: ReactNode;
  className?: string;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
  onSelect: () => void;
};

const CycleButton = ({
  ariaLabel,
  ariaPressed,
  children,
  className,
  onKeyDown,
  onSelect,
}: CycleButtonProps) => (
  <button
    aria-label={ariaLabel}
    aria-pressed={ariaPressed}
    className={cn(
      "inline-flex cursor-pointer items-center justify-center rounded-full transition-transform duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background active:scale-95 motion-reduce:transition-none motion-reduce:active:scale-100",
      className
    )}
    onClick={onSelect}
    onKeyDown={onKeyDown}
    type="button"
  >
    {children}
  </button>
);

/* -------------------------------------------------------------------------- */
/* Root                                                                       */
/* -------------------------------------------------------------------------- */

const ThemeToggle = ({
  className,
  defaultTheme = "system",
  label,
  onThemeChange,
  showSystem = true,
  size = "md",
  theme: controlledTheme,
  variant = "sun-moon",
}: ThemeToggleProps) => {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const reactId = useId();
  const uid = reactId.replace(/:/g, "");
  const maskId = `theme-toggle-mask-${uid}`;
  const thumbId = `theme-toggle-thumb-${uid}`;
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const canAnimate = mounted && !shouldReduceMotion;

  const [internalTheme, setInternalTheme] =
    useState<ThemeToggleValue>(defaultTheme);
  const isControlled = controlledTheme !== undefined;
  const theme = isControlled ? controlledTheme : internalTheme;

  const selectTheme = useCallback(
    (next: ThemeToggleValue) => {
      if (!isControlled) {
        setInternalTheme(next);
      }
      onThemeChange?.(next);
    },
    [isControlled, onThemeChange]
  );

  const sizeConfig = SIZES[size];
  const options = useMemo(
    () => (showSystem ? THEME_OPTIONS : THEME_OPTIONS.slice(0, 2)),
    [showSystem]
  );
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === theme)
  );
  const selected = options[selectedIndex];
  const nextOption = options[(selectedIndex + 1) % options.length];
  const isDark = theme === "dark";

  const step = useCallback(
    (delta: number) => {
      const nextIndex =
        (selectedIndex + delta + options.length) % options.length;
      selectTheme(options[nextIndex].value);
      return nextIndex;
    },
    [options, selectedIndex, selectTheme]
  );

  const handleCycleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        step(1);
        return;
      }
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        step(-1);
      }
    },
    [step]
  );

  const handleOptionKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
      let nextIndex = index;
      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
          nextIndex = (index + 1) % options.length;
          break;
        case "ArrowLeft":
        case "ArrowUp":
          nextIndex = (index - 1 + options.length) % options.length;
          break;
        case "Home":
          nextIndex = 0;
          break;
        case "End":
          nextIndex = options.length - 1;
          break;
        default:
          return;
      }
      event.preventDefault();
      selectTheme(options[nextIndex].value);
      optionRefs.current[nextIndex]?.focus();
    },
    [options, selectTheme]
  );

  const registerRef = useCallback(
    (index: number, el: HTMLButtonElement | null) => {
      optionRefs.current[index] = el;
    },
    []
  );

  const groupLabel = label ?? "Theme";
  const prefix = label ? `${label}: ` : "";
  const cycleLabel = `${prefix}${selected.label} theme. Activate to switch to ${nextOption.label}.`;
  const binaryPressed = showSystem ? undefined : isDark;

  const trackWidth = sizeConfig.knob * options.length + sizeConfig.pad * 2;
  const trackHeight = sizeConfig.knob + sizeConfig.pad * 2;

  const renderVariant = () => {
    if (variant === "pill") {
      return (
        <PillToggle
          canAnimate={canAnimate}
          groupLabel={groupLabel}
          iconClassName={sizeConfig.icon}
          onKeyDown={handleOptionKeyDown}
          onSelect={selectTheme}
          options={options}
          registerRef={registerRef}
          segmentClassName={sizeConfig.segment}
          selectedIndex={selectedIndex}
          textClassName={sizeConfig.text}
          thumbId={thumbId}
        />
      );
    }

    if (variant === "switch") {
      const visual = (
        <SwitchVisual
          canAnimate={canAnimate}
          iconClassName={sizeConfig.icon}
          index={selectedIndex}
          knob={sizeConfig.knob}
          pad={sizeConfig.pad}
          trackHeight={trackHeight}
          trackWidth={trackWidth}
          value={theme}
        />
      );

      if (!showSystem) {
        return (
          <button
            aria-label={cycleLabel}
            aria-pressed={isDark}
            className="inline-flex cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            onClick={() => selectTheme(isDark ? "light" : "dark")}
            type="button"
          >
            {visual}
          </button>
        );
      }

      return (
        <div
          aria-label={groupLabel}
          className="relative inline-block rounded-full"
          role="radiogroup"
        >
          {visual}
          <div
            className="absolute inset-0 flex"
            style={{ padding: sizeConfig.pad }}
          >
            {options.map((option, index) => (
              <button
                aria-checked={index === selectedIndex}
                aria-label={option.label}
                className="cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-1 focus-visible:ring-offset-transparent"
                key={option.value}
                onClick={() => selectTheme(option.value)}
                onKeyDown={(event) => handleOptionKeyDown(event, index)}
                ref={(el) => {
                  registerRef(index, el);
                }}
                role="radio"
                style={{ width: sizeConfig.knob }}
                tabIndex={index === selectedIndex ? 0 : -1}
                type="button"
              />
            ))}
          </div>
        </div>
      );
    }

    if (variant === "orb") {
      return (
        <CycleButton
          ariaLabel={cycleLabel}
          ariaPressed={binaryPressed}
          className="p-1"
          onKeyDown={handleCycleKeyDown}
          onSelect={() => step(1)}
        >
          <OrbVisual
            canAnimate={canAnimate}
            size={sizeConfig.orb}
            value={theme}
          />
        </CycleButton>
      );
    }

    return (
      <CycleButton
        ariaLabel={cycleLabel}
        ariaPressed={binaryPressed}
        className="p-1"
        onKeyDown={handleCycleKeyDown}
        onSelect={() => step(1)}
      >
        <SunMoonGlyph
          canAnimate={canAnimate}
          maskId={maskId}
          size={sizeConfig.glyph}
          value={theme}
        />
      </CycleButton>
    );
  };

  return (
    <div className={cn("inline-flex flex-col items-center gap-2", className)}>
      {label ? (
        <span className="font-medium text-foreground text-sm">{label}</span>
      ) : null}
      {renderVariant()}
      <span aria-live="polite" className="sr-only">
        {`${selected.label} theme selected`}
      </span>
    </div>
  );
};

export default ThemeToggle;
