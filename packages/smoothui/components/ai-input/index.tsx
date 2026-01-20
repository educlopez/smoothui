"use client";

import { Button } from "@repo/shadcn-ui/components/ui/button";
import { cx } from "class-variance-authority";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import React from "react";
import SiriOrb from "../siri-orb";
import { useClickOutside } from "./use-click-outside";

const SPEED = 1;
const SUCCESS_DURATION = 1500;
const DOCK_HEIGHT = 44;
const FEEDBACK_BORDER_RADIUS = 14;
const DOCK_BORDER_RADIUS = 20;
const SPRING_STIFFNESS = 550;
const SPRING_DAMPING = 45;
const SPRING_MASS = 0.7;
const CLOSE_DELAY = 0.08;

type FooterContext = {
  showFeedback: boolean;
  success: boolean;
  openFeedback: () => void;
  closeFeedback: () => void;
};

const FooterContext = React.createContext({} as FooterContext);
const useFooter = () => React.useContext(FooterContext);

export function MorphSurface() {
  const rootRef = React.useRef<HTMLDivElement>(null);

  const feedbackRef = React.useRef<HTMLTextAreaElement | null>(null);
  const [showFeedback, setShowFeedback] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const shouldReduceMotion = useReducedMotion();

  const closeFeedback = React.useCallback(() => {
    setShowFeedback(false);
    feedbackRef.current?.blur();
  }, []);

  const openFeedback = React.useCallback(() => {
    setShowFeedback(true);
    setTimeout(() => {
      feedbackRef.current?.focus();
    });
  }, []);

  const onFeedbackSuccess = React.useCallback(() => {
    closeFeedback();
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, SUCCESS_DURATION);
  }, [closeFeedback]);

  useClickOutside(rootRef, closeFeedback);

  const context = React.useMemo(
    () => ({
      showFeedback,
      success,
      openFeedback,
      closeFeedback,
    }),
    [showFeedback, success, openFeedback, closeFeedback]
  );

  return (
    <div
      className="flex items-center justify-center"
      style={{
        width: FEEDBACK_WIDTH,
        height: FEEDBACK_HEIGHT,
      }}
    >
      <motion.div
        animate={
          shouldReduceMotion
            ? {}
            : {
                width: showFeedback ? FEEDBACK_WIDTH : "auto",
                height: showFeedback ? FEEDBACK_HEIGHT : DOCK_HEIGHT,
                borderRadius: showFeedback
                  ? FEEDBACK_BORDER_RADIUS
                  : DOCK_BORDER_RADIUS,
              }
        }
        className={cx(
          "relative bottom-8 z-3 flex flex-col items-center overflow-hidden border bg-background max-sm:bottom-5"
        )}
        data-footer
        initial={false}
        ref={rootRef}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : {
                type: "spring",
                stiffness: SPRING_STIFFNESS / SPEED,
                damping: SPRING_DAMPING,
                mass: SPRING_MASS,
                delay: showFeedback ? 0 : CLOSE_DELAY,
                duration: 0.25,
              }
        }
      >
        <FooterContext.Provider value={context}>
          <Dock />
          <Feedback onSuccess={onFeedbackSuccess} ref={feedbackRef} />
        </FooterContext.Provider>
      </motion.div>
    </div>
  );
}

function Dock() {
  const { showFeedback, openFeedback } = useFooter();
  const shouldReduceMotion = useReducedMotion();
  return (
    <footer className="mt-auto flex h-[44px] select-none items-center justify-center whitespace-nowrap">
      <div className="flex items-center justify-center gap-2 px-3 max-sm:h-10 max-sm:px-2">
        <div className="flex w-fit items-center gap-2">
          <AnimatePresence mode="wait">
            {showFeedback ? (
              <motion.div
                animate={shouldReduceMotion ? {} : { opacity: 0 }}
                className="h-5 w-5"
                exit={shouldReduceMotion ? {} : { opacity: 0 }}
                initial={shouldReduceMotion ? {} : { opacity: 0 }}
                key="placeholder"
                transition={
                  shouldReduceMotion ? { duration: 0 } : { duration: 0.2 }
                }
              />
            ) : (
              <motion.div
                animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1 }}
                exit={
                  shouldReduceMotion
                    ? { opacity: 0, transition: { duration: 0 } }
                    : { opacity: 0 }
                }
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                key="siri-orb"
                transition={
                  shouldReduceMotion ? { duration: 0 } : { duration: 0.2 }
                }
              >
                <SiriOrb
                  colors={{
                    bg: "oklch(22.64% 0 0)",
                  }}
                  size="24px"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Button
          className="flex h-fit flex-1 justify-end rounded-full px-2 py-0.5!"
          onClick={openFeedback}
          type="button"
          variant="ghost"
        >
          <span className="truncate">Ask AI</span>
        </Button>
      </div>
    </footer>
  );
}

const FEEDBACK_WIDTH = 360;
const FEEDBACK_HEIGHT = 200;

function Feedback({
  ref,
  onSuccess,
}: {
  ref: React.Ref<HTMLTextAreaElement>;
  onSuccess: () => void;
}) {
  const { closeFeedback, showFeedback } = useFooter();
  const shouldReduceMotion = useReducedMotion();
  const submitRef = React.useRef<HTMLButtonElement>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSuccess();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Escape") {
      closeFeedback();
    }
    if (e.key === "Enter" && e.metaKey) {
      e.preventDefault();
      submitRef.current?.click();
    }
  }

  return (
    <form
      className="absolute bottom-0"
      onSubmit={onSubmit}
      style={{
        width: FEEDBACK_WIDTH,
        height: FEEDBACK_HEIGHT,
        pointerEvents: showFeedback ? "all" : "none",
      }}
    >
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1 }}
            className="flex h-full flex-col p-1"
            exit={
              shouldReduceMotion
                ? { opacity: 0, transition: { duration: 0 } }
                : { opacity: 0 }
            }
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : {
                    type: "spring",
                    stiffness: SPRING_STIFFNESS / SPEED,
                    damping: SPRING_DAMPING,
                    mass: SPRING_MASS,
                    duration: 0.25,
                  }
            }
          >
            <div className="flex justify-between py-1">
              <p className="z-2 ml-[38px] flex select-none items-center gap-[6px] text-foreground">
                AI Input
              </p>
              <button
                className="-translate-y-[3px] right-4 mt-1 flex cursor-pointer select-none items-center justify-center gap-1 rounded-[12px] bg-transparent pr-1 text-center text-foreground"
                ref={submitRef}
                type="submit"
              >
                <Kbd>⌘</Kbd>
                <Kbd className="w-fit">Enter</Kbd>
              </button>
            </div>
            <textarea
              className="h-full w-full resize-none scroll-py-2 rounded-md bg-primary p-4 outline-0"
              name="message"
              onKeyDown={onKeyDown}
              placeholder="Ask me anything..."
              ref={ref}
              required
              spellCheck={false}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1 }}
            className="absolute top-2 left-3"
            exit={
              shouldReduceMotion
                ? { opacity: 0, transition: { duration: 0 } }
                : { opacity: 0 }
            }
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            transition={
              shouldReduceMotion ? { duration: 0 } : { duration: 0.2 }
            }
          >
            <SiriOrb
              colors={{
                bg: "oklch(22.64% 0 0)",
              }}
              size="24px"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}

function Kbd({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <kbd
      className={cx(
        "flex h-6 w-fit items-center justify-center rounded-sm border bg-primary px-[6px] font-sans text-foreground",
        className
      )}
    >
      {children}
    </kbd>
  );
}

// Add default export for lazy loading
export default MorphSurface;
