"use client";

import { Crown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { wrap } from "popmotion";
import { useEffect, useRef, useState } from "react";

export type Participant = {
  avatar: string;
};

export type Event = {
  id: number;
  title?: string;
  subtitle?: string;
  location: string;
  image?: string;
  badge?: string;
  participants?: Participant[];
  backgroundClassName?: string;
};

const variants = {
  center: {
    x: "-50%",
    rotate: 0,
    scale: 1,
    opacity: 1,
    zIndex: 3,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  left: {
    x: "-130%",
    rotate: -12,
    scale: 0.9,
    opacity: 0.8,
    zIndex: 2,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  right: {
    x: "30%",
    rotate: 12,
    scale: 0.9,
    opacity: 0.8,
    zIndex: 2,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  hidden: {
    opacity: 0,
    zIndex: 1,
    transition: { duration: 0.3 },
  },
};

export type AppleInvitesProps = {
  events: Event[];
  interval?: number;
  className?: string;
  cardClassName?: string;
  activeIndex?: number;
  onChange?: (index: number) => void;
  cardWidth?: number | string;
  cardHeight?: number | string;
};

export default function AppleInvites({
  events,
  interval = 3000,
  className = "",
  cardClassName = "",
  activeIndex: controlledIndex,
  onChange,
  cardWidth = 320,
  cardHeight = 500,
}: AppleInvitesProps) {
  const [internalPage, setInternalPage] = useState(0);
  const [direction, setDirection] = useState(0);

  const page = controlledIndex !== undefined ? controlledIndex : internalPage;
  const setPage = (val: number, dir: number) => {
    if (onChange) {
      onChange(val);
    } else {
      setInternalPage(val);
      setDirection(dir);
    }
  };

  const activeIndex = wrap(0, events.length, page);
  const setPageRef = useRef(setPage);

  useEffect(() => {
    setPageRef.current = setPage;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setPageRef.current(page + 1, 1);
    }, interval);
    return () => clearInterval(timer);
  }, [page, interval]);

  const visibleEvents = [-1, 0, 1].map(
    (offset) => events[wrap(0, events.length, activeIndex + offset)]
  );

  const getVariant = (index: number) => {
    if (index === 1) {
      return "center";
    }
    if (index === 0) {
      return "left";
    }
    return "right";
  };

  const renderBackground = (event: Event) => {
    if (event.backgroundClassName) {
      return <div className={`h-full w-full ${event.backgroundClassName}`} />;
    }
    if (event.image) {
      return (
        /* biome-ignore lint/performance/noImgElement: Using img for event image without Next.js Image optimizations */
        <img
          alt={event.title || ""}
          className="h-full w-full object-cover"
          height={400}
          src={event.image}
          width={400}
        />
      );
    }
    return null;
  };

  return (
    <div
      className={`relative flex h-full w-full items-center justify-center ${className}`}
    >
      <AnimatePresence custom={direction} initial={false}>
        {visibleEvents.map((event, index) => (
          <motion.div
            animate={getVariant(index)}
            className={`-translate-y-1/2 absolute top-1/2 left-1/2 origin-center ${cardClassName}`}
            custom={direction}
            exit="hidden"
            initial="hidden"
            key={event.id}
            style={{
              width:
                typeof cardWidth === "number" ? `${cardWidth}px` : cardWidth,
              height:
                typeof cardHeight === "number" ? `${cardHeight}px` : cardHeight,
            }}
            variants={variants}
          >
            <div className="relative h-full w-full overflow-hidden rounded-3xl bg-primary">
              {renderBackground(event)}
              {/* Badge */}
              <div className="absolute top-4 left-4 z-3">
                <span className="flex flex-row items-center gap-2 rounded-full bg-black/30 px-3 py-1 font-medium text-white text-xs backdrop-blur-xl md:text-sm">
                  <Crown size={14} />
                  {event.badge}
                </span>
              </div>
              {/* Content */}
              <div className="absolute bottom-0 z-3 w-full overflow-hidden rounded-b-3xl p-6 text-white">
                {/* Participant Avatars */}
                <div className="mx-auto mb-2 flex items-center justify-center gap-2">
                  {event.participants?.map((participant, idx) => (
                    /* biome-ignore lint/performance/noImgElement: Using img for participant avatar without Next.js Image optimizations */
                    <img
                      alt={`Participant ${idx + 1}`}
                      className="w-6 rounded-full md:h-9 md:w-9"
                      height={36}
                      key={`participant-${participant.avatar}-${idx}`}
                      src={participant.avatar}
                      width={36}
                    />
                  ))}
                </div>
                {event.title && (
                  <p className="mb-1 text-center font-bold text-md md:text-2xl">
                    {event.title}
                  </p>
                )}
                {event.subtitle && (
                  <p className="text-center text-xs opacity-90 md:text-sm">
                    {event.subtitle}
                  </p>
                )}
                <p className="text-center text-xs opacity-90 md:text-sm">
                  {event.location}
                </p>
              </div>
              <div className="fixed inset-x-0 bottom-0 isolate z-2 h-1/2">
                <div className="gradient-mask-t-0 absolute inset-0 overflow-hidden rounded-3xl backdrop-blur-[1px]" />
                <div className="gradient-mask-t-0 absolute inset-0 overflow-hidden rounded-3xl backdrop-blur-[2px]" />
                <div className="gradient-mask-t-0 absolute inset-0 overflow-hidden rounded-3xl backdrop-blur-[3px]" />
                <div className="gradient-mask-t-0 absolute inset-0 overflow-hidden rounded-3xl backdrop-blur-[6px]" />
                <div className="gradient-mask-t-0 absolute inset-0 overflow-hidden rounded-3xl backdrop-blur-[12px]" />
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
