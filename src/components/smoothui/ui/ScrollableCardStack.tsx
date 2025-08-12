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
  transitionDuration = 180, // Reduced from 300ms for snappier feel
  className,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [isScrolling, setIsScrolling] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollY = useMotionValue(0)
  const lastScrollTime = useRef(0)

  // Optimized spring config for snappy animations
  const springConfig = { damping: 30, stiffness: 500 } // Increased stiffness for more responsive feel

  // Calculate the total number of items
  const totalItems = items.length
  const maxIndex = totalItems - 1

  // Spring-based scroll for smooth animations
  const springScrollY = useSpring(scrollY, springConfig)

  // Controlled scroll function to move exactly one card
  const scrollToCard = useCallback(
    (direction: 1 | -1) => {
      if (isScrolling) return // Prevent multiple scrolls while one is in progress

      const now = Date.now()
      const timeSinceLastScroll = now - lastScrollTime.current
      const minScrollInterval = 300 // Minimum 300ms between scrolls

      if (timeSinceLastScroll < minScrollInterval) {
        return // Throttle rapid scrolls
      }

      const newIndex = Math.max(0, Math.min(maxIndex, currentIndex + direction))

      if (newIndex !== currentIndex) {
        lastScrollTime.current = now
        setIsScrolling(true)
        setCurrentIndex(newIndex)
        scrollY.set(newIndex * 18)

        // Reset scrolling state after animation completes
        setTimeout(() => {
          setIsScrolling(false)
        }, transitionDuration + 100) // Slightly longer timeout for better reliability
      }
    },
    [currentIndex, maxIndex, scrollY, isScrolling, transitionDuration]
  )

  // Handle scroll events with improved responsiveness
  const handleScroll = useCallback(
    (deltaY: number) => {
      if (isDragging || isScrolling) return

      // Add minimum threshold to prevent accidental scrolls from tiny movements
      const minScrollThreshold = 20
      if (Math.abs(deltaY) < minScrollThreshold) {
        return
      }

      const scrollDirection = deltaY > 0 ? 1 : -1
      scrollToCard(scrollDirection)
    },
    [isDragging, isScrolling, scrollToCard]
  )

  // Handle wheel events - simplified without debouncing
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault()
      handleScroll(e.deltaY)
    },
    [handleScroll]
  )

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (isScrolling) return

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault()
          if (currentIndex > 0) {
            scrollToCard(-1)
          }
          break
        case "ArrowDown":
          e.preventDefault()
          if (currentIndex < maxIndex) {
            scrollToCard(1)
          }
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
            scrollY.set(maxIndex * 18)
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

  // Handle touch events for mobile with improved gesture detection
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
      const scrollThreshold = 100 // Increased threshold for more intentional swipes

      if (Math.abs(deltaY) > scrollThreshold && !touchMoved.current) {
        const scrollDirection = deltaY > 0 ? 1 : -1
        scrollToCard(scrollDirection)
        touchMoved.current = true // Prevent multiple movements in one gesture
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
      scrollY.set(currentIndex * 18)
    }
  }, [currentIndex, isDragging, scrollY])

  // Calculate which cards should be visible based on current index and total items
  const getVisibleCards = useCallback(() => {
    // Always show all cards, but manage opacity and visibility through transforms
    // This prevents the weird behavior of cards appearing from the right
    return items
  }, [items])

  // Get the adjusted current index for visible cards
  const getAdjustedCurrentIndex = useCallback(() => {
    // Since we always show all cards, the current index is simply the currentIndex
    return currentIndex
  }, [currentIndex])

  // Calculate transform for each card based on the example
  const getCardTransform = useCallback(
    (index: number, visibleItems: CardItem[]) => {
      const adjustedCurrentIndex = getAdjustedCurrentIndex()
      const distance = index - adjustedCurrentIndex
      const absDistance = Math.abs(distance)

      // Scale values from the example: 1, 0.94, 0.88, 0.82, 0.76, 0.7, 0.64
      const scaleValues = [1, 0.94, 0.88, 0.82, 0.76, 0.7, 0.64]
      const scale = scaleValues[absDistance] || 0.64

      // Vertical offset: 0, -18px, -36px, -54px, -72px, -90px, -108px
      const translateY = -18 * absDistance

      // Simplified opacity logic - only hide cards that are too far away
      let opacity = 1
      if (absDistance >= 6) {
        opacity = 0
      } else if (absDistance >= 4) {
        opacity = 0.3 // Very faint for distant cards
      } else if (absDistance >= 2) {
        opacity = 0.6 // Semi-transparent for cards further away
      }

      // Z-index: 10, 9, 8, 7, 6, 5, 4
      const zIndex = 10 - absDistance

      return {
        translateY,
        scale,
        opacity,
        zIndex,
      }
    },
    [getAdjustedCurrentIndex]
  )

  const visibleCards = getVisibleCards()

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
      {visibleCards.map((item, i) => {
        const adjustedCurrentIndex = getAdjustedCurrentIndex()
        const transform = getCardTransform(i, visibleCards)
        const isActive = i === adjustedCurrentIndex
        const isHovered = hoveredIndex === i

        return (
          <motion.div
            key={`scrollable-card-${item.id}`}
            className="bg-background absolute top-1/2 left-1/2 h-max w-max max-w-[100vw] overflow-hidden rounded-2xl border shadow-lg transition-shadow duration-200"
            data-active={isActive}
            style={{
              zIndex: transform.zIndex,
              pointerEvents: isActive ? "auto" : "none",
              transformOrigin: "center center",
            }}
            animate={{
              opacity: transform.opacity,
              x: "-50%",
              y: `calc(-50% + ${transform.translateY}px)`,
              scale: transform.scale,
            }}
            whileHover={
              isActive
                ? {
                    scale: transform.scale * 1.02,
                    transition: { duration: 0.15, ease: [0.22, 1, 0.36, 1] },
                  }
                : {}
            }
            transition={{
              duration: transitionDuration / 1000,
              ease: [0.22, 1, 0.36, 1], // ease-out-quint
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
              {/* Scroll indicator - shows when throttling is active */}
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
          const visibleItems = getVisibleCards()
          const isVisible = i < visibleItems.length

          return (
            <motion.button
              key={`scrollable-indicator-${items[i]?.id || i}`}
              type="button"
              onClick={() => {
                if (i !== currentIndex && !isScrolling) {
                  setIsScrolling(true)
                  setCurrentIndex(i)
                  scrollY.set(i * 18)
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
                  : isVisible
                    ? "bg-gray-300 hover:bg-gray-400"
                    : "bg-gray-200 opacity-50"
              )}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.1, ease: [0.22, 1, 0.36, 1] }}
              role="tab"
              aria-selected={i === currentIndex}
              aria-label={`Go to card ${i + 1} of ${items.length}`}
              disabled={!isVisible}
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
