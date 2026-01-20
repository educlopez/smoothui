"use client";

import { Play } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const AVATAR_SIZE = 96;
// ease-out-quint for entering/exiting elements
const EASE_OUT_QUINT = [0.23, 1, 0.32, 1] as const;

export type Card = {
  id: number;
  title: string;
  image: string;
  content: string;
  author?: {
    name: string;
    role: string;
    image: string;
  };
};

export type ExpandableCardsProps = {
  cards: Card[];
  selectedCard?: number | null;
  onSelect?: (id: number | null) => void;
  className?: string;
  cardClassName?: string;
};

export default function ExpandableCards({
  cards,
  selectedCard: controlledSelected,
  onSelect,
  className = "",
  cardClassName = "",
}: ExpandableCardsProps) {
  const [internalSelected, setInternalSelected] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const selectedCard =
    controlledSelected !== undefined ? controlledSelected : internalSelected;

  useEffect(() => {
    if (scrollRef.current) {
      const scrollWidth = scrollRef.current.scrollWidth;
      const clientWidth = scrollRef.current.clientWidth;
      scrollRef.current.scrollLeft = (scrollWidth - clientWidth) / 2;
    }
  }, []);

  const handleCardClick = (id: number) => {
    if (selectedCard === id) {
      if (onSelect) {
        onSelect(null);
      } else {
        setInternalSelected(null);
      }
    } else {
      if (onSelect) {
        onSelect(id);
      } else {
        setInternalSelected(id);
      }
      // Center the clicked card in view
      const cardElement = document.querySelector(`[data-card-id="${id}"]`);
      if (cardElement) {
        cardElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  };

  return (
    <div
      className={`flex w-full flex-col gap-4 overflow-scroll p-4 ${className}`}
    >
      <div
        className="scrollbar-hide mx-auto flex overflow-x-auto pt-4 pb-8"
        ref={scrollRef}
        style={{
          scrollSnapType: "x mandatory",
          scrollPaddingLeft: "20%",
        }}
      >
        {cards.map((card) => (
          <motion.div
            animate={{
              width: selectedCard === card.id ? "500px" : "200px",
            }}
            aria-label={`${card.title} card${selectedCard === card.id ? ", expanded" : ""}`}
            aria-selected={selectedCard === card.id}
            className={`relative mr-4 h-[300px] shrink-0 cursor-pointer overflow-hidden rounded-2xl border bg-background shadow-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${cardClassName}`}
            data-card-id={card.id}
            key={card.id}
            layout
            onClick={() => handleCardClick(card.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleCardClick(card.id);
              }
            }}
            role="button"
            style={{
              scrollSnapAlign: "start",
            }}
            tabIndex={0}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : {
                    duration: 0.25,
                    ease: EASE_OUT_QUINT,
                  }
            }
          >
            <div className="relative h-full w-[200px]">
              {/* biome-ignore lint/performance/noImgElement: Using img for card image without Next.js Image optimizations */}
              <img
                alt={card.title}
                className="h-full w-full object-cover"
                height={300}
                src={card.image || "/placeholder.svg"}
                width={200}
              />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">
                <h2 className="font-bold text-2xl">{card.title}</h2>
                <div className="flex items-center gap-2">
                  <button
                    aria-label={`Play video: ${card.title}`}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-background/30 backdrop-blur-sm transition-transform duration-200 ease hover:scale-110 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 min-h-[44px] min-w-[44px]"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle play action
                    }}
                    type="button"
                  >
                    <Play className="h-6 w-6 text-white" />
                  </button>
                  <span className="font-medium text-sm">Play video</span>
                </div>
              </div>
            </div>
            <AnimatePresence mode="popLayout">
              {selectedCard === card.id && (
                <motion.div
                  animate={
                    shouldReduceMotion
                      ? { width: "300px", opacity: 1 }
                      : { width: "300px", opacity: 1, filter: "blur(0px)" }
                  }
                  className="absolute top-0 right-0 h-full bg-background"
                  exit={
                    shouldReduceMotion
                      ? { width: 0, opacity: 0 }
                      : { width: 0, opacity: 0, filter: "blur(5px)" }
                  }
                  initial={
                    shouldReduceMotion
                      ? { width: 0, opacity: 0 }
                      : { width: 0, opacity: 0, filter: "blur(5px)" }
                  }
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : {
                          duration: 0.25,
                          ease: EASE_OUT_QUINT,
                          opacity: { duration: 0.2, delay: 0.1 },
                        }
                  }
                >
                  <motion.div
                    animate={
                      shouldReduceMotion
                        ? { opacity: 1, x: 0 }
                        : { opacity: 1, x: 0, filter: "blur(0px)" }
                    }
                    className="flex h-full flex-col justify-between p-8"
                    exit={
                      shouldReduceMotion
                        ? { opacity: 0, x: 20 }
                        : { opacity: 0, x: 20, filter: "blur(5px)" }
                    }
                    initial={
                      shouldReduceMotion
                        ? { opacity: 0, x: 20 }
                        : { opacity: 0, x: 20, filter: "blur(5px)" }
                    }
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { delay: 0.2, duration: 0.2, ease: EASE_OUT_QUINT }
                    }
                  >
                    <p className="text-primary-foreground text-sm">
                      {card.content}
                    </p>
                    {card.author && (
                      <div className="mt-4 flex items-center gap-3">
                        <div className="h-12 w-12 overflow-hidden rounded-full border bg-primary">
                          {/* biome-ignore lint/performance/noImgElement: Using img for author avatar without Next.js Image optimizations */}
                          <img
                            alt={card.author.name}
                            className="h-full w-full object-cover"
                            height={48}
                            src={card.author.image}
                            width={48}
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            {card.author.name}
                          </p>
                          <p className="text-primary-foreground text-xs">
                            {card.author.role}
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
