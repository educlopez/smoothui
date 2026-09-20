"use client";

import {
  applyColorPalette,
  COLOR_STORAGE_KEY,
  persistColorPalette,
  resetColorPalette,
} from "@docs/app/lib/color-palette";
import { AppearanceDrawing } from "@docs/components/illustrations/appearance-drawing";
import { THEME_PALETTES } from "@docs/lib/registry-themes";
import { cn } from "@repo/shadcn-ui/lib/utils";
import ButtonCopy from "@repo/smoothui/components/button-copy";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
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

const themeInstallCommand = (paletteName: string) =>
  `npx shadcn@latest add https://smoothui.dev/r/theme-${paletteName.toLowerCase()}.json`;

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
      className="relative size-[1.35rem] overflow-hidden rounded-[7px] border-[2.5px]"
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

  const selectedPalette =
    THEME_PALETTES.find(
      (palette) =>
        palette.primary === candy && palette.secondary === candySecondary
    ) ?? THEME_PALETTES[0];

  const appearance: Appearance =
    !mounted || theme === "system" || theme === undefined
      ? "system"
      : theme === "dark"
        ? "dark"
        : "light";

  const installCommand = themeInstallCommand(selectedPalette.name);

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
        className="float-trigger grid h-11! w-11! cursor-pointer place-items-center p-0!"
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
                    className="fixed inset-0 z-[55] bg-black/40 backdrop-blur-sm"
                    exit={{ opacity: 0 }}
                    initial={{ opacity: 0 }}
                    key="theme-overlay"
                    onClick={() => setOpen(false)}
                    transition={
                      reduceMotion ? { duration: 0 } : { duration: 0.2 }
                    }
                  />
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    aria-label="Theme settings"
                    aria-modal="true"
                    className="fixed inset-x-0 bottom-4 z-[60] mx-auto flex max-h-[80vh] w-[calc(100%-2rem)] max-w-lg flex-col overflow-hidden rounded-2xl border bg-background shadow-xl outline-none"
                    exit={
                      reduceMotion
                        ? { opacity: 0, transition: { duration: 0 } }
                        : { opacity: 0, y: "100%" }
                    }
                    initial={
                      reduceMotion ? { opacity: 0 } : { opacity: 0, y: "100%" }
                    }
                    key="theme-panel"
                    ref={dialogRef}
                    role="dialog"
                    tabIndex={-1}
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { bounce: 0.1, duration: 0.4, type: "spring" }
                    }
                  >
                    <div className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-muted" />

                    <div className="p-4 pb-3">
                      <h2 className="font-semibold text-base">
                        Theme settings
                      </h2>
                      <p className="text-muted-foreground text-sm">
                        Accent color, appearance, and install command.
                      </p>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                      <section className="border-t p-4">
                        <div className="mb-3 flex items-center justify-between gap-2">
                          <h3 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
                            Accent
                          </h3>
                          <button
                            className="inline-flex cursor-pointer items-center gap-1.5 text-muted-foreground text-xs transition-colors hover:text-foreground"
                            onClick={handleReset}
                            type="button"
                          >
                            <IconRefresh2Fill24 size={13} />
                            Reset accent
                          </button>
                        </div>
                        <div className="grid grid-cols-6 gap-2 sm:grid-cols-8">
                          {THEME_PALETTES.map((palette) => {
                            const selected =
                              palette.primary === candy &&
                              palette.secondary === candySecondary;
                            return (
                              <button
                                aria-label={`Use ${palette.label}`}
                                aria-pressed={selected}
                                className={cn(
                                  "aspect-square cursor-pointer rounded-xl border-2 transition-transform",
                                  selected
                                    ? "scale-105 border-foreground shadow-sm"
                                    : "border-transparent hover:scale-105"
                                )}
                                key={palette.name}
                                onClick={() =>
                                  pickPalette(
                                    palette.primary,
                                    palette.secondary
                                  )
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
                      </section>

                      <section className="border-t p-4">
                        <h3 className="mb-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                          Appearance
                        </h3>
                        <div className="grid grid-cols-3 gap-3">
                          {APPEARANCES.map((option) => {
                            const selected = appearance === option.id;
                            const Icon = option.icon;
                            return (
                              <button
                                aria-label={`Use ${option.label} theme`}
                                aria-pressed={selected}
                                className="group flex cursor-pointer flex-col gap-2 rounded-xl text-left outline-none focus-visible:ring-2 focus-visible:ring-brand"
                                key={option.id}
                                onClick={() => setTheme(option.id)}
                                type="button"
                              >
                                <AppearanceDrawing
                                  accent={candy}
                                  mode={option.id}
                                  selected={selected}
                                />
                                <span
                                  className={cn(
                                    "inline-flex items-center justify-center gap-1.5 rounded-full border px-2 py-1 font-medium text-xs transition-colors",
                                    selected
                                      ? "border-brand bg-brand/5 text-brand"
                                      : "border-transparent text-muted-foreground group-hover:text-foreground"
                                  )}
                                >
                                  <Icon size={12} />
                                  {option.label}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </section>
                    </div>

                    <div className="border-t p-4">
                      <div className="mb-1.5 flex items-center justify-between gap-2">
                        <span className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
                          Install theme
                        </span>
                        <span className="text-muted-foreground text-xs capitalize">
                          {selectedPalette.label}
                        </span>
                      </div>
                      <div className="overflow-hidden rounded-lg border border-border">
                        <div className="[&_figure]:!my-0 [&_figure]:!rounded-none [&_pre]:!rounded-none relative bg-fd-card pr-14 [&_code]:break-all [&_figure]:border-0 [&_pre]:whitespace-pre-wrap">
                          <div
                            className="absolute top-2 right-2 z-10"
                            title="Copy install command"
                          >
                            <ButtonCopy
                              className="size-9! min-h-9! min-w-9! rounded-md p-0!"
                              key={installCommand}
                              loadingDuration={0}
                              loadingIcon={
                                <IconDotsLoaderFill24 className="size-3.5 animate-spin" />
                              }
                              onCopy={() =>
                                navigator.clipboard.writeText(installCommand)
                              }
                              successIcon={
                                <IconCheckFill24 className="size-3.5" />
                              }
                            />
                          </div>
                          <DynamicCodeBlock
                            code={installCommand}
                            codeblock={{ allowCopy: false }}
                            lang="bash"
                          />
                        </div>
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
