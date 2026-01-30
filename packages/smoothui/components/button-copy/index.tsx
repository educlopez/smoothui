"use client";

import { Check, Copy, LoaderCircle } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type ReactNode, useCallback, useState } from "react";

export interface ButtonCopyProps {
  onCopy?: () => Promise<void> | void;
  idleIcon?: ReactNode;
  loadingIcon?: ReactNode;
  successIcon?: ReactNode;
  className?: string;
  duration?: number;
  loadingDuration?: number;
  disabled?: boolean;
}

const defaultIcons = {
  idle: <Copy size={16} />,
  loading: <LoaderCircle className="animate-spin" size={16} />,
  success: <Check size={16} />,
};

export default function ButtonCopy({
  onCopy,
  idleIcon = defaultIcons.idle,
  loadingIcon = defaultIcons.loading,
  successIcon = defaultIcons.success,
  className = "",
  duration = 2000,
  loadingDuration = 1000,
  disabled = false,
}: ButtonCopyProps) {
  const [buttonState, setButtonState] = useState<
    "idle" | "loading" | "success"
  >("idle");
  const shouldReduceMotion = useReducedMotion();

  const handleClick = useCallback(async () => {
    setButtonState("loading");
    if (onCopy) {
      await onCopy();
    }
    setTimeout(() => {
      setButtonState("success");
    }, loadingDuration);
    setTimeout(() => {
      setButtonState("idle");
    }, loadingDuration + duration);
  }, [onCopy, loadingDuration, duration]);

  const icons = {
    idle: idleIcon,
    loading: loadingIcon,
    success: successIcon,
  };

  const ariaLabels = {
    idle: "Copy",
    loading: "Copying...",
    success: "Copied",
  };

  return (
    <div className="flex justify-center">
      <button
        aria-label={ariaLabels[buttonState]}
        aria-live="polite"
        className={`relative min-h-[44px] w-auto min-w-[44px] cursor-pointer overflow-hidden rounded-full border bg-background p-3 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 ${className}`}
        disabled={buttonState !== "idle" || disabled}
        onClick={handleClick}
        type="button"
      >
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            animate={
              shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 1, y: 0, filter: "blur(0px)" }
            }
            className="flex w-full items-center justify-center"
            exit={
              shouldReduceMotion
                ? { opacity: 0, transition: { duration: 0 } }
                : { opacity: 0, y: 25, filter: "blur(10px)" }
            }
            initial={
              shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 0, y: -25, filter: "blur(10px)" }
            }
            key={buttonState}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { type: "spring", duration: 0.25, bounce: 0 }
            }
          >
            {icons[buttonState]}
          </motion.span>
        </AnimatePresence>
      </button>
    </div>
  );
}
