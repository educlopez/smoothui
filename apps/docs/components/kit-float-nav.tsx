"use client";

import { COLOR_STORAGE_KEY } from "@docs/app/lib/color-palette";
import {
  type PackageManager,
  usePackageManager,
} from "@docs/hooks/use-package-manager";
import { prettify, useKit } from "@docs/lib/kit-context";
import { THEME_PALETTES } from "@docs/lib/registry-themes";
import { STARTER_KITS } from "@docs/lib/starter-kits";
import { cn } from "@repo/shadcn-ui/lib/utils";
import ButtonCopy from "@repo/smoothui/components/button-copy";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  IconBag24Fill24,
  IconChartBarTrendUpFill24,
  IconCheckFill24,
  IconChevronDownFill24,
  IconCopy2Fill24,
  IconDotsLoaderFill24,
  IconLayersFill24,
  IconMobile2Fill24,
  IconRefresh2Fill24,
  IconRocketFill24,
  IconShareLeft3Fill24,
  IconXmarkFill24,
} from "nucleo-core-fill-24";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const KIT_ICON: Record<string, typeof IconLayersFill24> = {
  landing: IconRocketFill24,
  ios: IconMobile2Fill24,
  dashboard: IconChartBarTrendUpFill24,
};

const PM_PREFIX: Record<PackageManager, string> = {
  pnpm: "pnpm dlx shadcn add",
  npm: "npx shadcn@latest add",
  yarn: "yarn dlx shadcn add",
  bun: "bunx shadcn add",
};

export function KitFloatNav() {
  const { items, count, remove, removeMany, clear, addMany } = useKit();
  const [pm] = usePackageManager();
  const [open, setOpen] = useState(false);
  const [kitsOpen, setKitsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  // Theme comes from the float color picker (site palette), not the drawer.
  const [siteTheme, setSiteTheme] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll + close on Escape, and read the current site palette so
  // the command can include the matching `@smoothui/theme-<name>`.
  useEffect(() => {
    if (!open) {
      return;
    }
    try {
      const raw = localStorage.getItem(COLOR_STORAGE_KEY);
      const candy = raw ? JSON.parse(raw).candy : null;
      const palette = THEME_PALETTES.find((p) => p.primary === candy);
      setSiteTheme(palette ? palette.name : null);
    } catch {
      setSiteTheme(null);
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  const themeArg = siteTheme ? `@smoothui/theme-${siteTheme} ` : "";
  const command = `${PM_PREFIX[pm]} ${themeArg}${items
    .map((i) => `@smoothui/${i.slug}`)
    .join(" ")}`;

  const shareUrl =
    typeof window === "undefined" || count === 0
      ? ""
      : `${window.location.origin}/docs/components?kit=${items
          .map((i) => i.slug)
          .join(",")}${siteTheme ? `&theme=${siteTheme}` : ""}`;

  const isKitActive = (slugs: string[]) =>
    slugs.every((slug) => items.some((i) => i.slug === slug));

  const toggleStarter = (slugs: string[]) => {
    if (isKitActive(slugs)) {
      removeMany(slugs);
    } else {
      addMany(slugs.map((slug) => ({ slug, title: prettify(slug) })));
    }
  };

  return (
    <>
      <button
        aria-label={`Open install bundle (${count} selected)`}
        className="float-trigger flex h-auto w-auto items-center gap-1.5 p-2!"
        onClick={() => setOpen(true)}
        type="button"
      >
        <IconLayersFill24 size={20} />
        <span className="font-medium text-sm">Bundle</span>
        {count > 0 && (
          <span className="grid min-w-5 place-items-center rounded-full bg-brand px-1.5 py-0.5 font-semibold text-[11px] text-white">
            {count}
          </span>
        )}
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <>
                <motion.div
                  animate={{ opacity: 1 }}
                  className="fixed inset-0 z-[55] bg-black/40 backdrop-blur-sm"
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0 }}
                  key="kit-overlay"
                  onClick={() => setOpen(false)}
                  transition={
                    reduceMotion ? { duration: 0 } : { duration: 0.2 }
                  }
                />
                <motion.div
                  animate={{ y: 0, opacity: 1 }}
                  aria-label="Install bundle"
                  aria-modal="true"
                  className="fixed inset-x-0 bottom-4 z-[60] mx-auto flex max-h-[80vh] w-[calc(100%-2rem)] max-w-2xl flex-col overflow-hidden rounded-2xl border bg-background shadow-xl"
                  exit={
                    reduceMotion
                      ? { opacity: 0, transition: { duration: 0 } }
                      : { y: "100%", opacity: 0 }
                  }
                  initial={
                    reduceMotion ? { opacity: 0 } : { y: "100%", opacity: 0 }
                  }
                  key="kit-panel"
                  role="dialog"
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { type: "spring", duration: 0.4, bounce: 0.1 }
                  }
                >
                  <div className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-muted" />

                  {/* Header */}
                  <div className="p-4 pb-3">
                    <h2 className="font-semibold text-base">
                      Your install bundle
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Remove items, copy the command, or share your bundle.
                    </p>
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    {/* Starter kits (collapsible) */}
                    <section className="border-t">
                      <button
                        aria-expanded={kitsOpen}
                        className="flex w-full items-center justify-between gap-2 p-4"
                        onClick={() => setKitsOpen((o) => !o)}
                        type="button"
                      >
                        <span className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
                          Starter kits
                        </span>
                        <IconChevronDownFill24
                          className={cn(
                            "text-muted-foreground transition-transform",
                            kitsOpen && "rotate-180"
                          )}
                          size={16}
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {kitsOpen && (
                          <motion.div
                            animate={{ height: "auto", opacity: 1 }}
                            className="overflow-hidden"
                            exit={{ height: 0, opacity: 0 }}
                            initial={{ height: 0, opacity: 0 }}
                            transition={
                              reduceMotion
                                ? { duration: 0 }
                                : { duration: 0.25 }
                            }
                          >
                            <div className="flex flex-col gap-2 px-4 pb-4">
                              {STARTER_KITS.map((kit) => {
                                const active = isKitActive(kit.slugs);
                                const Icon =
                                  KIT_ICON[kit.id] ?? IconLayersFill24;
                                return (
                                  <button
                                    aria-pressed={active}
                                    className={cn(
                                      "flex items-center justify-between gap-2 rounded-md border px-3 py-2 text-left transition-colors",
                                      active
                                        ? "border-brand/40 bg-brand/5"
                                        : "border-border hover:bg-muted"
                                    )}
                                    key={kit.id}
                                    onClick={() => toggleStarter(kit.slugs)}
                                    type="button"
                                  >
                                    <span className="flex min-w-0 items-center gap-3">
                                      <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-border bg-muted/40 text-foreground">
                                        <Icon size={16} />
                                      </span>
                                      <span className="min-w-0">
                                        <span className="block truncate font-medium text-foreground text-sm">
                                          {kit.label}
                                        </span>
                                        <span className="block truncate text-muted-foreground text-xs">
                                          {kit.description} · {kit.slugs.length}
                                        </span>
                                      </span>
                                    </span>
                                    <span
                                      className={cn(
                                        "grid size-5 shrink-0 place-items-center rounded-full",
                                        active
                                          ? "bg-brand text-white"
                                          : "text-muted-foreground"
                                      )}
                                    >
                                      {active ? (
                                        <IconCheckFill24 size={13} />
                                      ) : (
                                        <IconBag24Fill24 size={15} />
                                      )}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </section>

                    {/* Selected */}
                    <section className="border-t p-4">
                      {count === 0 ? (
                        <div className="flex flex-col items-center justify-center px-6 py-6 text-center">
                          <div
                            aria-hidden="true"
                            className="relative flex size-36 items-center justify-center"
                            style={{
                              WebkitMaskImage:
                                "radial-gradient(circle at center, black 30%, transparent 75%)",
                              maskImage:
                                "radial-gradient(circle at center, black 30%, transparent 75%)",
                            }}
                          >
                            <svg
                              aria-hidden="true"
                              className="absolute inset-0 size-full text-muted-foreground/30"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <defs>
                                <pattern
                                  height="12"
                                  id="kit-empty-dots"
                                  patternUnits="userSpaceOnUse"
                                  width="12"
                                >
                                  <circle
                                    cx="1"
                                    cy="1"
                                    fill="currentColor"
                                    r="1"
                                  />
                                </pattern>
                              </defs>
                              <rect
                                fill="url(#kit-empty-dots)"
                                height="100%"
                                width="100%"
                              />
                            </svg>
                            <div className="relative flex size-14 items-center justify-center rounded-xl border border-border bg-background text-foreground shadow-sm">
                              <IconLayersFill24 className="size-6" />
                            </div>
                          </div>
                          <h3 className="mt-3 font-semibold text-foreground text-sm">
                            Your bundle is empty
                          </h3>
                          <p className="mt-1 max-w-xs text-muted-foreground text-sm">
                            Add components with the “Add” button, or load a
                            starter kit above.
                          </p>
                        </div>
                      ) : (
                        <>
                          <h3 className="mb-2 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                            Selected ({count})
                          </h3>
                          <ul>
                            {items.map((item) => (
                              <li
                                className="flex items-center justify-between gap-2 border-border/60 border-b py-2 last:border-0"
                                key={item.slug}
                              >
                                <span className="truncate font-medium text-foreground text-sm">
                                  {item.title}
                                </span>
                                <button
                                  aria-label={`Remove ${item.title}`}
                                  className="grid size-6 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                  onClick={() => remove(item.slug)}
                                  type="button"
                                >
                                  <IconXmarkFill24 size={14} />
                                </button>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </section>
                  </div>

                  {/* Command + actions */}
                  {count > 0 && (
                    <div className="border-t p-4">
                      <div className="mb-1.5 flex items-center justify-between gap-2">
                        <span className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
                          Install command
                        </span>
                        {siteTheme && (
                          <span className="text-muted-foreground text-xs">
                            incl. {siteTheme} theme
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 rounded-md border border-border bg-muted/40 py-2 pr-1 pl-3">
                        <code className="flex-1 overflow-x-auto whitespace-nowrap font-mono text-foreground text-xs">
                          {command}
                        </code>
                        <ButtonCopy
                          className="grid size-7 shrink-0 place-items-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          idleIcon={<IconCopy2Fill24 className="size-3.5" />}
                          loadingIcon={
                            <IconDotsLoaderFill24 className="size-3.5 animate-spin" />
                          }
                          onCopy={() => navigator.clipboard.writeText(command)}
                          successIcon={<IconCheckFill24 className="size-3.5" />}
                        />
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <button
                          className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 font-medium text-foreground text-xs transition-colors hover:bg-muted"
                          onClick={() =>
                            navigator.clipboard.writeText(shareUrl)
                          }
                          title={shareUrl}
                          type="button"
                        >
                          <IconShareLeft3Fill24 size={13} />
                          Copy share link
                        </button>
                        <button
                          className="inline-flex items-center gap-1.5 text-muted-foreground text-xs transition-colors hover:text-destructive"
                          onClick={clear}
                          type="button"
                        >
                          <IconRefresh2Fill24 size={13} />
                          Clear all
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
