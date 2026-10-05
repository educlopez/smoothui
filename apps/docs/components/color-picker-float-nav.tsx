"use client";

import {
  applyColorPalette,
  COLOR_STORAGE_KEY,
  persistColorPalette,
  resetColorPalette,
} from "@docs/app/lib/color-palette";
import { THEME_PALETTES } from "@docs/lib/registry-themes";
import { cn } from "@repo/shadcn-ui/lib/utils";
import ButtonCopy from "@repo/smoothui/components/button-copy";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTheme } from "next-themes";
import {
  IconCheckFill24,
  IconDotsLoaderFill24,
  IconLaptopFill24,
  IconMoonFill24,
  IconRefresh2Fill24,
  IconSunFill24,
} from "nucleo-core-fill-24";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Appearance = "system" | "dark" | "light";

const THEME_INSTALL_COMMAND =
  "npx shadcn@latest add https://smoothui.dev/r/theme.json";

const APPEARANCES: {
  id: Appearance;
  label: string;
  icon: typeof IconSunFill24;
}[] = [
  { icon: IconLaptopFill24, id: "system", label: "System" },
  { icon: IconMoonFill24, id: "dark", label: "Dark" },
  { icon: IconSunFill24, id: "light", label: "Light" },
];

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Float-nav glyph: accent rim + appearance fill.
 * Reads as both the brand color and the active theme mode.
 */
const ThemeFloatIcon = ({
  accent,
  appearance,
}: {
  accent: string;
  appearance: Appearance;
}) => {
  const isSystem = appearance === "system";
  const isDark = appearance === "dark";

  return (
    <span
      aria-hidden="true"
      className="relative size-4 overflow-hidden rounded-[5px] border-[1.5px]"
      style={{ borderColor: accent }}
    >
      {isSystem ? (
        <>
          <span className="absolute inset-y-0 left-0 w-1/2 bg-zinc-950" />
          <span className="absolute inset-y-0 right-0 w-1/2 bg-zinc-100" />
        </>
      ) : (
        <span
          className={cn(
            "absolute inset-0",
            isDark ? "bg-zinc-950" : "bg-zinc-100"
          )}
        />
      )}
    </span>
  );
};

export function ColorPickerFloatNav() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [candy, setCandy] = useState(THEME_PALETTES[0].primary);
  const [candySecondary, setCandySecondary] = useState(
    THEME_PALETTES[0].secondary
  );
  const [mounted, setMounted] = useState(false);
  const reduceMotion = useReducedMotion();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  const appearance: Appearance =
    !mounted || theme === "system" || theme === undefined
      ? "system"
      : theme === "dark"
        ? "dark"
        : "light";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const savedColors = localStorage.getItem(COLOR_STORAGE_KEY);
    if (savedColors) {
      try {
        const parsed = JSON.parse(savedColors);
        setCandy(parsed.candy);
        setCandySecondary(parsed.candySecondary);
        applyColorPalette(parsed.candy, parsed.candySecondary);
        return;
      } catch {
        // Ignore corrupt storage
      }
    }

    const c = getComputedStyle(document.body)
      .getPropertyValue("--color-brand")
      .trim();
    const cs = getComputedStyle(document.body)
      .getPropertyValue("--color-brand-secondary")
      .trim();
    if (c) {
      setCandy(c);
    }
    if (cs) {
      setCandySecondary(cs);
    }
  }, []);

  useEffect(() => {
    if (!open) {
      previouslyFocusedRef.current?.focus();
      previouslyFocusedRef.current = null;
      return;
    }

    previouslyFocusedRef.current =
      (document.activeElement as HTMLElement | null) ?? triggerRef.current;

    const focusFrame = requestAnimationFrame(() => {
      dialogRef.current?.focus();
    });

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) {
        return;
      }
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      ).filter((el) => !el.hasAttribute("disabled"));
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }
      const [first] = focusable;
      const last = focusable.at(-1);
      if (!(first && last)) {
        return;
      }
      const active = document.activeElement as HTMLElement | null;
      if (event.shiftKey) {
        if (active === first || !dialogRef.current.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last || !dialogRef.current.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  const pickPalette = (primary: string, secondary: string) => {
    setCandy(primary);
    setCandySecondary(secondary);
    applyColorPalette(primary, secondary);
    persistColorPalette(primary, secondary);
  };

  const handleReset = () => {
    resetColorPalette();
    localStorage.removeItem(COLOR_STORAGE_KEY);
    const c = getComputedStyle(document.body)
      .getPropertyValue("--color-brand")
      .trim();
    const cs = getComputedStyle(document.body)
      .getPropertyValue("--color-brand-secondary")
      .trim();
    setCandy(c || THEME_PALETTES[0].primary);
    setCandySecondary(cs || THEME_PALETTES[0].secondary);
  };

  return (
    <>
      <button
        aria-expanded={open}
        aria-label="Open theme settings"
        className="float-trigger grid size-9! cursor-pointer place-items-center p-0!"
        onClick={() => setOpen(true)}
        ref={triggerRef}
        type="button"
      >
        <ThemeFloatIcon accent={candy} appearance={appearance} />
      </button>

      {mounted
        ? createPortal(
            <AnimatePresence>
              {open ? (
                <>
                  <motion.div
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 z-[55] bg-black/30 backdrop-blur-[2px]"
                    exit={{ opacity: 0 }}
                    initial={{ opacity: 0 }}
                    key="theme-overlay"
                    onClick={() => setOpen(false)}
                    transition={
                      reduceMotion ? { duration: 0 } : { duration: 0.15 }
                    }
                  />
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    aria-label="Theme settings"
                    aria-modal="true"
                    className="fixed inset-x-0 bottom-4 z-[60] mx-auto w-[calc(100%-2rem)] max-w-sm overflow-hidden rounded-2xl border border-foreground/10 bg-background shadow-lg outline-none"
                    exit={
                      reduceMotion
                        ? { opacity: 0, transition: { duration: 0 } }
                        : { opacity: 0, y: 12 }
                    }
                    initial={
                      reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }
                    }
                    key="theme-panel"
                    ref={dialogRef}
                    role="dialog"
                    tabIndex={-1}
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { bounce: 0.08, duration: 0.28, type: "spring" }
                    }
                  >
                    <div className="flex items-center justify-between gap-3 px-3.5 pt-3.5 pb-2">
                      <h2 className="font-medium text-foreground text-sm">
                        Theme
                      </h2>
                      <button
                        aria-label="Reset accent"
                        className="inline-flex size-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        onClick={handleReset}
                        type="button"
                      >
                        <IconRefresh2Fill24 size={14} />
                      </button>
                    </div>

                    <div className="space-y-3 px-3.5 pb-3.5">
                      <div
                        aria-label="Accent color"
                        className="flex flex-wrap gap-1.5"
                        role="group"
                      >
                        {THEME_PALETTES.map((palette) => {
                          const selected =
                            palette.primary === candy &&
                            palette.secondary === candySecondary;
                          return (
                            <button
                              aria-label={palette.label}
                              aria-pressed={selected}
                              className={cn(
                                "size-7 cursor-pointer rounded-full transition-[transform,box-shadow] duration-150",
                                selected
                                  ? "scale-105 ring-2 ring-foreground ring-offset-2 ring-offset-background"
                                  : "hover:scale-105"
                              )}
                              key={palette.name}
                              onClick={() =>
                                pickPalette(palette.primary, palette.secondary)
                              }
                              style={{
                                background: `linear-gradient(135deg, ${palette.primary} 55%, ${palette.secondary} 100%)`,
                              }}
                              title={palette.label}
                              type="button"
                            />
                          );
                        })}
                      </div>

                      <div
                        aria-label="Appearance"
                        className="grid grid-cols-3 gap-0.5 rounded-lg bg-muted p-0.5"
                        role="group"
                      >
                        {APPEARANCES.map((option) => {
                          const selected = appearance === option.id;
                          const Icon = option.icon;
                          return (
                            <button
                              aria-label={option.label}
                              aria-pressed={selected}
                              className={cn(
                                "inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-md px-2 py-1.5 font-medium text-xs transition-colors duration-150",
                                selected
                                  ? "bg-background text-foreground shadow-sm"
                                  : "text-muted-foreground hover:text-foreground"
                              )}
                              key={option.id}
                              onClick={() => setTheme(option.id)}
                              type="button"
                            >
                              <Icon size={12} />
                              {option.label}
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex items-center gap-2 rounded-lg bg-muted/70 px-2.5 py-2 ring-1 ring-foreground/8">
                        <code className="min-w-0 flex-1 truncate font-mono text-[11px] text-muted-foreground">
                          {THEME_INSTALL_COMMAND}
                        </code>
                        <ButtonCopy
                          className="size-7! min-h-7! min-w-7! shrink-0 rounded-md p-0!"
                          key={THEME_INSTALL_COMMAND}
                          loadingDuration={0}
                          loadingIcon={
                            <IconDotsLoaderFill24 className="size-3 animate-spin" />
                          }
                          onCopy={() =>
                            navigator.clipboard.writeText(THEME_INSTALL_COMMAND)
                          }
                          successIcon={<IconCheckFill24 className="size-3" />}
                        />
                      </div>
                    </div>
                  </motion.div>
                </>
              ) : null}
            </AnimatePresence>,
            document.body
          )
        : null}
    </>
  );
}
