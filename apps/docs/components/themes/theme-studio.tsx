"use client";

import {
  DARK_SCALE,
  getTheme,
  LIGHT_SCALE,
  THEME_PALETTES,
  type ThemePalette,
} from "@docs/lib/registry-themes";
import { cn } from "@repo/shadcn-ui/lib/utils";
import Scrubber from "@repo/smoothui/components/scrubber";
import SmoothButton from "@repo/smoothui/components/smooth-button";
import {
  Check,
  Copy,
  ExternalLink,
  Moon,
  Shuffle,
  Sun,
  Terminal,
} from "lucide-react";
import dynamic from "next/dynamic";
import {
  type ComponentType,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const COPY_FEEDBACK_DURATION = 1500;
const PRESET_CODE = "b3gmgq";
const SHADCN_CREATE_PRESET_URL = `https://ui.shadcn.com/create?preset=${PRESET_CODE}`;

type PreviewMode = "light" | "dark";

const installCommand = (paletteName: string) =>
  `npx shadcn@latest add https://smoothui.dev/r/theme-${paletteName}.json`;

const componentInstallCommand = (slug: string) =>
  `npx shadcn@latest add https://smoothui.dev/r/${slug}.json`;

const toCssBlock = (vars: Record<string, string>, selector: string) => {
  const body = Object.entries(vars)
    .map(([key, value]) => `  --${key}: ${value};`)
    .join("\n");
  return `${selector} {\n${body}\n}`;
};

const PX_PER_REM = 16;

const buildThemeCss = (paletteName: string, radiusPx: number): string => {
  const theme = getTheme(`theme-${paletteName}`);
  if (!(theme?.cssVars?.light && theme.cssVars.dark)) {
    return "";
  }
  const light = {
    ...theme.cssVars.light,
    radius: `${radiusPx / PX_PER_REM}rem`,
  };
  return `${toCssBlock(light, ":root")}\n\n${toCssBlock(
    theme.cssVars.dark,
    ".dark"
  )}`;
};

// The docs app's Tailwind theme is declared with `@theme inline`, so
// utilities like bg-background compile to the UNDERLYING SmoothUI tokens
// (var(--color-smooth-50), var(--color-brand)...). To scope a theme preview
// we therefore override those tokens on the container, not the shadcn names.
const buildPreviewStyle = (
  palette: ThemePalette,
  mode: PreviewMode,
  radiusPx: number
): Record<string, string> => {
  const scale: Record<string, string> =
    mode === "dark" ? DARK_SCALE : LIGHT_SCALE;
  const destructive = getTheme(`theme-${palette.name}`)?.cssVars?.[mode]
    ?.destructive;
  const style: Record<string, string> = {
    "--color-brand": palette.primary,
    "--color-brand-secondary": palette.secondary,
    "--radius": `${radiusPx}px`,
    ...(destructive ? { "--destructive": destructive } : {}),
  };
  for (const [stop, value] of Object.entries(scale)) {
    style[`--color-smooth-${stop}`] = value;
  }
  return style;
};

function useCopy() {
  const [copied, setCopied] = useState(false);

  async function copy(value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), COPY_FEEDBACK_DURATION);
  }

  return { copied, copy };
}

// Row-card in the Grid Loader customizer language: bg-smooth-200 pill rows
// with the label on the left and the control on the right.
function PanelRow({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex min-h-9 items-center justify-between rounded-lg bg-smooth-200 py-1 pr-1.5 pl-3">
      <span className="font-medium text-[13px] text-foreground">{label}</span>
      {children}
    </div>
  );
}

function StudioSidebar({
  palette,
  mode,
  radius,
  onPalette,
  onMode,
  onRadius,
}: {
  palette: ThemePalette;
  mode: PreviewMode;
  radius: number;
  onPalette: (palette: ThemePalette) => void;
  onMode: (mode: PreviewMode) => void;
  onRadius: (radius: number) => void;
}) {
  const presetCopy = useCopy();
  const commandCopy = useCopy();
  const cssCopy = useCopy();
  const themeCss = useMemo(
    () => buildThemeCss(palette.name, radius),
    [palette.name, radius]
  );

  function handleShuffle() {
    const others = THEME_PALETTES.filter(
      (entry) => entry.name !== palette.name
    );
    onPalette(others[Math.floor(Math.random() * others.length)]);
  }

  return (
    <aside className="flex w-full shrink-0 flex-col gap-1.5 overflow-y-auto rounded-xl border bg-smooth-100 p-3 shadow-sm lg:w-64">
      <div className="flex items-center justify-between px-1 pb-1">
        <span className="font-semibold text-[15px] text-foreground">
          Theme Studio
        </span>
        <button
          aria-label="Shuffle theme"
          className="rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
          onClick={handleShuffle}
          type="button"
        >
          <Shuffle className="size-4" />
        </button>
      </div>

      <PanelRow label="Theme">
        <div className="flex overflow-hidden rounded-md">
          {THEME_PALETTES.map((entry) => (
            <button
              aria-label={`Select ${entry.label} theme`}
              aria-pressed={entry.name === palette.name}
              className="size-5 cursor-pointer transition-opacity duration-200"
              key={entry.name}
              onClick={() => onPalette(entry)}
              style={{
                background: `linear-gradient(135deg, ${entry.primary} 60%, ${entry.secondary} 100%)`,
                opacity: entry.name === palette.name ? 1 : 0.45,
              }}
              title={entry.label}
              type="button"
            />
          ))}
        </div>
      </PanelRow>

      <div className="flex min-h-9 items-center gap-1 rounded-lg bg-smooth-200 p-1">
        {(["light", "dark"] as const).map((entry) => (
          <button
            aria-pressed={mode === entry}
            className={cn(
              "flex h-7 flex-1 items-center justify-center gap-1.5 rounded-md font-medium text-[13px] capitalize transition-all",
              mode === entry
                ? "bg-foreground/10 text-foreground"
                : "text-muted-foreground"
            )}
            key={entry}
            onClick={() => onMode(entry)}
            type="button"
          >
            {entry === "light" ? (
              <Sun className="size-3.5" />
            ) : (
              <Moon className="size-3.5" />
            )}
            {entry}
          </button>
        ))}
      </div>

      <Scrubber
        decimals={0}
        label="Radius"
        max={24}
        min={0}
        onValueChange={onRadius}
        step={1}
        ticks={5}
        value={radius}
      />

      <div className="flex flex-col gap-2">
        <span className="pl-1 font-semibold text-[13px] text-foreground/65">
          Preset
        </span>
        <div className="flex flex-col gap-0.5 rounded-lg bg-smooth-200 p-1">
          <button
            className="flex items-center justify-between rounded-md px-2 py-1.5 font-mono text-[13px] text-foreground transition-colors hover:bg-foreground/5"
            onClick={() => presetCopy.copy(`--preset ${PRESET_CODE}`)}
            type="button"
          >
            --preset {PRESET_CODE}
            {presetCopy.copied ? (
              <Check className="size-3.5" />
            ) : (
              <Copy className="size-3.5 text-muted-foreground" />
            )}
          </button>
          <a
            className="flex items-center justify-between rounded-md px-2 py-1.5 text-[13px] text-foreground transition-colors hover:bg-foreground/5"
            href={SHADCN_CREATE_PRESET_URL}
            rel="noopener noreferrer"
            target="_blank"
          >
            Open in shadcn/create
            <ExternalLink className="size-3.5 text-muted-foreground" />
          </a>
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-2 pt-2">
        <SmoothButton
          className="w-full"
          onClick={() => commandCopy.copy(installCommand(palette.name))}
          variant="candy"
        >
          {commandCopy.copied ? (
            <Check className="size-4" />
          ) : (
            <Terminal className="size-4" />
          )}
          {commandCopy.copied ? "Copied!" : `Install ${palette.label}`}
        </SmoothButton>
        <SmoothButton
          className="w-full"
          onClick={() => cssCopy.copy(themeCss)}
          variant="outline"
        >
          {cssCopy.copied ? (
            <Check className="size-3.5" />
          ) : (
            <Copy className="size-3.5" />
          )}
          {cssCopy.copied ? "Copied!" : "Copy CSS variables"}
        </SmoothButton>
      </div>
    </aside>
  );
}

const demoTitle = (slug: string): string =>
  slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

// Every component demo in the registry, code-split so the board only loads
// what scrolls into view.
const DEMO_CARDS: { slug: string; Demo: ComponentType }[] = [
  {
    slug: "agent-avatar",
    Demo: dynamic(() => import("@docs/examples/agent-avatar")),
  },
  {
    slug: "ai-branch",
    Demo: dynamic(() => import("@docs/examples/ai-branch")),
  },
  {
    slug: "ai-input",
    Demo: dynamic(() => import("@docs/examples/ai-input")),
  },
  {
    slug: "animated-avatar-group",
    Demo: dynamic(() => import("@docs/examples/animated-avatar-group")),
  },
  {
    slug: "animated-file-upload",
    Demo: dynamic(() => import("@docs/examples/animated-file-upload")),
  },
  {
    slug: "animated-input",
    Demo: dynamic(() => import("@docs/examples/animated-input")),
  },
  {
    slug: "animated-o-t-p-input",
    Demo: dynamic(() => import("@docs/examples/animated-o-t-p-input")),
  },
  {
    slug: "animated-progress-bar",
    Demo: dynamic(() => import("@docs/examples/animated-progress-bar")),
  },
  {
    slug: "animated-stepper",
    Demo: dynamic(() => import("@docs/examples/animated-stepper")),
  },
  {
    slug: "animated-tabs",
    Demo: dynamic(() => import("@docs/examples/animated-tabs")),
  },
  {
    slug: "animated-tags",
    Demo: dynamic(() => import("@docs/examples/animated-tags")),
  },
  {
    slug: "animated-toggle",
    Demo: dynamic(() => import("@docs/examples/animated-toggle")),
  },
  {
    slug: "animated-tooltip",
    Demo: dynamic(() => import("@docs/examples/animated-tooltip")),
  },
  {
    slug: "app-download-stack",
    Demo: dynamic(() => import("@docs/examples/app-download-stack")),
  },
  {
    slug: "apple-invites",
    Demo: dynamic(() => import("@docs/examples/apple-invites")),
  },
  {
    slug: "basic-accordion",
    Demo: dynamic(() => import("@docs/examples/basic-accordion")),
  },
  {
    slug: "basic-dropdown",
    Demo: dynamic(() => import("@docs/examples/basic-dropdown")),
  },
  {
    slug: "basic-modal",
    Demo: dynamic(() => import("@docs/examples/basic-modal")),
  },
  {
    slug: "basic-toast",
    Demo: dynamic(() => import("@docs/examples/basic-toast")),
  },
  {
    slug: "book",
    Demo: dynamic(() => import("@docs/examples/book")),
  },
  {
    slug: "breadcrumb",
    Demo: dynamic(() => import("@docs/examples/breadcrumb")),
  },
  {
    slug: "button-copy",
    Demo: dynamic(() => import("@docs/examples/button-copy")),
  },
  {
    slug: "checkbox",
    Demo: dynamic(() => import("@docs/examples/checkbox")),
  },
  {
    slug: "clip-corners-button",
    Demo: dynamic(() => import("@docs/examples/clip-corners-button")),
  },
  {
    slug: "combobox",
    Demo: dynamic(() => import("@docs/examples/combobox")),
  },
  {
    slug: "context-menu",
    Demo: dynamic(() => import("@docs/examples/context-menu")),
  },
  {
    slug: "contribution-graph",
    Demo: dynamic(() => import("@docs/examples/contribution-graph")),
  },
  {
    slug: "cursor-follow",
    Demo: dynamic(() => import("@docs/examples/cursor-follow")),
  },
  {
    slug: "dialog",
    Demo: dynamic(() => import("@docs/examples/dialog")),
  },
  {
    slug: "dot-morph-button",
    Demo: dynamic(() => import("@docs/examples/dot-morph-button")),
  },
  {
    slug: "drawer",
    Demo: dynamic(() => import("@docs/examples/drawer")),
  },
  {
    slug: "dropdown-menu",
    Demo: dynamic(() => import("@docs/examples/dropdown-menu")),
  },
  {
    slug: "dynamic-island",
    Demo: dynamic(() => import("@docs/examples/dynamic-island")),
  },
  {
    slug: "expandable-cards",
    Demo: dynamic(() => import("@docs/examples/expandable-cards")),
  },
  {
    slug: "exposure-slider",
    Demo: dynamic(() => import("@docs/examples/exposure-slider")),
  },
  {
    slug: "figma-comment",
    Demo: dynamic(() => import("@docs/examples/figma-comment")),
  },
  {
    slug: "form",
    Demo: dynamic(() => import("@docs/examples/form")),
  },
  {
    slug: "github-stars-animation",
    Demo: dynamic(() => import("@docs/examples/github-stars-animation")),
  },
  {
    slug: "glow-hover-card",
    Demo: dynamic(() => import("@docs/examples/glow-hover-card")),
  },
  {
    slug: "gooey-popover",
    Demo: dynamic(() => import("@docs/examples/gooey-popover")),
  },
  {
    slug: "grid-loader",
    Demo: dynamic(() => import("@docs/examples/grid-loader")),
  },
  {
    slug: "image-metadata-preview",
    Demo: dynamic(() => import("@docs/examples/image-metadata-preview")),
  },
  {
    slug: "infinite-slider",
    Demo: dynamic(() => import("@docs/examples/infinite-slider")),
  },
  {
    slug: "interactive-image-selector",
    Demo: dynamic(() => import("@docs/examples/interactive-image-selector")),
  },
  {
    slug: "job-listing-component",
    Demo: dynamic(() => import("@docs/examples/job-listing-component")),
  },
  {
    slug: "magnetic-button",
    Demo: dynamic(() => import("@docs/examples/magnetic-button")),
  },
  {
    slug: "notification-badge",
    Demo: dynamic(() => import("@docs/examples/notification-badge")),
  },
  {
    slug: "number-flow",
    Demo: dynamic(() => import("@docs/examples/number-flow")),
  },
  {
    slug: "pagination",
    Demo: dynamic(() => import("@docs/examples/pagination")),
  },
  {
    slug: "phototab",
    Demo: dynamic(() => import("@docs/examples/phototab")),
  },
  {
    slug: "power-off-slide",
    Demo: dynamic(() => import("@docs/examples/power-off-slide")),
  },
  {
    slug: "price-flow",
    Demo: dynamic(() => import("@docs/examples/price-flow")),
  },
  {
    slug: "product-card",
    Demo: dynamic(() => import("@docs/examples/product-card")),
  },
  {
    slug: "radio-group",
    Demo: dynamic(() => import("@docs/examples/radio-group")),
  },
  {
    slug: "reveal-text",
    Demo: dynamic(() => import("@docs/examples/reveal-text")),
  },
  {
    slug: "reviews-carousel",
    Demo: dynamic(() => import("@docs/examples/reviews-carousel")),
  },
  {
    slug: "rich-popover",
    Demo: dynamic(() => import("@docs/examples/rich-popover")),
  },
  {
    slug: "scramble-hover",
    Demo: dynamic(() => import("@docs/examples/scramble-hover")),
  },
  {
    slug: "scrollable-card-stack",
    Demo: dynamic(() => import("@docs/examples/scrollable-card-stack")),
  },
  {
    slug: "scrubber",
    Demo: dynamic(() => import("@docs/examples/scrubber")),
  },
  {
    slug: "searchable-dropdown",
    Demo: dynamic(() => import("@docs/examples/searchable-dropdown")),
  },
  {
    slug: "select",
    Demo: dynamic(() => import("@docs/examples/select")),
  },
  {
    slug: "siri-orb",
    Demo: dynamic(() => import("@docs/examples/siri-orb")),
  },
  {
    slug: "skeleton-loader",
    Demo: dynamic(() => import("@docs/examples/skeleton-loader")),
  },
  {
    slug: "smooth-button",
    Demo: dynamic(() => import("@docs/examples/smooth-button")),
  },
  {
    slug: "social-selector",
    Demo: dynamic(() => import("@docs/examples/social-selector")),
  },
  {
    slug: "switchboard-card",
    Demo: dynamic(() => import("@docs/examples/switchboard-card")),
  },
  {
    slug: "typewriter-text",
    Demo: dynamic(() => import("@docs/examples/typewriter-text")),
  },
  {
    slug: "user-account-avatar",
    Demo: dynamic(() => import("@docs/examples/user-account-avatar")),
  },
  {
    slug: "wave-text",
    Demo: dynamic(() => import("@docs/examples/wave-text")),
  },
];

// Mounts the demo when the card approaches the viewport and unmounts it when
// it leaves, remembering its height so the masonry never shifts. Keeps the
// board at a constant runtime cost no matter how many demos exist.
const LAZY_ROOT_MARGIN = "400px";
const PLACEHOLDER_MIN_HEIGHT = 220;

function LazyDemo({ Demo }: { Demo: ComponentType }) {
  const ref = useRef<HTMLDivElement>(null);
  const heightRef = useRef<number>(PLACEHOLDER_MIN_HEIGHT);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        } else {
          if (el.offsetHeight > 0) {
            heightRef.current = el.offsetHeight;
          }
          setVisible(false);
        }
      },
      { rootMargin: LAZY_ROOT_MARGIN }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="flex items-center justify-center overflow-hidden p-4"
      ref={ref}
      style={visible ? undefined : { minHeight: heightRef.current }}
    >
      {visible ? <Demo /> : null}
    </div>
  );
}

const BOARD_COLUMN_COUNT = 5;
const BOARD_COLUMNS: (typeof DEMO_CARDS)[] = Array.from(
  { length: BOARD_COLUMN_COUNT },
  (_, index) =>
    DEMO_CARDS.filter(
      (_, cardIndex) => cardIndex % BOARD_COLUMN_COUNT === index
    )
);

function CopyInstallButton({ slug }: { slug: string }) {
  const { copied, copy } = useCopy();

  return (
    <button
      aria-label={`Copy install command for ${demoTitle(slug)}`}
      className="text-muted-foreground transition-colors hover:text-foreground"
      onClick={() => copy(componentInstallCommand(slug))}
      title={componentInstallCommand(slug)}
      type="button"
    >
      {copied ? (
        <Check className="size-3.5 text-accent" />
      ) : (
        <Terminal className="size-3.5" />
      )}
    </button>
  );
}

function PreviewCanvas({
  palette,
  mode,
  radius,
}: {
  palette: ThemePalette;
  mode: PreviewMode;
  radius: number;
}) {
  const style = useMemo(
    () => buildPreviewStyle(palette, mode, radius),
    [palette, mode, radius]
  );
  const panRef = useRef<HTMLDivElement>(null);
  const panState = useRef({ active: false, x: 0, y: 0, left: 0, top: 0 });
  const [panning, setPanning] = useState(false);

  // Start centered on the board so the user can pan in any direction
  // right away instead of being parked at the top-left corner.
  useEffect(() => {
    const el = panRef.current;
    if (!el) {
      return;
    }
    el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
    el.scrollTop = (el.scrollHeight - el.clientHeight) / 2;
  }, []);

  // Capturing the pointer on pointerdown would retarget the eventual click
  // to the canvas, silently breaking onClick handlers on non-button elements
  // inside the demos. So the pan only arms on pointerdown and captures after
  // the pointer actually travels — a plain click never gets hijacked.
  const PAN_THRESHOLD_PX = 5;

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    // Primary button only: right-click must reach context menus untouched.
    if (event.button !== 0) {
      return;
    }
    // Real interactive controls keep full pointer ownership (slider drags).
    if (
      (event.target as HTMLElement).closest(
        "button, a, input, textarea, select, [contenteditable], [role='tab'], [role='switch'], [role='slider'], [role='checkbox']"
      )
    ) {
      return;
    }
    const el = panRef.current;
    if (!el) {
      return;
    }
    panState.current = {
      active: true,
      x: event.clientX,
      y: event.clientY,
      left: el.scrollLeft,
      top: el.scrollTop,
    };
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const el = panRef.current;
    if (!(panState.current.active && el)) {
      return;
    }
    const deltaX = event.clientX - panState.current.x;
    const deltaY = event.clientY - panState.current.y;
    if (!panning) {
      if (
        Math.abs(deltaX) < PAN_THRESHOLD_PX &&
        Math.abs(deltaY) < PAN_THRESHOLD_PX
      ) {
        return;
      }
      el.setPointerCapture(event.pointerId);
      setPanning(true);
    }
    el.scrollLeft = panState.current.left - deltaX;
    el.scrollTop = panState.current.top - deltaY;
  }

  function handlePointerEnd() {
    panState.current.active = false;
    setPanning(false);
  }

  return (
    <div
      className={cn(
        "min-w-0 flex-1 rounded-2xl bg-secondary text-foreground transition-colors duration-200 lg:rounded-r-none",
        panning ? "cursor-grabbing select-none" : "cursor-grab"
      )}
      onPointerCancel={handlePointerEnd}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      ref={panRef}
      style={{ ...style, overflow: "auto", scrollbarWidth: "none" }}
    >
      <div className="frame-box relative flex w-[2600px] items-start gap-5 p-8">
        {BOARD_COLUMNS.map((column, columnIndex) => (
          <div
            className="flex min-w-0 flex-1 flex-col gap-5"
            // biome-ignore lint/suspicious/noArrayIndexKey: columns are static
            key={columnIndex}
          >
            {column.map(({ slug, Demo }) => (
              <div
                className="rounded-xl border bg-background shadow-sm"
                data-demo-card
                key={slug}
              >
                <div className="flex items-center justify-between border-b px-4 py-2.5">
                  <span className="font-medium text-foreground text-sm">
                    {demoTitle(slug)}
                  </span>
                  <div className="flex items-center gap-2.5">
                    <CopyInstallButton slug={slug} />
                    <a
                      aria-label={`Open ${demoTitle(slug)} docs`}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                      href={`/docs/components/${slug}`}
                    >
                      <ExternalLink className="size-3.5" />
                    </a>
                  </div>
                </div>
                <LazyDemo Demo={Demo} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const DEFAULT_RADIUS_PX = 10;

export function ThemeStudio() {
  const [palette, setPalette] = useState<ThemePalette>(THEME_PALETTES[0]);
  const [mode, setMode] = useState<PreviewMode>("light");
  const [radius, setRadius] = useState(DEFAULT_RADIUS_PX);

  return (
    <div className="flex w-full flex-col gap-4 px-3 pt-20 pb-3 lg:h-dvh lg:flex-row lg:items-stretch lg:overflow-hidden lg:pr-0 lg:pb-4 lg:pl-6">
      <h1 className="sr-only">SmoothUI Themes</h1>
      <StudioSidebar
        mode={mode}
        onMode={setMode}
        onPalette={setPalette}
        onRadius={setRadius}
        palette={palette}
        radius={radius}
      />
      <PreviewCanvas mode={mode} palette={palette} radius={radius} />
    </div>
  );
}
