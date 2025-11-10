"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import type React from "react";
import { useEffect, useRef, useState } from "react";

import { useCursorPosition } from "./useCursorPosition";

export type CursorFollowProps = {
  children: React.ReactNode;
  className?: string;
};

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

  // Motion values for smooth follow
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 350, damping: 40 });
  const springY = useSpring(y, { stiffness: 350, damping: 40 });

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
      style={{ minHeight: 300, cursor: "none" }}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: Interactive cursor tracking widget requires focus
      tabIndex={0}
    >
      {children}
      <motion.div
        animate={{
          opacity: 1,
          scale: 1,
          transition: { duration: 0.32, ease: "easeInOut" },
        }}
        className="pointer-events-none fixed z-50"
        exit={{ opacity: 0, scale: 0.7 }}
        initial={{ opacity: 0, scale: 0.7 }}
        style={{ left: 0, top: 0, x: springX, y: springY }}
      >
        <motion.div
          animate={
            cursorText
              ? {
                  width: bubbleWidth,
                  height: 40,
                  borderRadius: 20,
                  background: "var(--color-brand, #6366f1)",
                  color: "#fff",
                  paddingLeft: 16,
                  paddingRight: 16,
                  minWidth: 40,
                  minHeight: 32,
                  scale: 1.1,
                }
              : {
                  width: CIRCLE_SIZE,
                  height: CIRCLE_SIZE,
                  borderRadius: 999,
                  background: "var(--color-brand, #6366f1)",
                  color: "#fff",
                  paddingLeft: 0,
                  paddingRight: 0,
                  minWidth: CIRCLE_SIZE,
                  minHeight: CIRCLE_SIZE,
                  scale: 1,
                }
          }
          className="flex items-center justify-center font-medium text-xs shadow-lg"
          layout
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 1,
            boxShadow: "0 2px 8px 0 rgba(0,0,0,0.10)",
          }}
          transition={{ duration: 0.32, ease: "easeInOut" }}
        >
          {cursorText && (
            <motion.span
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(8px)" }}
              initial={{ opacity: 0, filter: "blur(8px)" }}
              style={{
                whiteSpace: "nowrap",
                width: "100%",
                textAlign: "center",
                color: "#fff",
              }}
              transition={{ duration: 0.28, delay: 0.1, ease: "easeInOut" }}
            >
              {cursorText}
            </motion.span>
          )}
        </motion.div>
        {/* Hidden span for pre-measuring text width */}
        {(pendingText || cursorText) && (
          <span
            ref={measureRef}
            style={{
              position: "absolute",
              visibility: "hidden",
              pointerEvents: "none",
              whiteSpace: "nowrap",
              fontSize: "0.75rem",
              fontWeight: 500,
              paddingLeft: 16,
              paddingRight: 16,
              fontFamily: "inherit",
            }}
          >
            {pendingText || cursorText}
          </span>
        )}
      </motion.div>
    </div>
  );
};

export default CursorFollow;
