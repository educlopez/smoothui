"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { useReducedMotion } from "motion/react";
import {
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const DEFAULT_PROMPT = "~ %";
const DEFAULT_TITLE = "Terminal";
const DEFAULT_TYPING_SPEED = 24;
const DEFAULT_MAX_HEIGHT = 360;
const TICK_MS = 40;
const LOOP_PAUSE_MS = 1500;
const OUTPUT_DEFAULT_DELAY_MS = 200;
const INTERSECTION_THRESHOLD = 0.35;
const KEY_ENTER = "Enter";
const KEY_SPACE = " ";
const TRAFFIC_LIGHT_CLASS = "size-3 rounded-full";

export type TerminalLineType =
  | "command"
  | "output"
  | "error"
  | "success"
  | "comment";

export interface TerminalLine {
  delay?: number;
  id: string;
  text: string;
  type: TerminalLineType;
}

export type MacTerminalTheme = "dark" | "light" | "auto";

export interface MacTerminalProps {
  autoPlay?: boolean;
  className?: string;
  lines: TerminalLine[];
  loop?: boolean;
  maxHeight?: number | string;
  onClose?: () => void;
  onComplete?: () => void;
  onMinimize?: () => void;
  prompt?: string;
  showTrafficLights?: boolean;
  theme?: MacTerminalTheme;
  title?: string;
  typingSpeed?: number;
}

type MachinePhase = "delay" | "typing";

interface Machine {
  finished: boolean;
  lineIndex: number;
  phase: MachinePhase;
  phaseElapsed: number;
}

interface TypingDraft {
  chars: number;
  line: TerminalLine;
}

interface ThemeStyle {
  body: string;
  border: string;
  caret: string;
  chrome: string;
  command: string;
  comment: string;
  error: string;
  output: string;
  prompt: string;
  success: string;
  title: string;
}

const THEME_STYLES: Record<"dark" | "light", ThemeStyle> = {
  dark: {
    body: "bg-zinc-950 text-zinc-100",
    border: "border-white/10",
    caret: "bg-emerald-400",
    chrome: "bg-zinc-900",
    command: "text-zinc-50",
    comment: "text-zinc-500",
    error: "text-red-400",
    output: "text-zinc-300",
    prompt: "text-emerald-400",
    success: "text-emerald-400",
    title: "text-zinc-400",
  },
  light: {
    body: "bg-white text-zinc-800",
    border: "border-zinc-200",
    caret: "bg-indigo-500",
    chrome: "bg-zinc-100",
    command: "text-zinc-900",
    comment: "text-zinc-400",
    error: "text-red-600",
    output: "text-zinc-600",
    prompt: "text-indigo-600",
    success: "text-emerald-600",
    title: "text-zinc-500",
  },
};

const createMachine = (): Machine => ({
  finished: false,
  lineIndex: 0,
  phase: "delay",
  phaseElapsed: 0,
});

const getLineToneClass = (
  type: TerminalLineType,
  styles: ThemeStyle
): string => {
  switch (type) {
    case "error":
      return styles.error;
    case "success":
      return styles.success;
    case "comment":
      return styles.comment;
    case "command":
      return styles.command;
    default:
      return styles.output;
  }
};

export default function MacTerminal({
  autoPlay = true,
  className,
  lines,
  loop = false,
  maxHeight = DEFAULT_MAX_HEIGHT,
  onClose,
  onComplete,
  onMinimize,
  prompt = DEFAULT_PROMPT,
  showTrafficLights = true,
  theme = "dark",
  title = DEFAULT_TITLE,
  typingSpeed = DEFAULT_TYPING_SPEED,
}: MacTerminalProps) {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const machineRef = useRef<Machine>(createMachine());
  const shouldPlayRef = useRef(false);
  const linesRef = useRef(lines);
  const loopRef = useRef(loop);
  const onCompleteRef = useRef(onComplete);
  const typingSpeedRef = useRef(
    typingSpeed > 0 ? typingSpeed : DEFAULT_TYPING_SPEED
  );
  const calledOnCompleteRef = useRef(false);

  linesRef.current = lines;
  loopRef.current = loop;
  onCompleteRef.current = onComplete;
  typingSpeedRef.current = typingSpeed > 0 ? typingSpeed : DEFAULT_TYPING_SPEED;

  const [completedLines, setCompletedLines] = useState<TerminalLine[]>([]);
  const [typingDraft, setTypingDraft] = useState<TypingDraft | null>(null);
  const [hasStarted, setHasStarted] = useState(autoPlay);
  const [isInView, setIsInView] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [systemPrefersDark, setSystemPrefersDark] = useState(true);

  const isInteractive = !(autoPlay || hasStarted || shouldReduceMotion);
  const resolvedTheme: "dark" | "light" =
    theme === "auto" ? (systemPrefersDark ? "dark" : "light") : theme;
  const styles = THEME_STYLES[resolvedTheme];
  const resolvedMaxHeight =
    typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight;
  const hasLightHandlers = Boolean(onClose || onMinimize);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry?.isIntersecting ?? false);
      },
      { threshold: INTERSECTION_THRESHOLD }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageVisible(document.visibilityState === "visible");
    };

    handleVisibilityChange();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    if (theme !== "auto" || typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemPrefersDark(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setSystemPrefersDark(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  useEffect(() => {
    shouldPlayRef.current = hasStarted && isInView && isPageVisible;
  }, [hasStarted, isInView, isPageVisible]);

  useEffect(() => {
    if (!shouldReduceMotion) {
      return;
    }

    setCompletedLines(lines);
    setTypingDraft(null);

    if (!calledOnCompleteRef.current) {
      calledOnCompleteRef.current = true;
      onComplete?.();
    }
  }, [shouldReduceMotion, lines, onComplete]);

  useEffect(() => {
    if (shouldReduceMotion) {
      return;
    }

    let loopTimeout = 0;

    const tick = () => {
      if (!shouldPlayRef.current) {
        return;
      }

      const machine = machineRef.current;
      if (machine.finished) {
        return;
      }

      const currentLines = linesRef.current;
      if (machine.lineIndex >= currentLines.length) {
        machine.finished = true;
        onCompleteRef.current?.();

        if (loopRef.current) {
          loopTimeout = window.setTimeout(() => {
            machineRef.current = createMachine();
            setCompletedLines([]);
            setTypingDraft(null);
          }, LOOP_PAUSE_MS);
        }
        return;
      }

      const line = currentLines[machine.lineIndex];
      const isCommand = line.type === "command";
      const delay = line.delay ?? (isCommand ? 0 : OUTPUT_DEFAULT_DELAY_MS);

      machine.phaseElapsed += TICK_MS;

      if (machine.phase === "delay") {
        if (machine.phaseElapsed < delay) {
          return;
        }

        if (isCommand) {
          machine.phase = "typing";
          machine.phaseElapsed = 0;
          setTypingDraft({ chars: 0, line });
        } else {
          setCompletedLines((prev) => [...prev, line]);
          machine.lineIndex += 1;
          machine.phase = "delay";
          machine.phaseElapsed = 0;
        }
        return;
      }

      const msPerChar = 1000 / typingSpeedRef.current;
      const charsToShow = Math.min(
        line.text.length,
        Math.floor(machine.phaseElapsed / msPerChar)
      );
      setTypingDraft({ chars: charsToShow, line });

      if (charsToShow >= line.text.length) {
        setCompletedLines((prev) => [...prev, line]);
        setTypingDraft(null);
        machine.lineIndex += 1;
        machine.phase = "delay";
        machine.phaseElapsed = 0;
      }
    };

    const interval = window.setInterval(tick, TICK_MS);
    return () => {
      window.clearInterval(interval);
      window.clearTimeout(loopTimeout);
    };
  }, [shouldReduceMotion]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }
    el.scrollTop = el.scrollHeight;
  }, [completedLines, typingDraft]);

  const handleActivate = useCallback(() => {
    setHasStarted(true);
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (!isInteractive) {
        return;
      }
      if (event.key === KEY_ENTER || event.key === KEY_SPACE) {
        event.preventDefault();
        handleActivate();
      }
    },
    [handleActivate, isInteractive]
  );

  const showIdleHint =
    isInteractive && completedLines.length === 0 && !typingDraft;

  return (
    <div
      aria-label={`${title} terminal`}
      className={cn(
        "overflow-hidden rounded-xl border shadow-lg",
        styles.border,
        isInteractive &&
          "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
        className
      )}
      onClick={isInteractive ? handleActivate : undefined}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      ref={containerRef}
      role={isInteractive ? "button" : "group"}
      tabIndex={isInteractive ? 0 : undefined}
    >
      <div
        className={cn(
          "flex items-center gap-3 border-b px-4 py-2.5",
          styles.chrome,
          styles.border
        )}
      >
        {showTrafficLights ? (
          <div
            aria-hidden={hasLightHandlers ? undefined : "true"}
            className="flex items-center gap-2"
          >
            {onClose ? (
              <button
                aria-label="Close terminal"
                className={cn(
                  TRAFFIC_LIGHT_CLASS,
                  "bg-[#ff5f57] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                )}
                onClick={(event) => {
                  event.stopPropagation();
                  onClose();
                }}
                type="button"
              />
            ) : (
              <span
                aria-hidden="true"
                className={cn(TRAFFIC_LIGHT_CLASS, "bg-[#ff5f57]")}
              />
            )}
            {onMinimize ? (
              <button
                aria-label="Minimize terminal"
                className={cn(
                  TRAFFIC_LIGHT_CLASS,
                  "bg-[#febc2e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                )}
                onClick={(event) => {
                  event.stopPropagation();
                  onMinimize();
                }}
                type="button"
              />
            ) : (
              <span
                aria-hidden="true"
                className={cn(TRAFFIC_LIGHT_CLASS, "bg-[#febc2e]")}
              />
            )}
            <span
              aria-hidden="true"
              className={cn(TRAFFIC_LIGHT_CLASS, "bg-[#28c840]")}
            />
          </div>
        ) : null}
        <p
          className={cn(
            "flex-1 truncate text-center font-medium text-xs",
            styles.title
          )}
        >
          {title}
        </p>
        {showTrafficLights ? (
          <span aria-hidden="true" className="w-14" />
        ) : null}
      </div>

      <div
        className={cn(
          "overflow-y-auto px-4 py-3 font-mono text-xs leading-relaxed sm:text-sm",
          styles.body
        )}
        ref={scrollRef}
        style={{ maxHeight: resolvedMaxHeight }}
      >
        <pre
          aria-hidden={shouldReduceMotion ? undefined : "true"}
          className="whitespace-pre-wrap break-words font-mono"
        >
          {completedLines.map((line) => (
            <div className="flex flex-wrap gap-2" key={line.id}>
              {line.type === "command" ? (
                <>
                  <span className={styles.prompt}>{prompt}</span>
                  <span className={styles.command}>{line.text}</span>
                </>
              ) : (
                <span className={getLineToneClass(line.type, styles)}>
                  {line.text}
                </span>
              )}
            </div>
          ))}
          {typingDraft ? (
            <div className="flex flex-wrap gap-2">
              <span className={styles.prompt}>{prompt}</span>
              <span className={styles.command}>
                {typingDraft.line.text.slice(0, typingDraft.chars)}
                <span
                  aria-hidden="true"
                  className={cn(
                    "mac-terminal-caret ml-0.5 inline-block h-[1em] w-[0.55em] translate-y-[0.15em] align-middle",
                    styles.caret
                  )}
                />
              </span>
            </div>
          ) : null}
          {showIdleHint ? (
            <span className={styles.comment}>
              Click or press Enter to run this session
            </span>
          ) : null}
        </pre>
        {!shouldReduceMotion && (
          <div aria-live="off" className="sr-only">
            <pre className="whitespace-pre-wrap">
              {lines.map((line) => line.text).join("\n")}
            </pre>
          </div>
        )}
      </div>

      {!shouldReduceMotion && (
        <style>{`
          @keyframes mac-terminal-caret-blink {
            0%, 49% { opacity: 1; }
            50%, 100% { opacity: 0; }
          }
          .mac-terminal-caret {
            animation: mac-terminal-caret-blink 1s steps(1) infinite;
          }
        `}</style>
      )}
    </div>
  );
}
