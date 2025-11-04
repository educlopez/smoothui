"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface CardItem {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  video: string;
  href: string;
}

export interface ScrollableCardStackProps {
  items: CardItem[];
  cardHeight?: number;
  perspective?: number;
  transitionDuration?: number;
  className?: string;
}

const ScrollableCardStack: React.FC<ScrollableCardStackProps> = ({
  items,
  cardHeight = 384,
  perspective = 1000,
  transitionDuration = 180,
  className,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollY = useMotionValue(0);
  const lastScrollTime = useRef(0);

  // Improved spring config inspired by the reference code
  const springConfig = {
    damping: 20,
    stiffness: 250,
    mass: 0.5,
  };

  // Calculate the total number of items
  const totalItems = items.length;
  const maxIndex = totalItems - 1;

  // Spring-based scroll for smooth animations
  const springScrollY = useSpring(scrollY, springConfig);

  // Constants for visual effects - matching reference code exactly
  const FRAME_OFFSET = -30;
  const FRAMES_VISIBLE_LENGTH = 3;
  const SNAP_DISTANCE = 50;

  // Clamp function from reference code - memoized to prevent recreation
  const clamp = useCallback(
    (val: number, [min, max]: [number, number]): number =>
      Math.min(Math.max(val, min), max),
    []
  );

  // Controlled scroll function to move exactly one card
  const scrollToCard = useCallback(
    (direction: 1 | -1) => {
      if (isScrolling) return;

      const now = Date.now();
      const timeSinceLastScroll = now - lastScrollTime.current;
      const minScrollInterval = 300;

      if (timeSinceLastScroll < minScrollInterval) {
        return;
      }

      const newIndex = clamp(currentIndex + direction, [0, maxIndex]);

      if (newIndex !== currentIndex) {
        lastScrollTime.current = now;
        setIsScrolling(true);
        setCurrentIndex(newIndex);
        scrollY.set(newIndex * SNAP_DISTANCE);

        setTimeout(() => {
          setIsScrolling(false);
        }, transitionDuration + 100);
      }
    },
    [currentIndex, maxIndex, scrollY, isScrolling, transitionDuration, clamp]
  );

  // Handle scroll events with improved responsiveness
  const handleScroll = useCallback(
    (deltaY: number) => {
      if (isDragging || isScrolling) return;

      const minScrollThreshold = 20;
      if (Math.abs(deltaY) < minScrollThreshold) {
        return;
      }

      const scrollDirection = deltaY > 0 ? 1 : -1;
      scrollToCard(scrollDirection);
    },
    [isDragging, isScrolling, scrollToCard]
  );

  // Handle wheel events
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      handleScroll(e.deltaY);
    },
    [handleScroll]
  );

  // Handle keyboard navigation - improved with reference code logic
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (isScrolling) return;

      switch (e.key) {
        case "ArrowUp":
        case "ArrowLeft":
          e.preventDefault();
          scrollToCard(-1);
          break;
        case "ArrowDown":
        case "ArrowRight":
          e.preventDefault();
          scrollToCard(1);
          break;
        case "Home":
          e.preventDefault();
          if (currentIndex !== 0) {
            setIsScrolling(true);
            setCurrentIndex(0);
            scrollY.set(0);
            setTimeout(() => setIsScrolling(false), transitionDuration + 100);
          }
          break;
        case "End":
          e.preventDefault();
          if (currentIndex !== maxIndex) {
            setIsScrolling(true);
            setCurrentIndex(maxIndex);
            scrollY.set(maxIndex * SNAP_DISTANCE);
            setTimeout(() => setIsScrolling(false), transitionDuration + 100);
          }
          break;
      }
    },
    [
      currentIndex,
      maxIndex,
      scrollY,
      isScrolling,
      scrollToCard,
      transitionDuration,
    ]
  );

  // Handle touch events for mobile
  const touchStartY = useRef(0);
  const touchStartIndex = useRef(0);
  const touchStartTime = useRef(0);
  const touchMoved = useRef(false);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
      touchStartIndex.current = currentIndex;
      touchStartTime.current = Date.now();
      touchMoved.current = false;
      setIsDragging(true);
    },
    [currentIndex]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging || isScrolling) return;

      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY.current - touchY;
      const scrollThreshold = 100;

      if (Math.abs(deltaY) > scrollThreshold && !touchMoved.current) {
        const scrollDirection = deltaY > 0 ? 1 : -1;
        scrollToCard(scrollDirection);
        touchMoved.current = true;
      }
    },
    [isDragging, isScrolling, scrollToCard]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    touchMoved.current = false;
  }, []);

  // Set up event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [handleWheel]);

  // Snap to current index when not dragging
  useEffect(() => {
    if (!isDragging) {
      scrollY.set(currentIndex * SNAP_DISTANCE);
    }
  }, [currentIndex, isDragging, scrollY]);

  // Calculate transform for each card based on the reference code
  const getCardTransform = useCallback(
    (index: number) => {
      const offsetIndex = index - currentIndex;
      const absOffsetIndex = Math.abs(offsetIndex);

      // Apply blur effect for cards behind the current one - matching reference exactly
      const blur = currentIndex > index ? 2 : 0;

      // Opacity based on distance - improved logic from reference
      const opacity = currentIndex > index ? 0 : 1;

      // Scale with improved calculation inspired by reference - using clamp function
      const scale = clamp(1 - offsetIndex * 0.08, [0.08, 2]);

      // Vertical offset with improved calculation - matching reference exactly
      const y = clamp(offsetIndex * FRAME_OFFSET, [
        FRAME_OFFSET * FRAMES_VISIBLE_LENGTH,
        Number.POSITIVE_INFINITY,
      ]);

      // Z-index for proper layering - matching reference pattern
      const zIndex = items.length - index;

      return {
        y,
        scale,
        opacity,
        blur,
        zIndex,
      };
    },
    [currentIndex, items.length, clamp]
  );

  return (
    <section
      aria-atomic="true"
      aria-label="Scrollable card stack"
      aria-live="polite"
      className={cn("relative mx-auto h-fit w-fit min-w-[300px]", className)}
      onKeyDown={handleKeyDown}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      onTouchStart={handleTouchStart}
      ref={containerRef}
      style={{
        minHeight: `${cardHeight + 100}px`, // Add some padding for the card stack effect
        perspective: `${perspective}px`,
        perspectiveOrigin: "center 60%",
        touchAction: "none",
      }}
    >
      {items.map((item, i) => {
        const transform = getCardTransform(i);
        const isActive = i === currentIndex;
        const isHovered = hoveredIndex === i;

        return (
          <motion.div
            animate={{
              y: `calc(-50% + ${transform.y}px)`,
              scale: transform.scale,
              x: "-50%",
            }}
            aria-hidden={!isActive}
            className="absolute top-1/2 left-1/2 w-max max-w-[100vw] overflow-hidden rounded-2xl border bg-background shadow-lg"
            data-active={isActive}
            initial={false}
            key={`scrollable-card-${item.id}`}
            onBlur={() => setHoveredIndex(null)}
            onFocus={() => isActive && setHoveredIndex(i)}
            onMouseEnter={() => isActive && setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{
              height: `${cardHeight}px`,
              zIndex: transform.zIndex,
              pointerEvents: isActive ? "auto" : "none",
              transformOrigin: "center center",
              willChange: "opacity, filter, transform",
              filter: `blur(${transform.blur}px)`,
              opacity: transform.opacity,
              transitionProperty: "opacity, filter",
              transitionDuration: "200ms",
              transitionTimingFunction: "ease-in-out",
              // Dynamic border width based on scale - from reference code
              borderWidth: `${2 / transform.scale}px`,
            }}
            tabIndex={isActive ? 0 : -1}
            transition={{
              type: "spring",
              stiffness: 250,
              damping: 20,
              mass: 0.5,
            }}
            whileHover={
              isActive
                ? {
                    scale: transform.scale * 1.02,
                    transition: {
                      type: "spring",
                      stiffness: 250,
                      damping: 20,
                      mass: 0.5,
                    },
                  }
                : {}
            }
          >
            {/* Card Content */}
            <div
              className={cn(
                "flex aspect-[16/10] w-full flex-col rounded-xl bg-background transition-all duration-200",
                isHovered && "shadow-xl",
                isScrolling && isActive && "ring-2 ring-brand ring-opacity-50"
              )}
              style={{ height: `${cardHeight}px` }}
            >
              {/* Scroll indicator */}
              {isScrolling && isActive && (
                <div className="-top-1 -translate-x-1/2 absolute left-1/2 h-1 w-8 rounded-full bg-brand opacity-75" />
              )}

              {/* Video Container - takes remaining space */}
              <div className="relative w-full flex-1 overflow-hidden">
                {/* Background blur image */}
                <img
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full object-cover text-transparent"
                  decoding="async"
                  src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+"
                  style={{
                    filter: "blur(32px)",
                    scale: "1.2",
                    zIndex: 1,
                    pointerEvents: "none",
                  }}
                />
                {/* Video */}
                <video
                  autoPlay
                  className="absolute inset-0 h-full w-full object-cover"
                  loop
                  muted
                  playsInline
                  src={item.video}
                  style={{ zIndex: 2 }}
                />
              </div>

              {/* User Info - always at bottom */}
              <a
                aria-label={`View ${item.name}'s profile`}
                className={cn(
                  "flex items-center justify-center gap-1 bg-background/95 p-3 text-decoration-none text-inherit backdrop-blur-sm transition-colors duration-200"
                )}
                href={item.href}
                rel="noopener noreferrer"
                target="_blank"
              >
                <img
                  alt={`${item.name}'s avatar`}
                  className="mr-1 h-5 w-5 overflow-hidden rounded-full"
                  height={20}
                  src={item.avatar}
                  style={{
                    boxShadow: "0 0 0 1px var(--border-secondary, #e0e0e0)",
                  }}
                  width={20}
                />
                <span className="font-medium text-foreground text-sm leading-none">
                  {item.name}
                </span>
                <span className="font-normal text-foreground/70 text-sm">
                  {item.handle}
                </span>
              </a>
            </div>
          </motion.div>
        );
      })}

      {/* Navigation indicators */}
      <div
        aria-label="Card navigation"
        className="-translate-x-1/2 absolute bottom-4 left-1/2 flex transform space-x-2"
        role="tablist"
      >
        {Array.from({ length: items.length }, (_, i) => (
          <motion.button
            aria-label={`Go to card ${i + 1} of ${items.length}`}
            aria-selected={i === currentIndex}
            className={cn(
              "h-2 w-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-brand focus:ring-offset-1",
              i === currentIndex
                ? "scale-125 bg-brand"
                : "bg-gray-300 hover:bg-gray-400"
            )}
            key={`scrollable-indicator-${items[i]?.id || i}`}
            onClick={() => {
              if (i !== currentIndex && !isScrolling) {
                setIsScrolling(true);
                setCurrentIndex(i);
                scrollY.set(i * SNAP_DISTANCE);
                setTimeout(
                  () => setIsScrolling(false),
                  transitionDuration + 100
                );
              }
            }}
            role="tab"
            transition={{
              type: "spring",
              stiffness: 250,
              damping: 20,
              mass: 0.5,
            }}
            type="button"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>

      {/* Instructions for screen readers */}
      <div aria-live="polite" className="sr-only">
        {`Card ${currentIndex + 1} of ${items.length} selected. Use arrow keys to navigate one card at a time, or click the dots below.`}
      </div>
    </section>
  );
};

export default ScrollableCardStack;
