"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { ArrowUp, Paperclip, Square, X } from "lucide-react";
import {
  AnimatePresence,
  type MotionStyle,
  motion,
  type Transition,
  useReducedMotion,
} from "motion/react";
import {
  type ChangeEvent,
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  type AIState,
  getAIStateAccentColor,
  getAIStateMotion,
} from "../ai-core";

const SUBMIT_ICON_SIZE = 17;
const STOP_ICON_SIZE = 13;

const MIN_ROWS = 1;
const MAX_ROWS = 8;
const COUNTER_VISIBLE_RATIO = 0.8;
const SPRING_DEFAULT: Transition = {
  bounce: 0.1,
  duration: 0.25,
  type: "spring",
};
const SPRING_SNAPPY: Transition = {
  bounce: 0,
  duration: 0.2,
  type: "spring",
};
const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const ATTACHMENT_STAGGER = 0.035;

export type AIPromptAttachment = {
  id: string;
  /** Bytes. Rendered as a human-readable size when present. */
  size?: number;
  name: string;
};

export type AIPromptInputProps = {
  /** Files already attached to the draft. */
  attachments?: AIPromptAttachment[];
  /** Extra controls rendered on the left of the toolbar — model pickers etc. */
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  /** Shows a counter once the draft passes 80% of the limit. */
  maxLength?: number;
  onAttach?: () => void;
  onRemoveAttachment?: (id: string) => void;
  /** Called when the submit control is pressed while `state` is `streaming`. */
  onStop?: () => void;
  onSubmit?: (value: string) => void;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  /** Shared AI state. `streaming` turns submit into stop. */
  state?: AIState;
  /** Controlled draft. Leave undefined to let the component own it. */
  value?: string;
};

const formatSize = (bytes: number): string => {
  const kilobyte = 1024;
  if (bytes < kilobyte) {
    return `${bytes} B`;
  }
  const megabyte = kilobyte * kilobyte;
  if (bytes < megabyte) {
    return `${Math.round(bytes / kilobyte)} KB`;
  }
  return `${(bytes / megabyte).toFixed(1)} MB`;
};

/**
 * The prompt composer.
 *
 * Growth is animated with a layout spring rather than a CSS height transition,
 * so a pasted paragraph settles instead of snapping — and because the height is
 * measured from the textarea's own scroll height, the surrounding page never
 * reflows mid-keystroke.
 */
const AIPromptInput = ({
  attachments = [],
  children,
  className,
  disabled = false,
  maxLength,
  onAttach,
  onRemoveAttachment,
  onStop,
  onSubmit,
  onValueChange,
  placeholder = "Ask anything…",
  state = "idle",
  value,
}: AIPromptInputProps) => {
  const shouldReduceMotion = useReducedMotion();
  const stateMotion = getAIStateMotion(state);
  const accentColor = getAIStateAccentColor(state, "transparent");

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [internalValue, setInternalValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const isControlled = value !== undefined;
  const draft = isControlled ? value : internalValue;
  const isStreaming = state === "streaming";
  const canSubmit = draft.trim().length > 0 && !disabled;

  const resize = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }
    // Collapse first, otherwise scrollHeight only ever grows.
    textarea.style.height = "auto";
    const lineHeight = Number.parseFloat(
      getComputedStyle(textarea).lineHeight || "20"
    );
    const maxHeight = lineHeight * MAX_ROWS;
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
    textarea.style.overflowY =
      textarea.scrollHeight > maxHeight ? "auto" : "hidden";
  }, []);

  useLayoutEffect(() => {
    // Collapsing on an empty draft matters after submit: the box has to return
    // to one row instead of holding the height of the message just sent.
    if (draft.length === 0 && textareaRef.current) {
      textareaRef.current.style.height = "";
    }
    resize();
  }, [draft, resize]);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const next = event.target.value;
    if (!isControlled) {
      setInternalValue(next);
    }
    onValueChange?.(next);
  };

  const submit = () => {
    if (isStreaming) {
      onStop?.();
      return;
    }
    if (!canSubmit) {
      return;
    }
    onSubmit?.(draft.trim());
    if (!isControlled) {
      setInternalValue("");
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter sends, Shift+Enter breaks the line — the convention every chat UI
    // has trained users on.
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  const counterVisible =
    maxLength !== undefined &&
    draft.length >= maxLength * COUNTER_VISIBLE_RATIO;
  const overLimit = maxLength !== undefined && draft.length > maxLength;

  return (
    <motion.div
      className={cn(
        "relative w-full rounded-2xl border bg-background",
        isFocused ? "border-foreground/40" : "border-border",
        disabled && "opacity-60",
        className
      )}
      layout={shouldReduceMotion ? false : "position"}
      style={
        {
          // The accent ring is the only place status shows here: a composer that
          // changes shape per state would fight the text the user is writing.
          boxShadow:
            state === "error" || state === "done"
              ? `0 0 0 1px ${accentColor}`
              : undefined,
        } as MotionStyle
      }
      transition={shouldReduceMotion ? { duration: 0 } : SPRING_DEFAULT}
    >
      <AnimatePresence initial={false}>
        {attachments.length > 0 && (
          <motion.ul
            animate={{ height: "auto", opacity: 1 }}
            className="flex list-none flex-wrap gap-2 overflow-hidden px-3 pt-3"
            exit={
              shouldReduceMotion
                ? { opacity: 0, transition: { duration: 0 } }
                : { height: 0, opacity: 0 }
            }
            initial={
              shouldReduceMotion
                ? { height: "auto", opacity: 1 }
                : { height: 0, opacity: 0 }
            }
            transition={shouldReduceMotion ? { duration: 0 } : SPRING_DEFAULT}
          >
            {attachments.map((attachment, index) => (
              <motion.li
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 py-1 pr-1 pl-2 text-xs"
                exit={
                  shouldReduceMotion
                    ? { opacity: 0, transition: { duration: 0 } }
                    : { opacity: 0, scale: 0.9 }
                }
                initial={
                  shouldReduceMotion
                    ? { opacity: 1, scale: 1, y: 0 }
                    : { opacity: 0, scale: 0.9, y: 4 }
                }
                key={attachment.id}
                layout={!shouldReduceMotion}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { ...SPRING_DEFAULT, delay: index * ATTACHMENT_STAGGER }
                }
              >
                <span className="max-w-40 truncate">{attachment.name}</span>
                {attachment.size !== undefined && (
                  <span className="text-muted-foreground">
                    {formatSize(attachment.size)}
                  </span>
                )}
                {onRemoveAttachment && (
                  <button
                    aria-label={`Remove ${attachment.name}`}
                    className="cursor-pointer rounded-md p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    onClick={() => onRemoveAttachment(attachment.id)}
                    type="button"
                  >
                    <X aria-hidden="true" size={12} />
                  </button>
                )}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      <textarea
        className="max-h-64 w-full resize-none bg-transparent px-4 pt-3 pb-2 text-sm outline-none placeholder:text-muted-foreground"
        disabled={disabled}
        onBlur={() => setIsFocused(false)}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        ref={textareaRef}
        rows={MIN_ROWS}
        value={draft}
      />

      <div className="flex items-center justify-between gap-2 px-2 pb-2">
        <div className="flex min-w-0 items-center gap-1">
          {onAttach && (
            <button
              aria-label="Attach a file"
              className="cursor-pointer rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              disabled={disabled}
              onClick={onAttach}
              type="button"
            >
              <Paperclip aria-hidden="true" size={16} />
            </button>
          )}
          {children}
        </div>

        <div className="flex items-center gap-2">
          <AnimatePresence initial={false}>
            {counterVisible && (
              <motion.span
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "text-xs tabular-nums",
                  overLimit ? "text-destructive" : "text-muted-foreground"
                )}
                exit={
                  shouldReduceMotion
                    ? { opacity: 0, transition: { duration: 0 } }
                    : { opacity: 0, y: 4 }
                }
                initial={
                  shouldReduceMotion
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 4 }
                }
                transition={
                  shouldReduceMotion ? { duration: 0 } : SPRING_SNAPPY
                }
              >
                {draft.length}/{maxLength}
              </motion.span>
            )}
          </AnimatePresence>

          <AIPromptSubmit
            disabled={disabled || !(canSubmit || isStreaming)}
            isStreaming={isStreaming}
            onClick={submit}
            shouldReduceMotion={Boolean(shouldReduceMotion)}
            speed={stateMotion.speed}
          />
        </div>
      </div>
    </motion.div>
  );
};

type AIPromptSubmitProps = {
  disabled: boolean;
  isStreaming: boolean;
  onClick: () => void;
  shouldReduceMotion: boolean;
  speed: number;
};

const AIPromptSubmit = ({
  disabled,
  isStreaming,
  onClick,
  shouldReduceMotion,
  speed,
}: AIPromptSubmitProps) => (
  <motion.button
    aria-label={isStreaming ? "Stop generating" : "Send message"}
    className={cn(
      "flex size-9 items-center justify-center rounded-xl",
      disabled
        ? "bg-muted text-muted-foreground"
        : "bg-foreground text-background"
    )}
    disabled={disabled}
    onClick={onClick}
    transition={shouldReduceMotion ? { duration: 0 } : SPRING_DEFAULT}
    type="button"
    whileHover={disabled || shouldReduceMotion ? undefined : { scale: 1.05 }}
    whileTap={disabled || shouldReduceMotion ? undefined : { scale: 0.95 }}
  >
    {/* Real lucide glyphs, swapped rather than morphed.
        An earlier version interpolated one hand-authored `d` into another, which
        bought a nice fold at the cost of not being a lucide icon at all — and a
        filled wedge reads as "play", not "send". A thin stroked arrow is the
        convention, and lucide's own geometry is what the rest of the library
        uses. The swap is scale-and-fade so it still reads as one control. */}
    <AnimatePresence initial={false} mode="popLayout">
      <motion.span
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-center"
        exit={
          shouldReduceMotion
            ? { opacity: 0, transition: { duration: 0 } }
            : { opacity: 0, scale: 0.6 }
        }
        initial={
          shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.6 }
        }
        key={isStreaming ? "stop" : "send"}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { duration: 0.18 / speed, ease: EASE_OUT }
        }
      >
        {isStreaming ? (
          <Square
            aria-hidden="true"
            className="fill-current"
            size={STOP_ICON_SIZE}
            strokeWidth={0}
          />
        ) : (
          <ArrowUp aria-hidden="true" size={SUBMIT_ICON_SIZE} />
        )}
      </motion.span>
    </AnimatePresence>
  </motion.button>
);

export default AIPromptInput;
