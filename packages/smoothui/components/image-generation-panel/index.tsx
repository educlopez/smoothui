"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import {
  AlertCircle,
  Check,
  Download,
  Image as ImageIcon,
  Shuffle,
  Sparkles,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  type Transition,
  useReducedMotion,
} from "motion/react";
import { useId, useState } from "react";
import type { AIState } from "../ai-core";
import AILoader from "../ai-loader";
import AIPromptInput from "../ai-prompt-input";

/* -------------------------------------------------------------------------- */
/* Motion + layout constants                                                  */
/* -------------------------------------------------------------------------- */

const SPRING_DEFAULT: Transition = {
  bounce: 0.1,
  duration: 0.25,
  type: "spring",
};
const SPRING_SNAPPY: Transition = { bounce: 0, duration: 0.2, type: "spring" };

const PERCENT = 100;
const DEFAULT_COUNT = 4;
const DEFAULT_ASPECT_RATIO = "1 / 1";

/** How far apart, in overall progress, two neighbouring tiles finish. */
const TILE_FINISH_STAGGER = 0.09;
const MIN_TILE_SPAN = 0.25;
const TILE_ENTER_STAGGER_SECONDS = 0.05;

/** The blurred pass never exceeds ~20px — past that `blur()` gets expensive. */
const MAX_SHARP_BLUR_PX = 18;
const MOSAIC_BLUR_PX = 2;
const MOSAIC_SATURATE = 1.35;
const MOSAIC_SCALE = 1.08;
const MOSAIC_FADE_START = 0.3;
const MOSAIC_FADE_SPAN = 0.5;
const SHARP_FADE_START = 0.12;
const SHARP_FADE_SPAN = 0.5;
const SHARPEN_EXPONENT = 1.35;
/** Extra scale on the sharp pass at 0% — the tile "pulls focus" as it resolves. */
const FOCUS_PULL_SCALE = 0.055;

/**
 * The sweep band is 45% of the tile tall and travels leading-edge-first from
 * the top edge to the bottom. Starting at -100% parks the whole band (and its
 * trail) above the tile; 124% carries the leading edge past the bottom edge.
 */
const SCAN_DURATION_SECONDS = 1.9;
const SCAN_KEYFRAMES = ["translateY(-100%)", "translateY(124%)"];
const SHIMMER_DURATION_SECONDS = 1.6;
const CARET_DURATION_SECONDS = 1;
const CARET_TIMES = [0, 0.5, 0.5, 1];
const CARET_KEYFRAMES = [1, 1, 0, 0];

const PROMPT_PLACEHOLDER = "A lighthouse at dusk, long exposure…";

const ACTION_ICON_SIZE = 15;
const STATUS_ICON_SIZE = 14;
const PLACEHOLDER_ICON_SIZE = 18;

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

/**
 * Where a single tile sits in its own 0→1 resolve, given the batch progress.
 *
 * Real generators don't finish four images on the same frame, and a grid that
 * does reads as a single image cut into quarters. Offsetting each tile's window
 * makes the batch look like four jobs racing rather than one mask lifting.
 */
const tileProgress = (
  batchProgress: number,
  index: number,
  count: number
): number => {
  const offset = index * TILE_FINISH_STAGGER;
  const span = Math.max(MIN_TILE_SPAN, 1 - (count - 1) * TILE_FINISH_STAGGER);
  return clamp01((batchProgress - offset) / span);
};

const ramp = (value: number, start: number, span: number): number =>
  clamp01((value - start) / span);

/* -------------------------------------------------------------------------- */
/* Public types                                                              */
/* -------------------------------------------------------------------------- */

export type ImageGenerationStatus =
  | "idle"
  | "queued"
  | "generating"
  | "done"
  | "error";

export type ImageGenerationImage = {
  alt: string;
  id: string;
  /**
   * A tiny (16–48px) version of `src`. Rendered pixelated and blurred as the
   * first pass, so the tile starts as a colour mosaic of the real result
   * instead of a grey box. Falls back to `src` when omitted.
   */
  preview?: string;
  /** Surfaced once the tile has resolved. */
  seed?: string;
  src: string;
};

export type ImageGenerationPreset = {
  id: string;
  label: string;
};

export type ImageGenerationAspectRatio = {
  id: string;
  label: string;
  /** Any CSS `aspect-ratio` value, e.g. `"16 / 9"`. */
  value: string;
};

/**
 * How much surrounding chrome the panel renders. `minimal` drops the header,
 * the footer and the batch progress rail, and hides the seed readout — leaving
 * the composer and the tiles. Everything else, including the API, is unchanged.
 */
export type ImageGenerationChrome = "full" | "minimal";

/** Whether the prompt composer sits above or below the tiles. */
export type ImageGenerationComposerPlacement = "top" | "bottom";

export type ImageGenerationPanelProps = {
  /** Controlled `aspect-ratio` value. Omit to let the panel own the choice. */
  aspectRatio?: string;
  aspectRatios?: ImageGenerationAspectRatio[];
  /** How much surrounding chrome renders. Defaults to `"full"`. */
  chrome?: ImageGenerationChrome;
  className?: string;
  /** Where the composer sits relative to the tiles. Defaults to `"top"`. */
  composerPlacement?: ImageGenerationComposerPlacement;
  /** Number of tiles in the grid. */
  count?: number;
  error?: string;
  images?: ImageGenerationImage[];
  /** Model name shown in the header. */
  model?: string;
  onAspectRatioChange?: (value: string) => void;
  /**
   * Cancels the run in flight. Given one, the composer's send control turns
   * into a stop button while the batch renders; without one the composer simply
   * locks until the batch settles.
   */
  onCancel?: () => void;
  onGenerate?: (prompt: string) => unknown;
  onPromptChange?: (value: string) => void;
  onRetry?: () => void;
  onSelect?: (image: ImageGenerationImage) => void;
  onVariations?: (image: ImageGenerationImage) => void;
  presets?: ImageGenerationPreset[];
  /** Batch progress, 0–1. Drives every tile's mosaic-to-sharp resolve. */
  progress?: number;
  prompt?: string;
  /** Batch seed, shown in the composer readout. */
  seed?: string;
  /** Controlled status. Omit to run the panel's own queued → done cycle. */
  status?: ImageGenerationStatus;
  /**
   * Renders the prompt as read-only text with a blinking caret. Use while
   * replaying or streaming a prompt into the field.
   */
  typing?: boolean;
};

/* -------------------------------------------------------------------------- */
/* Static config                                                              */
/* -------------------------------------------------------------------------- */

const DEFAULT_ASPECT_RATIOS: ImageGenerationAspectRatio[] = [
  { id: "square", label: "1:1", value: "1 / 1" },
  { id: "portrait", label: "4:5", value: "4 / 5" },
  { id: "wide", label: "16:9", value: "16 / 9" },
];

const STATUS_META: Record<
  ImageGenerationStatus,
  { dot: string; label: string }
> = {
  done: { dot: "bg-emerald-500", label: "Ready" },
  error: { dot: "bg-destructive", label: "Failed" },
  generating: { dot: "bg-brand", label: "Rendering" },
  idle: { dot: "bg-muted-foreground/40", label: "Idle" },
  queued: { dot: "bg-amber-500", label: "Queued" },
};

const TILE_ACTION_CLASS =
  "relative flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-colors duration-150 ease-out before:absolute before:-inset-1 before:content-[''] hover:bg-black/75 focus-visible:outline-2 focus-visible:outline-white/90 focus-visible:outline-offset-2 motion-reduce:transition-none";

/* -------------------------------------------------------------------------- */
/* Tile                                                                       */
/* -------------------------------------------------------------------------- */

type TileProps = {
  aspectRatio: string;
  image?: ImageGenerationImage;
  index: number;
  onSelect?: (image: ImageGenerationImage) => void;
  onVariations?: (image: ImageGenerationImage) => void;
  progress: number;
  shouldReduceMotion: boolean;
  status: ImageGenerationStatus;
};

const EmptyTile = ({
  aspectRatio,
  isQueued,
  shouldReduceMotion,
}: {
  aspectRatio: string;
  isQueued: boolean;
  shouldReduceMotion: boolean;
}) => (
  <div
    className="relative flex items-center justify-center overflow-hidden rounded-lg border border-border border-dashed bg-muted/40"
    style={{ aspectRatio }}
  >
    {isQueued ? (
      <motion.span
        animate={
          shouldReduceMotion ? { opacity: 0.6 } : { opacity: [0.3, 0.7, 0.3] }
        }
        aria-hidden="true"
        className="absolute inset-0 bg-foreground/5"
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : {
                duration: SHIMMER_DURATION_SECONDS,
                ease: "linear",
                repeat: Number.POSITIVE_INFINITY,
              }
        }
      />
    ) : null}
    <span className="relative flex flex-col items-center gap-1.5 text-muted-foreground/60">
      <ImageIcon aria-hidden="true" size={PLACEHOLDER_ICON_SIZE} />
      <span className="text-[11px]">{isQueued ? "Queued" : "Empty"}</span>
    </span>
  </div>
);

const ImageGenerationTile = ({
  aspectRatio,
  image,
  index,
  onSelect,
  onVariations,
  progress,
  shouldReduceMotion,
  status,
}: TileProps) => {
  if (!image) {
    return (
      <EmptyTile
        aspectRatio={aspectRatio}
        isQueued={status === "queued" || status === "generating"}
        shouldReduceMotion={shouldReduceMotion}
      />
    );
  }

  const local = shouldReduceMotion ? 1 : progress;
  const isResolving = local < 1;
  const sharpness = local ** SHARPEN_EXPONENT;

  const mosaicOpacity = 1 - ramp(local, MOSAIC_FADE_START, MOSAIC_FADE_SPAN);
  const sharpOpacity = ramp(local, SHARP_FADE_START, SHARP_FADE_SPAN);
  const sharpBlur = MAX_SHARP_BLUR_PX * (1 - sharpness);

  const canAct = !isResolving && status === "done";

  return (
    <motion.div
      animate={{ opacity: 1, transform: "scale(1)" }}
      className="group relative isolate overflow-hidden rounded-lg border border-border bg-muted"
      initial={
        shouldReduceMotion ? false : { opacity: 0, transform: "scale(0.96)" }
      }
      style={{ aspectRatio }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { ...SPRING_DEFAULT, delay: index * TILE_ENTER_STAGGER_SECONDS }
      }
    >
      {/* Blocky first pass — a low-res mosaic of the real result. */}
      <img
        alt=""
        aria-hidden="true"
        className="absolute inset-0 size-full object-cover"
        src={image.preview ?? image.src}
        style={{
          filter: `blur(${MOSAIC_BLUR_PX}px) saturate(${MOSAIC_SATURATE})`,
          imageRendering: "pixelated",
          opacity: mosaicOpacity,
          transform: `scale(${MOSAIC_SCALE})`,
        }}
      />

      {/* The result, sharpening as it crossfades over the mosaic. */}
      <img
        alt={image.alt}
        className="absolute inset-0 size-full object-cover"
        src={image.src}
        style={{
          filter: sharpBlur > 0 ? `blur(${sharpBlur}px)` : undefined,
          opacity: sharpOpacity,
          transform: `scale(${1 + FOCUS_PULL_SCALE * (1 - local)})`,
        }}
      />

      {isResolving && !shouldReduceMotion ? (
        <motion.span
          animate={{ transform: SCAN_KEYFRAMES }}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[45%] mix-blend-screen"
          transition={{
            duration: SCAN_DURATION_SECONDS,
            ease: "linear",
            repeat: Number.POSITIVE_INFINITY,
          }}
        >
          {/* Gradient trail — dark at the tail, brightening toward the edge. */}
          <span className="absolute inset-0 bg-gradient-to-b from-transparent via-brand/30 to-brand/70" />
          {/* Soft leading edge: a blurred bloom that glows over the image. */}
          <span className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-b from-transparent to-white/75 blur-[7px]" />
          {/* The band itself — a crisp, clearly visible bright line. */}
          <span className="absolute inset-x-0 bottom-0 h-[2px] bg-white/95" />
        </motion.span>
      ) : null}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-start p-2">
        <AnimatePresence initial={false} mode="wait">
          <motion.span
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            className="rounded-full bg-black/55 px-2 py-0.5 font-mono text-[11px] text-white tabular-nums backdrop-blur-sm"
            exit={
              shouldReduceMotion
                ? { opacity: 0, transition: { duration: 0 } }
                : { opacity: 0, transform: "translateY(-4px)" }
            }
            initial={
              shouldReduceMotion
                ? false
                : { opacity: 0, transform: "translateY(4px)" }
            }
            key={isResolving ? "progress" : "seed"}
            transition={shouldReduceMotion ? { duration: 0 } : SPRING_SNAPPY}
          >
            {isResolving
              ? `${Math.round(local * PERCENT)}%`
              : (image.seed ?? "done")}
          </motion.span>
        </AnimatePresence>
      </div>

      {isResolving ? (
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-0.5 bg-black/25"
        >
          <span
            className="block h-full origin-left bg-brand"
            style={{ transform: `scaleX(${local})` }}
          />
        </span>
      ) : null}

      {canAct ? (
        <div className="absolute inset-0 flex items-start justify-end gap-1 bg-gradient-to-b from-black/45 via-transparent to-transparent p-2 opacity-0 transition-opacity duration-150 ease-out group-focus-within:opacity-100 group-hover:opacity-100 motion-reduce:transition-none">
          <a
            aria-label={`Download ${image.alt}`}
            className={TILE_ACTION_CLASS}
            download
            href={image.src}
          >
            <Download aria-hidden="true" size={ACTION_ICON_SIZE} />
          </a>
          {onVariations ? (
            <button
              aria-label={`Make variations of ${image.alt}`}
              className={TILE_ACTION_CLASS}
              onClick={() => onVariations(image)}
              type="button"
            >
              <Shuffle aria-hidden="true" size={ACTION_ICON_SIZE} />
            </button>
          ) : null}
          {onSelect ? (
            <button
              aria-label={`Select ${image.alt}`}
              className={TILE_ACTION_CLASS}
              onClick={() => onSelect(image)}
              type="button"
            >
              <Check aria-hidden="true" size={ACTION_ICON_SIZE} />
            </button>
          ) : null}
        </div>
      ) : null}
    </motion.div>
  );
};

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * A text-to-image generation console: prompt and settings on the left, the
 * batch resolving on the right.
 *
 * The reveal is the whole point. Each tile starts as a pixelated, blurred
 * mosaic of its own result and sharpens as `progress` climbs, with a scan line
 * travelling down it and a live percentage — so a still frame of this component
 * already tells you images are being generated, which a grey skeleton never does.
 *
 * `status` is controllable, but most consumers won't bother — left undefined the
 * panel runs its own queued → generating → done / error cycle around whatever
 * `onGenerate` resolves to. `images` and `progress` stay the caller's
 * responsibility either way, since only the caller knows how a real generation
 * job reports partial results.
 */
const ImageGenerationPanel = ({
  aspectRatio,
  aspectRatios = DEFAULT_ASPECT_RATIOS,
  chrome = "full",
  className,
  composerPlacement = "top",
  count = DEFAULT_COUNT,
  error,
  images = [],
  model = "smoothui-diffusion v2",
  onAspectRatioChange,
  onCancel,
  onGenerate,
  onPromptChange,
  onRetry,
  onSelect,
  onVariations,
  presets = [],
  progress = 0,
  prompt,
  seed,
  status,
  typing = false,
}: ImageGenerationPanelProps) => {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const panelId = useId();

  const [internalPrompt, setInternalPrompt] = useState("");
  const [internalStatus, setInternalStatus] =
    useState<ImageGenerationStatus>("idle");
  const [internalRatio, setInternalRatio] = useState(
    aspectRatios[0]?.value ?? DEFAULT_ASPECT_RATIO
  );

  const isPromptControlled = prompt !== undefined;
  const draft = isPromptControlled ? prompt : internalPrompt;

  const isStatusControlled = status !== undefined;
  const effectiveStatus = isStatusControlled ? status : internalStatus;
  const isBusy =
    effectiveStatus === "queued" || effectiveStatus === "generating";

  const isRatioControlled = aspectRatio !== undefined;
  const activeRatio = isRatioControlled ? aspectRatio : internalRatio;

  const setDraft = (value: string) => {
    if (!isPromptControlled) {
      setInternalPrompt(value);
    }
    onPromptChange?.(value);
  };

  const pickRatio = (value: string) => {
    if (!isRatioControlled) {
      setInternalRatio(value);
    }
    onAspectRatioChange?.(value);
  };

  const togglePreset = (preset: ImageGenerationPreset) => {
    if (isBusy) {
      return;
    }
    const marker = `, ${preset.label}`;
    setDraft(
      draft.includes(marker) ? draft.replace(marker, "") : `${draft}${marker}`
    );
  };

  const handleGenerate = async () => {
    if (!(draft.trim() && onGenerate) || isBusy) {
      return;
    }
    if (isStatusControlled) {
      await onGenerate(draft.trim());
      return;
    }
    setInternalStatus("queued");
    try {
      // A macrotask gap so "queued" commits a frame before flipping to
      // "generating" — otherwise React batches both and queued is never seen.
      await new Promise((resolve) => setTimeout(resolve, 0));
      setInternalStatus("generating");
      await onGenerate(draft.trim());
      setInternalStatus("done");
    } catch {
      setInternalStatus("error");
    }
  };

  const statusMeta = STATUS_META[effectiveStatus];
  const percent = Math.round(clamp01(progress) * PERCENT);

  /**
   * Only two panel states change the composer: a run the caller can interrupt
   * turns send into stop, and a failure rings the field to back the banner up.
   * "Done" deliberately stays neutral — the status pill, the footer and the
   * tile's seed all report it already, and a ring that lights up on every pass
   * of a looping demo is noise, not feedback.
   */
  const composerState: AIState = (() => {
    if (effectiveStatus === "error") {
      return "error";
    }
    if (isBusy) {
      return onCancel ? "streaming" : "thinking";
    }
    return "idle";
  })();

  const announcement = (() => {
    switch (effectiveStatus) {
      case "queued":
        return "Request queued.";
      case "generating":
        return `Generating ${count} images, ${percent} percent.`;
      case "done":
        return `${count} images ready.`;
      case "error":
        return error ?? "Generation failed.";
      default:
        return "";
    }
  })();

  const isMinimal = chrome === "minimal";
  const isComposerFirst = composerPlacement === "top";
  const showSeed = !isMinimal;
  const hasComposerMeta =
    presets.length > 0 || aspectRatios.length > 0 || showSeed;

  const composer = (
    <div
      className={cn(
        "flex flex-col gap-2.5 border-border p-3.5",
        isComposerFirst ? "border-b" : "border-t"
      )}
    >
      {/* The composer is AIPromptInput — the library's own chat-style field, so
          the prompt bar here behaves exactly like the one in every other AI
          surface: one rounded container, focus on the container, the send
          control inside it, Enter to submit and Shift+Enter for a newline. */}
      <div className="relative">
        <AIPromptInput
          aria-label="Prompt"
          // Replay borrows the real field rather than mimicking it: the textarea
          // keeps owning the layout and the auto-grow, its glyphs just go
          // invisible so the read-only pass below can draw the caret.
          className={cn(
            typing &&
              "[&_textarea]:pointer-events-none [&_textarea]:text-transparent [&_textarea]:caret-transparent"
          )}
          disabled={isBusy && !onCancel}
          onStop={onCancel}
          onSubmit={handleGenerate}
          onValueChange={setDraft}
          placeholder={typing ? "" : PROMPT_PLACEHOLDER}
          state={composerState}
          value={draft}
        />
        {typing ? (
          <p
            aria-hidden="true"
            className="pointer-events-none absolute top-px right-px left-px whitespace-pre-wrap break-words px-4 pt-3 text-foreground text-sm"
          >
            {draft}
            <motion.span
              animate={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: CARET_KEYFRAMES }
              }
              className="ml-px inline-block h-3.5 w-px translate-y-0.5 bg-brand align-middle"
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : {
                      duration: CARET_DURATION_SECONDS,
                      ease: "linear",
                      repeat: Number.POSITIVE_INFINITY,
                      times: CARET_TIMES,
                    }
              }
            />
          </p>
        ) : null}
      </div>

      {hasComposerMeta ? (
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2">
          {presets.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {presets.map((preset) => {
                const active = draft.includes(`, ${preset.label}`);
                return (
                  <button
                    aria-pressed={active}
                    className={cn(
                      "cursor-pointer rounded-full border px-2.5 py-1 text-xs transition-colors duration-150 ease-out disabled:cursor-default disabled:opacity-60 motion-reduce:transition-none",
                      active
                        ? "border-foreground/25 bg-foreground/10 text-foreground"
                        : "border-border text-muted-foreground hover:text-foreground"
                    )}
                    disabled={isBusy}
                    key={preset.id}
                    onClick={() => togglePreset(preset)}
                    type="button"
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          ) : null}

          {aspectRatios.length > 0 ? (
            <div className="flex gap-0.5 rounded-md bg-muted/70 p-0.5">
              {aspectRatios.map((ratio) => {
                const active = ratio.value === activeRatio;
                return (
                  <button
                    aria-label={`Aspect ratio ${ratio.label}`}
                    aria-pressed={active}
                    className={cn(
                      "relative cursor-pointer rounded-sm px-2 py-1 text-xs transition-colors duration-150 ease-out disabled:cursor-default disabled:opacity-60 motion-reduce:transition-none",
                      active ? "text-foreground" : "text-muted-foreground"
                    )}
                    disabled={isBusy}
                    key={ratio.id}
                    onClick={() => pickRatio(ratio.value)}
                    type="button"
                  >
                    {active ? (
                      <motion.span
                        aria-hidden="true"
                        className="absolute inset-0 rounded-sm bg-background shadow-black/10 shadow-xs"
                        layoutId={`${panelId}-ratio`}
                        transition={
                          shouldReduceMotion ? { duration: 0 } : SPRING_SNAPPY
                        }
                      />
                    ) : null}
                    <span className="relative">{ratio.label}</span>
                  </button>
                );
              })}
            </div>
          ) : null}

          {showSeed ? (
            <span className="ml-auto flex items-center gap-2 rounded-md border border-border border-dashed px-2 py-1 font-mono text-[11px] text-muted-foreground tabular-nums">
              seed
              <span className="text-foreground">{seed ?? "—"}</span>
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );

  const tiles = (
    <div
      className={cn(
        "grid gap-2.5 p-3.5",
        count === 1 ? "grid-cols-1" : "grid-cols-2"
      )}
    >
      {Array.from({ length: count }, (_, index) => (
        <ImageGenerationTile
          aspectRatio={activeRatio}
          image={images[index]}
          index={index}
          key={images[index]?.id ?? `slot-${index}`}
          onSelect={onSelect}
          onVariations={onVariations}
          progress={tileProgress(clamp01(progress), index, count)}
          shouldReduceMotion={shouldReduceMotion}
          status={effectiveStatus}
        />
      ))}
    </div>
  );

  const body = isComposerFirst ? (
    <>
      {composer}
      {tiles}
    </>
  ) : (
    <>
      {tiles}
      {composer}
    </>
  );

  return (
    <div
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-black/5 shadow-sm",
        className
      )}
    >
      {isMinimal ? null : (
        <header className="flex items-center justify-between gap-3 border-border border-b px-4 py-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-brand/10 text-brand">
              <Sparkles aria-hidden="true" size={STATUS_ICON_SIZE} />
            </span>
            <div className="min-w-0">
              <p className="truncate font-medium text-foreground text-sm leading-tight">
                Image generation
              </p>
              <p className="truncate font-mono text-[11px] text-muted-foreground leading-tight">
                {model}
              </p>
            </div>
          </div>
          <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-muted-foreground text-xs">
            <span
              aria-hidden="true"
              className={cn("size-1.5 rounded-full", statusMeta.dot)}
            />
            {statusMeta.label}
          </span>
        </header>
      )}

      <span aria-live="polite" className="sr-only" role="status">
        {announcement}
      </span>

      {body}

      {effectiveStatus === "error" ? (
        <div
          className="flex items-center justify-between gap-3 border-border border-t bg-destructive/10 px-4 py-2.5 text-destructive text-sm"
          role="alert"
        >
          <span className="flex items-center gap-1.5">
            <AlertCircle aria-hidden="true" size={STATUS_ICON_SIZE} />
            {error ?? "Something went wrong generating these images."}
          </span>
          {onRetry ? (
            <button
              className="cursor-pointer font-medium underline-offset-2 hover:underline"
              onClick={onRetry}
              type="button"
            >
              Retry
            </button>
          ) : null}
        </div>
      ) : null}

      {isMinimal ? null : (
        <>
          <footer className="flex items-center justify-between gap-3 border-border border-t px-4 py-2.5 text-muted-foreground text-xs">
            {isBusy ? (
              <AILoader
                label={effectiveStatus === "queued" ? "Queued" : "Rendering"}
                variant="dots"
              />
            ) : (
              <span>
                {effectiveStatus === "done"
                  ? `${count} images · ${activeRatio.replace(/\s/g, "")}`
                  : `${count} images · ${activeRatio.replace(/\s/g, "")} · ready when you are`}
              </span>
            )}
            <span className="font-mono tabular-nums">{percent}%</span>
          </footer>

          <span aria-hidden="true" className="block h-0.5 w-full bg-border">
            <span
              className="block h-full origin-left bg-brand transition-transform duration-150 ease-out motion-reduce:transition-none"
              style={{ transform: `scaleX(${clamp01(progress)})` }}
            />
          </span>
        </>
      )}
    </div>
  );
};

export default ImageGenerationPanel;
