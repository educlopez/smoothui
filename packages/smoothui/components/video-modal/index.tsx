"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import SmoothButton from "@repo/smoothui/components/smooth-button";
import {
  Maximize,
  Minimize,
  Pause,
  Play,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

const SPRING_PANEL = { bounce: 0.1, duration: 0.25, type: "spring" as const };
const BACKDROP_DURATION = 0.2;
const SEEK_STEP_SECONDS = 5;
const SECONDS_PER_MINUTE = 60;
const TIME_PAD_LENGTH = 2;
const THUMBNAIL_PLAY_ICON_SIZE = 22;

/** Control-bar buttons sit on video, so the ghost variant is tinted white via
 *  the `color` axis' own custom property rather than a text/hover override. */
const CONTROL_BUTTON_CLASS = "shrink-0 [--btn:#fff]";

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/* -------------------------------------------------------------------------- */
/* Public types                                                               */
/* -------------------------------------------------------------------------- */

export type VideoModalCaption = {
  /** Human-readable track name, e.g. "English". */
  label: string;
  src: string;
  /** BCP 47 language tag, e.g. "en". */
  srcLang: string;
};

export type VideoModalProps = {
  /** Starts playback once the modal finishes opening. Ignored under reduced motion. */
  autoPlayOnOpen?: boolean;
  captions?: VideoModalCaption[];
  className?: string;
  onOpenChange?: (open: boolean) => void;
  /** Controlled open state. Omit to let the component own it. */
  open?: boolean;
  poster?: string;
  /** Renders the built-in control bar instead of the browser's native one. */
  showCustomControls?: boolean;
  src: string;
  /** CSS `aspect-ratio` value for the closed thumbnail, e.g. "16/9". */
  thumbnailAspect?: string;
  title: string;
};

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const formatTime = (seconds: number): string => {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }
  const minutes = Math.floor(seconds / SECONDS_PER_MINUTE);
  const remainder = Math.floor(seconds % SECONDS_PER_MINUTE);
  return `${minutes}:${remainder.toString().padStart(TIME_PAD_LENGTH, "0")}`;
};

/* -------------------------------------------------------------------------- */
/* Custom control bar                                                         */
/* -------------------------------------------------------------------------- */

type VideoModalControlsProps = {
  currentTime: number;
  duration: number;
  isFullscreen: boolean;
  isMuted: boolean;
  isPlaying: boolean;
  onScrubKeyDown: (event: ReactKeyboardEvent<HTMLDivElement>) => void;
  onScrubPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => void;
  onToggleFullscreen: () => void;
  onToggleMute: () => void;
  onTogglePlay: () => void;
  progress: number;
};

const VideoModalControls = ({
  currentTime,
  duration,
  isFullscreen,
  isMuted,
  isPlaying,
  onScrubKeyDown,
  onScrubPointerDown,
  onToggleFullscreen,
  onToggleMute,
  onTogglePlay,
  progress,
}: VideoModalControlsProps) => (
  <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-black/85 to-transparent px-4 py-3 text-white">
    <SmoothButton
      aria-label={isPlaying ? "Pause" : "Play"}
      className={cn(CONTROL_BUTTON_CLASS, "[&_svg]:size-[18px]")}
      onClick={onTogglePlay}
      shape="pill"
      size="icon-sm"
      variant="ghost"
    >
      {isPlaying ? (
        <Pause aria-hidden="true" fill="currentColor" />
      ) : (
        <Play aria-hidden="true" fill="currentColor" />
      )}
    </SmoothButton>

    <div
      aria-label="Seek"
      aria-valuemax={Math.round(duration)}
      aria-valuemin={0}
      aria-valuenow={Math.round(currentTime)}
      aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
      className="relative h-1.5 flex-1 cursor-pointer touch-none rounded-full bg-white/25"
      onKeyDown={onScrubKeyDown}
      onPointerDown={onScrubPointerDown}
      role="slider"
      tabIndex={0}
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-0 rounded-full bg-white"
        style={{ width: `${progress}%` }}
      />
    </div>

    <span className="shrink-0 whitespace-nowrap text-xs tabular-nums">
      {formatTime(currentTime)} / {formatTime(duration)}
    </span>

    <SmoothButton
      aria-label={isMuted ? "Unmute" : "Mute"}
      className={CONTROL_BUTTON_CLASS}
      onClick={onToggleMute}
      shape="pill"
      size="icon-sm"
      variant="ghost"
    >
      {isMuted ? (
        <VolumeX aria-hidden="true" />
      ) : (
        <Volume2 aria-hidden="true" />
      )}
    </SmoothButton>

    <SmoothButton
      aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      className={CONTROL_BUTTON_CLASS}
      onClick={onToggleFullscreen}
      shape="pill"
      size="icon-sm"
      variant="ghost"
    >
      {isFullscreen ? (
        <Minimize aria-hidden="true" />
      ) : (
        <Maximize aria-hidden="true" />
      )}
    </SmoothButton>
  </div>
);

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * A thumbnail that morphs into a full player.
 *
 * The thumbnail and the modal frame share one `layoutId`, so opening reads as
 * the same rectangle growing into place rather than a new one appearing on
 * top of it. The thumbnail stays mounted — invisible — for exactly as long as
 * the modal is open, because Motion needs a live node with that id to measure
 * the box it is morphing from and back into.
 */
const VideoModal = ({
  autoPlayOnOpen = true,
  captions = [],
  className,
  onOpenChange,
  open,
  poster,
  showCustomControls = true,
  src,
  thumbnailAspect = "16/9",
  title,
}: VideoModalProps) => {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const frameLayoutId = `${useId()}-frame`;

  const [mounted, setMounted] = useState(false);
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const previousOverflowRef = useRef<string | null>(null);

  useEffect(() => setMounted(true), []);

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setInternalOpen(next);
      }
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  const close = useCallback(() => setOpen(false), [setOpen]);

  // Body scroll locks while the modal is open, and only while it is open.
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    previousOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflowRef.current ?? "";
    };
  }, [isOpen]);

  // Focus enters the panel on open and returns to the trigger on close.
  useEffect(() => {
    if (isOpen) {
      panelRef.current?.focus();
    } else {
      triggerRef.current?.focus();
    }
  }, [isOpen]);

  // Escape closes the modal; Tab is trapped inside the panel.
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) {
        return;
      }
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      );
      const [first] = focusable;
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

  // The video pauses whenever the modal closes or the tab goes hidden — an
  // autoplaying video nobody can see is just a battery drain.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    if (!isOpen) {
      video.pause();
      return;
    }
    if (autoPlayOnOpen && !shouldReduceMotion) {
      video.play().catch(() => {
        // Autoplay can be blocked by the browser; the play button still works.
      });
    }
    const handleVisibility = () => {
      if (document.hidden) {
        video.pause();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [isOpen, autoPlayOnOpen, shouldReduceMotion]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration || 0);
    const handleVolumeChange = () => setIsMuted(video.muted);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("volumechange", handleVolumeChange);
    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("volumechange", handleVolumeChange);
    };
    // The <video> only exists once the portal has mounted and the modal is
    // open, both of which land a render after this effect first runs. With an
    // empty dependency array it found a null ref and never re-ran, so the
    // control bar's play state, mute state and scrub position never tracked
    // actual playback.
  }, [mounted, isOpen]);

  useEffect(() => {
    const handleFullscreenChange = () =>
      setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    if (video.paused) {
      video.play().catch(() => {
        // Ignore — nothing useful to surface for a blocked play() here.
      });
    } else {
      video.pause();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !video.muted;
    }
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      panelRef.current?.requestFullscreen().catch(() => {});
    }
  };

  const seekTo = (time: number) => {
    const video = videoRef.current;
    if (!video || duration <= 0) {
      return;
    }
    video.currentTime = Math.min(Math.max(time, 0), duration);
  };

  const handleScrubPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const track = event.currentTarget;
    track.setPointerCapture(event.pointerId);
    const scrub = (clientX: number) => {
      const rect = track.getBoundingClientRect();
      const ratio = Math.min(
        Math.max((clientX - rect.left) / rect.width, 0),
        1
      );
      seekTo(ratio * duration);
    };
    scrub(event.clientX);
    const handleMove = (moveEvent: PointerEvent) => scrub(moveEvent.clientX);
    const handleUp = () => {
      track.removeEventListener("pointermove", handleMove);
      track.removeEventListener("pointerup", handleUp);
    };
    track.addEventListener("pointermove", handleMove);
    track.addEventListener("pointerup", handleUp);
  };

  const handleScrubKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        seekTo(currentTime + SEEK_STEP_SECONDS);
        break;
      case "ArrowLeft":
        event.preventDefault();
        seekTo(currentTime - SEEK_STEP_SECONDS);
        break;
      case "Home":
        event.preventDefault();
        seekTo(0);
        break;
      case "End":
        event.preventDefault();
        seekTo(duration);
        break;
      default:
        break;
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      <button
        aria-hidden={isOpen}
        aria-label={`Play ${title}`}
        className={cn(
          "group relative block w-full cursor-pointer overflow-hidden rounded-xl border border-border bg-muted text-left",
          className
        )}
        onClick={() => setOpen(true)}
        ref={triggerRef}
        tabIndex={isOpen ? -1 : 0}
        type="button"
      >
        <motion.div
          animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
          className="relative w-full"
          layoutId={shouldReduceMotion ? undefined : frameLayoutId}
          style={{ aspectRatio: thumbnailAspect }}
          transition={shouldReduceMotion ? { duration: 0 } : SPRING_PANEL}
        >
          {poster ? (
            <img
              alt=""
              className="size-full object-cover"
              height={720}
              src={poster}
              width={1280}
            />
          ) : (
            <div className="size-full bg-foreground/10" />
          )}
          <span className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/30">
            <span className="flex size-14 items-center justify-center rounded-full bg-white/90 text-black shadow-lg transition-transform group-hover:scale-105">
              <Play
                aria-hidden="true"
                fill="currentColor"
                size={THUMBNAIL_PLAY_ICON_SIZE}
              />
            </span>
          </span>
        </motion.div>
        <span className="sr-only">{title}</span>
      </button>

      {mounted
        ? createPortal(
            <AnimatePresence>
              {isOpen ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <motion.div
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    exit={{ opacity: 0 }}
                    initial={
                      shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }
                    }
                    onClick={close}
                    transition={{
                      duration: shouldReduceMotion ? 0 : BACKDROP_DURATION,
                    }}
                  />

                  <motion.div
                    animate={{ opacity: 1 }}
                    aria-label={title}
                    aria-modal="true"
                    className="relative z-10 w-full max-w-3xl overflow-hidden rounded-xl bg-black outline-none"
                    exit={
                      shouldReduceMotion
                        ? { opacity: 0, transition: { duration: 0 } }
                        : { opacity: 0 }
                    }
                    initial={
                      shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }
                    }
                    layoutId={shouldReduceMotion ? undefined : frameLayoutId}
                    ref={panelRef}
                    role="dialog"
                    tabIndex={-1}
                    transition={
                      shouldReduceMotion ? { duration: 0 } : SPRING_PANEL
                    }
                  >
                    {/* biome-ignore lint/a11y/useMediaCaption: the rule only recognises an unconditional <track> literal, so it cannot see the mapped tracks below. Satisfying it with an extra always-present <track> shipped one bogus empty caption track per video, which is worse than this suppression. */}
                    <video
                      className="block max-h-[80vh] w-full"
                      controls={!showCustomControls}
                      playsInline
                      poster={poster}
                      ref={videoRef}
                      src={src}
                    >
                      {captions.length > 0 ? (
                        captions.map((caption) => (
                          <track
                            key={caption.srcLang}
                            kind="captions"
                            label={caption.label}
                            src={caption.src}
                            srcLang={caption.srcLang}
                          />
                        ))
                      ) : (
                        <track kind="captions" />
                      )}
                    </video>

                    {showCustomControls ? (
                      <VideoModalControls
                        currentTime={currentTime}
                        duration={duration}
                        isFullscreen={isFullscreen}
                        isMuted={isMuted}
                        isPlaying={isPlaying}
                        onScrubKeyDown={handleScrubKeyDown}
                        onScrubPointerDown={handleScrubPointerDown}
                        onToggleFullscreen={toggleFullscreen}
                        onToggleMute={toggleMute}
                        onTogglePlay={togglePlay}
                        progress={progress}
                      />
                    ) : null}

                    <SmoothButton
                      aria-label="Close video"
                      className="absolute top-3 right-3 [--btn-fg:#fff] [--btn-hover:rgb(0_0_0/0.7)] [--btn:rgb(0_0_0/0.5)]"
                      onClick={close}
                      shape="pill"
                      size="icon-sm"
                      variant="solid"
                    >
                      <X aria-hidden="true" />
                    </SmoothButton>
                  </motion.div>
                </div>
              ) : null}
            </AnimatePresence>,
            document.body
          )
        : null}
    </>
  );
};

export default VideoModal;
