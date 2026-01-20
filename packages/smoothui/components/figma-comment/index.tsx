"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/shadcn-ui/components/ui/avatar";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { getImageKitUrl } from "@smoothui/data";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useClickOutside } from "./use-click-outside";

const CLOSED_SIZE = 32;
const AVATAR_CLOSED_LEFT = 4;
const AVATAR_CLOSED_TOP = 4;
const AVATAR_OPEN_LEFT = 12;
const AVATAR_OPEN_TOP = 12;
const CONTENT_DELAY = 0.15;
const INITIAL_BLUR_PX = 6;
const EXIT_BLUR_PX = 3;
const MEASURE_DELAY_SHORT = 100;
const MEASURE_DELAY_LONG = 500;
const CONTAINER_CLOSE_DELAY = 0.08;
const BLUR_DURATION = 0.4;
const BLUR_EASE_X1 = 0.22;
const BLUR_EASE_Y1 = 1;
const BLUR_EASE_X2 = 0.36;
const BLUR_EASE_Y2 = 1;
const BLUR_EASE: [number, number, number, number] = [
  BLUR_EASE_X1,
  BLUR_EASE_Y1,
  BLUR_EASE_X2,
  BLUR_EASE_Y2,
];

export type FigmaCommentProps = {
  avatarUrl?: string;
  avatarAlt?: string;
  className?: string;
  authorName?: string;
  timestamp?: string;
  message?: string;
  width?: number;
  onOpenChange?: (isOpen: boolean) => void;
};

export default function FigmaComment({
  avatarUrl = getImageKitUrl(
    "https://ik.imagekit.io/16u211libb/avatar-educalvolpz.jpeg?updatedAt=1765524159631",
    {
      width: 48,
      height: 48,
      quality: 85,
      format: "auto",
    }
  ),
  avatarAlt = "Avatar",
  className,
  authorName = "Edu Calvo",
  timestamp = "Just now",
  message = "What happens if we adjust this to handle a light and dark mode? I'm not sure if we're ready to handle...",
  width = 180,
  onOpenChange,
}: FigmaCommentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(CLOSED_SIZE);
  const shouldReduceMotion = useReducedMotion();

  // Close comment when clicking outside
  useClickOutside(containerRef, () => {
    if (isOpen) {
      setIsOpen(false);
    }
  });

  // Notify parent of open state changes
  useEffect(() => {
    onOpenChange?.(isOpen);
  }, [isOpen, onOpenChange]);

  // Measure content height when component mounts or message changes
  useEffect(() => {
    const measureHeight = () => {
      if (contentRef.current) {
        const innerDiv = contentRef.current.firstElementChild as HTMLElement;
        if (innerDiv) {
          const height = innerDiv.scrollHeight;
          if (height > 0) {
            setContentHeight(height);
          }
        }
      }
    };

    // Use setTimeout to ensure DOM is fully rendered
    const timeoutId = setTimeout(measureHeight, MEASURE_DELAY_SHORT);
    const timeoutId2 = setTimeout(measureHeight, MEASURE_DELAY_LONG);
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(timeoutId2);
    };
  }, []);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className={cn("relative", className)}>
      <motion.div
        animate={
          shouldReduceMotion
            ? {}
            : {
                width: isOpen ? width : CLOSED_SIZE,
                height: isOpen ? contentHeight : CLOSED_SIZE,
              }
        }
        className="absolute bottom-0 left-0 cursor-pointer overflow-hidden rounded-2xl rounded-bl-none bg-background shadow-[0px_0px_0.5px_0px_rgba(0,0,0,0.18),0px_3px_8px_0px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)]"
        onClick={handleToggle}
        ref={containerRef}
        style={
          shouldReduceMotion
            ? {
                width: isOpen ? width : CLOSED_SIZE,
                height: isOpen ? contentHeight : CLOSED_SIZE,
              }
            : undefined
        }
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : {
                type: "spring",
                stiffness: 550,
                damping: 45,
                mass: 0.7,
                delay: isOpen ? 0 : CONTAINER_CLOSE_DELAY,
                duration: 0.25,
              }
        }
      >
        {/* Avatar - animates position */}
        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : {
                  left: isOpen ? AVATAR_OPEN_LEFT : AVATAR_CLOSED_LEFT,
                  top: isOpen ? AVATAR_OPEN_TOP : AVATAR_CLOSED_TOP,
                }
          }
          className="absolute z-10"
          style={
            shouldReduceMotion
              ? {
                  left: isOpen ? AVATAR_OPEN_LEFT : AVATAR_CLOSED_LEFT,
                  top: isOpen ? AVATAR_OPEN_TOP : AVATAR_CLOSED_TOP,
                }
              : undefined
          }
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : {
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                  duration: 0.25,
                }
          }
        >
          <Avatar className="h-6 w-6">
            <AvatarImage alt={avatarAlt} src={avatarUrl} />
            <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
          </Avatar>
        </motion.div>

        {/* Content - always rendered but hidden when closed for measurement */}
        <div
          className="pointer-events-none absolute"
          ref={contentRef}
          style={{
            width: `${width}px`,
            top: "-9999px",
            left: 0,
            position: "absolute",
          }}
        >
          <div className="flex flex-col items-start gap-0.5 py-3 pr-4 pl-11">
            {/* Attribution */}
            <div className="flex items-start gap-0.5">
              <p className="font-semibold text-[11px] text-foreground leading-4">
                {authorName}
              </p>
              <p className="font-medium text-[11px] text-muted-foreground leading-4">
                {timestamp}
              </p>
            </div>
            {/* Message */}
            <p className="text-left font-medium text-[11px] text-foreground leading-4">
              {message}
            </p>
          </div>
        </div>

        {/* Content - visible when open */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              animate={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : {
                      opacity: 1,
                      filter: "blur(0px)",
                    }
              }
              className="absolute inset-0 flex flex-col items-start gap-0.5 py-3 pr-4 pl-11"
              exit={
                shouldReduceMotion
                  ? { opacity: 0, transition: { duration: 0 } }
                  : {
                      opacity: 0,
                      filter: `blur(${String(EXIT_BLUR_PX)}px)`,
                    }
              }
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : {
                      opacity: 0,
                      filter: `blur(${String(INITIAL_BLUR_PX)}px)`,
                    }
              }
              style={{
                width: `${width}px`,
              }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : (isExiting: boolean) => ({
                      opacity: {
                        duration: 0.25,
                        ease: BLUR_EASE,
                        delay: isExiting ? 0 : CONTENT_DELAY,
                      },
                      filter: {
                        duration: 0.25,
                        ease: BLUR_EASE,
                        delay: isExiting ? 0 : CONTENT_DELAY,
                      },
                    })
              }
            >
              {/* Attribution */}
              <div className="flex items-start gap-0.5">
                <p className="font-semibold text-[11px] text-foreground leading-4">
                  {authorName}
                </p>
                <p className="font-medium text-[11px] text-muted-foreground leading-4">
                  {timestamp}
                </p>
              </div>
              {/* Message */}
              <p className="text-left font-medium text-[11px] text-foreground leading-4">
                {message}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

    </div>
  );
}
