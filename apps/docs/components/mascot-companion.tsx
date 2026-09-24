"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Icon } from "./icon";

/** An opt-in aside, or an honest acknowledgement that a command was copied. */
export function MascotCompanion({
  copyText,
  message,
}: {
  copyText?: string;
  message: string;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [reaction, setReaction] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const attempt = useRef(0);
  const id = useId();
  const dismissWithFocus = useCallback(() => {
    if (ref.current?.contains(document.activeElement)) {
      trigger.current?.focus();
    }
    setOpen(false);
  }, []);

  useEffect(() => {
    // A result belongs only to the command that was actually copied.
    if (copyText !== undefined) {
      setCopied(false);
      setFailed(false);
      setOpen(false);
      setBusy(false);
    }
    return () => {
      attempt.current += 1;
    };
  }, [copyText]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const dismiss = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !ref.current?.contains(event.target)
      ) {
        setOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dismissWithFocus();
      }
    };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, dismissWithFocus]);

  const activate = async () => {
    if (copyText === undefined) {
      setOpen((value) => !value);
      setReaction((value) => value + 1);
      return;
    }
    const current = ++attempt.current;
    setBusy(true);
    setCopied(false);
    setFailed(false);
    try {
      await navigator.clipboard.writeText(copyText);
      if (current !== attempt.current) {
        return;
      }
      setCopied(true);
      setReaction((value) => value + 1);
    } catch {
      if (current !== attempt.current) {
        return;
      }
      setFailed(true);
    }
    if (current === attempt.current) {
      setBusy(false);
      setOpen(true);
    }
  };

  const isGreeting = copyText === undefined;
  if (isGreeting) {
    return (
      <div className="not-prose inline-flex shrink-0 items-center gap-2">
        <Icon className="h-6 w-auto shrink-0" />
        <span className="mt-0.5 select-none font-medium font-title text-foreground text-xl leading-none">
          Smooth<span className="text-brand">UI</span>
        </span>
      </div>
    );
  }

  const label = "Copy command";
  const buttonLabel = copied ? "Command copied" : label;
  const comment = failed
    ? "Clipboard unavailable. Select the command below to copy it manually."
    : message;
  return (
    <div className="not-prose relative inline-flex shrink-0" ref={ref}>
      <button
        aria-describedby={open ? id : undefined}
        aria-expanded={open}
        className="inline-flex min-h-11 w-36 cursor-pointer items-center gap-2 rounded-lg px-2 text-muted-foreground text-xs transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 disabled:cursor-wait"
        disabled={busy}
        onClick={activate}
        ref={trigger}
        type="button"
      >
        <Icon
          className="h-7 w-auto shrink-0"
          expression={open && !failed ? "happy" : undefined}
          reactionKey={reaction}
        />
        <span className="whitespace-nowrap">{buttonLabel}</span>
      </button>
      <span className="sr-only" role="status">
        {copied ? "Command copied to clipboard." : null}
        {failed ? "Copy failed. Select the command to copy it manually." : null}
      </span>
      {open ? (
        <div
          className="not-prose absolute right-0 bottom-full z-50 mb-2 w-56 rounded-xl border border-border bg-popover p-3 text-popover-foreground text-xs leading-relaxed shadow-lg"
          id={id}
        >
          <p className="m-0">{comment}</p>
          <button
            className="mt-1 min-h-8 cursor-pointer underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring"
            onClick={dismissWithFocus}
            type="button"
          >
            Dismiss
          </button>
        </div>
      ) : null}
    </div>
  );
}
