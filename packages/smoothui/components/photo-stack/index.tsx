"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";

export interface PhotoStackPhoto {
  alt: string;
  id: string;
  /** Optional caption shown over the front card. */
  name?: string;
  role?: string;
  src: string;
}

export interface PhotoStackProps {
  className?: string;
  /** Fired after the top card is sent to the back, with the new id order. */
  onCycle?: (order: string[]) => void;
  /** Cards to stack. The first item starts on top. */
  photos: PhotoStackPhoto[];
}

// Resting offset/scale per stack position (0 = front).
const POSITIONS = [
  { x: 0, y: 0, scale: 1 },
  { x: 16, y: 12, scale: 0.95 },
  { x: 32, y: 24, scale: 0.9 },
];

/**
 * PhotoStack — a draggable deck of photo cards. Drag the top card (Tinder-style)
 * in either direction, or tap it, to send it to the back and reveal the next.
 * Inspired by Josh Puckett's dialkit Photo Stack.
 */
export default function PhotoStack({
  className,
  photos,
  onCycle,
}: PhotoStackProps) {
  const reduceMotion = useReducedMotion();
  const [order, setOrder] = useState<number[]>(() => photos.map((_, i) => i));
  // A real drag fires both onDragEnd and a trailing onClick. Without this guard
  // a short drag would cycle twice and land the card in 2nd place, not last.
  const justDragged = useRef(false);

  const cycle = () => {
    setOrder((prev) => {
      const next = [...prev.slice(1), prev[0]];
      onCycle?.(next.map((i) => photos[i].id));
      return next;
    });
  };

  return (
    <div className={cn("relative h-72 w-56 select-none", className)}>
      {order.map((photoIndex, pos) => {
        const photo = photos[photoIndex];
        const rest = POSITIONS[Math.min(pos, POSITIONS.length - 1)];
        const isFront = pos === 0;

        return (
          <motion.div
            animate={{ x: rest.x, y: rest.y, scale: rest.scale, rotate: 0 }}
            aria-label={
              isFront ? `${photo.name ?? photo.alt} — next` : undefined
            }
            className="absolute inset-0 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06),0_14px_32px_rgba(0,0,0,0.14)] focus-visible:outline-2 focus-visible:outline-blue-600 focus-visible:outline-offset-2"
            drag={isFront && !reduceMotion ? "x" : false}
            dragSnapToOrigin
            key={photo.id}
            onClick={() => {
              if (!isFront) {
                return;
              }
              // Swallow the click that trails a drag so it doesn't double-cycle.
              if (justDragged.current) {
                justDragged.current = false;
                return;
              }
              cycle();
            }}
            onDragEnd={() => {
              // Any drag release sends the dragged (front) card to the back.
              justDragged.current = true;
              cycle();
            }}
            onKeyDown={(e: React.KeyboardEvent) => {
              if (isFront && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                cycle();
              }
            }}
            role={isFront ? "button" : undefined}
            style={{
              zIndex: photos.length - pos,
              cursor: isFront ? "grab" : "default",
            }}
            tabIndex={isFront ? 0 : -1}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 320, damping: 30 }
            }
            whileDrag={{ cursor: "grabbing" }}
          >
            <img
              alt={photo.alt}
              className="h-full w-full object-cover object-top"
              draggable={false}
              src={photo.src}
            />
            {(photo.name || photo.role) && (
              <figcaption
                className={cn(
                  "absolute inset-x-0 bottom-0 flex flex-col gap-px bg-gradient-to-t from-black/60 to-transparent p-3.5 text-white transition-opacity",
                  !isFront && "opacity-0"
                )}
              >
                {photo.name && (
                  <span className="font-semibold text-sm">{photo.name}</span>
                )}
                {photo.role && (
                  <span className="text-xs opacity-85">{photo.role}</span>
                )}
              </figcaption>
            )}
            {pos > 0 && (
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-white"
                style={{ opacity: pos === 1 ? 0.2 : 0.36 }}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
