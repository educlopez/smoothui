"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import type React from "react";
import { useEffect, useRef, useState } from "react";

import { useCursorPosition } from "./use-cursor-position";

export interface CursorFollowProps {
  children: React.ReactNode;
  className?: string;
}

const CIRCLE_SIZE = 16;
const MIN_BUBBLE_WIDTH = 40;
const BUBBLE_HEIGHT = 40;
const TEXT_PADDING = 32;

const CursorFollow: React.FC<CursorFollowProps> = ({
  children,
  className = "",
}) => {
  const { x: mouseX, y: mouseY } = useCursorPosition();
  const [cursorText, setCursorText] = useState<string | null>(null);
  const [pendingText, setPendingText] = useState<string | null>(null);
  const [textWidth, setTextWidth] = useState<number>(0);
  const measureRef = useRef<HTMLSpanElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Motion values for smooth follow
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { damping: 40, stiffness: 350 });
  const springY = useSpring(y, { damping: 40, stiffness: 350 });

  // Calculate bubble width and height
  const bubbleWidth = cursorText
    ? Math.max(textWidth + TEXT_PADDING, MIN_BUBBLE_WIDTH)
    : CIRCLE_SIZE;
  const bubbleHeight = cursorText ? BUBBLE_HEIGHT : CIRCLE_SIZE;

  // Update target position on mouse move
  useEffect(() => {
    x.set(mouseX - bubbleWidth / 2);
    y.set(mouseY - bubbleHeight / 2);
  }, [mouseX, mouseY, bubbleWidth, bubbleHeight, x, y]);

  // Pre-measure text width before showing bubble
  useEffect(() => {
    if (pendingText && measureRef.current) {
      const width = measureRef.current.offsetWidth;
      setTextWidth(width);
      setCursorText(pendingText);
      setPendingText(null);
    }
    if (!(pendingText || cursorText)) {
      setTextWidth(0);
    }
  }, [pendingText, cursorText]);

  // Handlers for child hover
  const handleMouseOver = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const text = target.getAttribute("data-cursor-text");
    if (text) {
      setPendingText(text);
    }
  };
  const handleMouseOut = () => {
    setCursorText(null);
    setPendingText(null);
  };
  const handleFocus = (e: React.FocusEvent) => {
    const target = e.target as HTMLElement;
    const text = target.getAttribute("data-cursor-text");
    if (text) {
      setPendingText(text);
    }
  };
  const handleBlur = () => {
    setCursorText(null);
    setPendingText(null);
  };

  return (
    // biome-ignore lint/a11y/noNoninteractiveElementInteractions: Interactive cursor tracking widget requires mouse events
    <div
      className={`relative h-full w-full ${className}`}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onMouseOut={handleMouseOut}
      onMouseOver={handleMouseOver}
      role="application"
      style={{ cursor: "none", minHeight: 300 }}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: Interactive cursor tracking widget requires focus
      tabIndex={0}
    >
      {children}
      <motion.div
        animate={
          shouldReduceMotion
            ? { opacity: 1, scale: 1 }
            : {
                opacity: 1,
                scale: 1,
                transition: {
                  duration: 0.25,
                  ease: [0.645, 0.045, 0.355, 1],
                },
              }
        }
        className="pointer-events-none fixed z-50"
        exit={shouldReduceMotion ? {} : { opacity: 0, scale: 0.7 }}
        initial={
          shouldReduceMotion
            ? { opacity: 1, scale: 1 }
            : { opacity: 0, scale: 0.7 }
        }
        style={{ left: 0, top: 0, x: springX, y: springY }}
      >
        <motion.div
          animate={
            cursorText
              ? {
                  background: "var(--color-brand, #6366f1)",
                  borderRadius: 20,
                  color: "#fff",
                  height: 40,
                  minHeight: 32,
                  minWidth: 40,
                  paddingLeft: 16,
                  paddingRight: 16,
                  scale: 1.1,
                  width: bubbleWidth,
                }
              : {
                  background: "var(--color-brand, #6366f1)",
                  borderRadius: 999,
                  color: "#fff",
                  height: CIRCLE_SIZE,
                  minHeight: CIRCLE_SIZE,
                  minWidth: CIRCLE_SIZE,
                  paddingLeft: 0,
                  paddingRight: 0,
                  scale: 1,
                  width: CIRCLE_SIZE,
                }
          }
          className="flex items-center justify-center font-medium text-xs shadow-lg"
          layout
          style={{
            alignItems: "center",
            boxShadow: "0 2px 8px 0 rgba(0,0,0,0.10)",
            display: "flex",
            justifyContent: "center",
            position: "relative",
            zIndex: 1,
          }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 0.25, ease: [0.645, 0.045, 0.355, 1] }
          }
        >
          {cursorText ? (
            <motion.span
              animate={{ filter: "blur(0px)", opacity: 1 }}
              exit={{ filter: "blur(8px)", opacity: 0 }}
              initial={{ filter: "blur(8px)", opacity: 0 }}
              style={{
                color: "#fff",
                textAlign: "center",
                whiteSpace: "nowrap",
                width: "100%",
              }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : {
                      delay: 0.05,
                      duration: 0.2,
                      ease: [0.645, 0.045, 0.355, 1],
                    }
              }
            >
              {cursorText}
            </motion.span>
          ) : null}
        </motion.div>
        {/* Hidden span for pre-measuring text width */}
        {pendingText || cursorText ? (
          <span
            ref={measureRef}
            style={{
              fontFamily: "inherit",
              fontSize: "0.75rem",
              fontWeight: 500,
              paddingLeft: 16,
              paddingRight: 16,
              pointerEvents: "none",
              position: "absolute",
              visibility: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {pendingText || cursorText}
          </span>
        ) : null}
      </motion.div>
    </div>
  );
};

export default CursorFollow;
