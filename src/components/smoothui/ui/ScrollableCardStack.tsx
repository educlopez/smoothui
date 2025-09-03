"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { motion, useMotionValue, useSpring } from "motion/react"

import { cn } from "../utils/cn"

interface CardItem {
  id: string
  name: string
  handle: string
  avatar: string
  video: string
  href: string
}

interface ScrollableCardStackProps {
  items: CardItem[]
  cardHeight?: number
  perspective?: number
  transitionDuration?: number
  className?: string
}

const ScrollableCardStack: React.FC<ScrollableCardStackProps> = ({
  items,
  cardHeight = 384,
  perspective = 1000,
  transitionDuration = 180,
  className,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [isScrolling, setIsScrolling] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollY = useMotionValue(0)
  const lastScrollTime = useRef(0)

  // Improved spring config inspired by the reference code
  const springConfig = {
    damping: 20,
    stiffness: 250,
    mass: 0.5,
  }

  // Calculate the total number of items
  const totalItems = items.length
  const maxIndex = totalItems - 1

  // Spring-based scroll for smooth animations
  const springScrollY = useSpring(scrollY, springConfig)

  // Constants for visual effects - matching reference code exactly
  const FRAME_OFFSET = -30
  const FRAMES_VISIBLE_LENGTH = 3
  const SNAP_DISTANCE = 50

  // Clamp function from reference code - memoized to prevent recreation
  const clamp = useCallback(
    (val: number, [min, max]: [number, number]): number => {
      return Math.min(Math.max(val, min), max)
    },
    []
  )

  // Controlled scroll function to move exactly one card
  const scrollToCard = useCallback(
    (direction: 1 | -1) => {
      if (isScrolling) return

      const now = Date.now()
      const timeSinceLastScroll = now - lastScrollTime.current
      const minScrollInterval = 300

      if (timeSinceLastScroll < minScrollInterval) {
        return
      }

      const newIndex = clamp(currentIndex + direction, [0, maxIndex])

      if (newIndex !== currentIndex) {
        lastScrollTime.current = now
        setIsScrolling(true)
        setCurrentIndex(newIndex)
        scrollY.set(newIndex * SNAP_DISTANCE)

        setTimeout(() => {
          setIsScrolling(false)
        }, transitionDuration + 100)
      }
    },
    [currentIndex, maxIndex, scrollY, isScrolling, transitionDuration, clamp]
  )

  // Handle scroll events with improved responsiveness
  const handleScroll = useCallback(
    (deltaY: number) => {
      if (isDragging || isScrolling) return

      const minScrollThreshold = 20
      if (Math.abs(deltaY) < minScrollThreshold) {
        return
      }

      const scrollDirection = deltaY > 0 ? 1 : -1
      scrollToCard(scrollDirection)
    },
    [isDragging, isScrolling, scrollToCard]
  )

  // Handle wheel events
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault()
      handleScroll(e.deltaY)
    },
    [handleScroll]
  )

  // Handle keyboard navigation - improved with reference code logic
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (isScrolling) return

      switch (e.key) {
        case "ArrowUp":
        case "ArrowLeft":
          e.preventDefault()
          scrollToCard(-1)
          break
        case "ArrowDown":
        case "ArrowRight":
          e.preventDefault()
          scrollToCard(1)
          break
        case "Home":
          e.preventDefault()
          if (currentIndex !== 0) {
            setIsScrolling(true)
            setCurrentIndex(0)
            scrollY.set(0)
            setTimeout(() => setIsScrolling(false), transitionDuration + 100)
          }
          break
        case "End":
          e.preventDefault()
          if (currentIndex !== maxIndex) {
            setIsScrolling(true)
            setCurrentIndex(maxIndex)
            scrollY.set(maxIndex * SNAP_DISTANCE)
            setTimeout(() => setIsScrolling(false), transitionDuration + 100)
          }
          break
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
  )

  // Handle touch events for mobile
  const touchStartY = useRef(0)
  const touchStartIndex = useRef(0)
  const touchStartTime = useRef(0)
  const touchMoved = useRef(false)

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      touchStartY.current = e.touches[0].clientY
      touchStartIndex.current = currentIndex
      touchStartTime.current = Date.now()
      touchMoved.current = false
      setIsDragging(true)
    },
    [currentIndex]
  )

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging || isScrolling) return

      const touchY = e.touches[0].clientY
      const deltaY = touchStartY.current - touchY
      const scrollThreshold = 100

      if (Math.abs(deltaY) > scrollThreshold && !touchMoved.current) {
        const scrollDirection = deltaY > 0 ? 1 : -1
        scrollToCard(scrollDirection)
        touchMoved.current = true
      }
    },
    [isDragging, isScrolling, scrollToCard]
  )

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
    touchMoved.current = false
  }, [])

  // Set up event listeners
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener("wheel", handleWheel, { passive: false })

    return () => {
      container.removeEventListener("wheel", handleWheel)
    }
  }, [handleWheel])

  // Snap to current index when not dragging
  useEffect(() => {
    if (!isDragging) {
      scrollY.set(currentIndex * SNAP_DISTANCE)
    }
  }, [currentIndex, isDragging, scrollY])

  // Calculate transform for each card based on the reference code
  const getCardTransform = useCallback(
    (index: number) => {
      const offsetIndex = index - currentIndex
      const absOffsetIndex = Math.abs(offsetIndex)

      // Apply blur effect for cards behind the current one - matching reference exactly
      const blur = currentIndex > index ? 2 : 0

      // Opacity based on distance - improved logic from reference
      const opacity = currentIndex > index ? 0 : 1

      // Scale with improved calculation inspired by reference - using clamp function
      const scale = clamp(1 - offsetIndex * 0.08, [0.08, 2])

      // Vertical offset with improved calculation - matching reference exactly
      const y = clamp(offsetIndex * FRAME_OFFSET, [
        FRAME_OFFSET * FRAMES_VISIBLE_LENGTH,
        Infinity,
      ])

      // Z-index for proper layering - matching reference pattern
      const zIndex = items.length - index

      return {
        y,
        scale,
        opacity,
        blur,
        zIndex,
      }
    },
    [currentIndex, items.length, clamp]
  )

  return (
    <section
      ref={containerRef}
      className={cn(
        "relative mx-auto h-fit min-h-[200px] w-fit min-w-[300px]",
        className
      )}
      style={{
        perspective: `${perspective}px`,
        perspectiveOrigin: "center 60%",
        touchAction: "none",
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      aria-live="polite"
      aria-atomic="true"
      aria-label="Scrollable card stack"
    >
      {items.map((item, i) => {
        const transform = getCardTransform(i)
        const isActive = i === currentIndex
        const isHovered = hoveredIndex === i

        return (
          <motion.div
            key={`scrollable-card-${item.id}`}
            className="bg-background absolute top-1/2 left-1/2 h-max w-max max-w-[100vw] overflow-hidden rounded-2xl border shadow-lg"
            data-active={isActive}
            style={{
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
            initial={false}
            animate={{
              y: `calc(-50% + ${transform.y}px)`,
              scale: transform.scale,
              x: "-50%",
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
            transition={{
              type: "spring",
              stiffness: 250,
              damping: 20,
              mass: 0.5,
            }}
            aria-hidden={!isActive}
            tabIndex={isActive ? 0 : -1}
            onMouseEnter={() => isActive && setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            onFocus={() => isActive && setHoveredIndex(i)}
            onBlur={() => setHoveredIndex(null)}
          >
            {/* Card Content */}
            <div
              className={cn(
                "bg-background flex h-fit w-96 flex-col items-center rounded-xl transition-all duration-200",
                isHovered && "shadow-xl",
                isScrolling && isActive && "ring-opacity-50 ring-brand ring-2"
              )}
            >
              {/* Scroll indicator */}
              {isScrolling && isActive && (
                <div className="absolute -top-1 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-blue-200 opacity-75" />
              )}

              {/* Video Container */}
              <div
                className="relative w-full overflow-hidden"
                style={{ aspectRatio: "1.77778 / 1" }}
              >
                {/* Background blur image */}
                <img
                  aria-hidden="true"
                  alt=""
                  decoding="async"
                  src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+"
                  className="absolute inset-0 h-full w-full object-cover text-transparent"
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
                  loop
                  playsInline
                  muted
                  src={item.video}
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ zIndex: 2 }}
                />
              </div>

              {/* Header */}
              <a
                className={cn(
                  "text-decoration-none flex items-center gap-1 p-3 text-inherit transition-colors duration-200"
                )}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${item.name}'s profile`}
              >
                <img
                  className="mr-1 h-5 w-5 overflow-hidden rounded-full"
                  alt={`${item.name}'s avatar`}
                  width={20}
                  height={20}
                  src={item.avatar}
                  style={{
                    boxShadow: "0 0 0 1px var(--border-secondary, #e0e0e0)",
                  }}
                />
                <span className="text-foreground text-sm leading-none font-medium">
                  {item.name}
                </span>
                <span className="text-foreground/70 text-sm font-normal">
                  {item.handle}
                </span>
              </a>
            </div>
          </motion.div>
        )
      })}

      {/* Navigation indicators */}
      <div
        className="absolute bottom-4 left-1/2 flex -translate-x-1/2 transform space-x-2"
        role="tablist"
        aria-label="Card navigation"
      >
        {Array.from({ length: items.length }, (_, i) => {
          return (
            <motion.button
              key={`scrollable-indicator-${items[i]?.id || i}`}
              type="button"
              onClick={() => {
                if (i !== currentIndex && !isScrolling) {
                  setIsScrolling(true)
                  setCurrentIndex(i)
                  scrollY.set(i * SNAP_DISTANCE)
                  setTimeout(
                    () => setIsScrolling(false),
                    transitionDuration + 100
                  )
                }
              }}
              className={cn(
                "h-2 w-2 rounded-full transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none",
                i === currentIndex
                  ? "scale-125 bg-blue-500"
                  : "bg-gray-300 hover:bg-gray-400"
              )}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              transition={{
                type: "spring",
                stiffness: 250,
                damping: 20,
                mass: 0.5,
              }}
              role="tab"
              aria-selected={i === currentIndex}
              aria-label={`Go to card ${i + 1} of ${items.length}`}
            />
          )
        })}
      </div>

      {/* Instructions for screen readers */}
      <div className="sr-only" aria-live="polite">
        {`Card ${currentIndex + 1} of ${items.length} selected. Use arrow keys to navigate one card at a time, or click the dots below.`}
      </div>
    </section>
  )
}

export default ScrollableCardStack
