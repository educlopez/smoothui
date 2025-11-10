"use client";

import { Power } from "lucide-react";
import {
  motion,
  useAnimation,
  useAnimationFrame,
  useMotionValue,
} from "motion/react";
import { type RefObject, useRef, useState } from "react";

const SLIDE_THRESHOLD = 160;
const SLIDE_MAX_DISTANCE = 168;
const PERCENTAGE_MULTIPLIER = 100;

export type PowerOffSlideProps = {
  onPowerOff?: () => void;
  label?: string;
  className?: string;
  duration?: number;
  disabled?: boolean;
};

export default function PowerOffSlide({
  onPowerOff,
  label = "Slide to power off",
  className = "",
  duration = 2000,
  disabled = false,
}: PowerOffSlideProps) {
  const [isPoweringOff, setIsPoweringOff] = useState(false);
  const x = useMotionValue(0);
  const controls = useAnimation();
  const constraintsRef = useRef(null);
  const textRef: RefObject<HTMLDivElement | null> = useRef(null);

  useAnimationFrame((t) => {
    const animDuration = duration;
    const progress = (t % animDuration) / animDuration;
    if (textRef.current) {
      textRef.current.style.setProperty(
        "--x",
        `${(1 - progress) * PERCENTAGE_MULTIPLIER}%`
      );
    }
  });

  const handleDragEnd = async () => {
    if (disabled) {
      return;
    }
    const dragDistance = x.get();
    if (dragDistance > SLIDE_THRESHOLD) {
      await controls.start({ x: SLIDE_MAX_DISTANCE });
      setIsPoweringOff(true);
      if (onPowerOff) {
        onPowerOff();
      }
      setTimeout(() => {
        setIsPoweringOff(false);
        controls.start({ x: 0 });
        x.set(0);
      }, duration);
    } else {
      controls.start({ x: 0 });
    }
  };

  return (
    <div className={`flex h-auto items-center justify-center ${className}`}>
      <div className="w-56">
        {isPoweringOff ? (
          <div className="text-center text-foreground">
            <p className="mb-2 font-light text-xl">Shutting down...</p>
          </div>
        ) : (
          <div
            className="relative h-14 overflow-hidden rounded-full border bg-secondary"
            ref={constraintsRef}
          >
            <div className="absolute inset-0 left-8 z-0 flex items-center justify-center overflow-hidden">
              <div className="loading-shimmer relative w-full select-none text-center font-normal text-foreground text-md">
                {label}
              </div>
            </div>
            <motion.div
              animate={controls}
              aria-disabled={disabled}
              className={`absolute top-1 left-1 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-background shadow-md ${disabled ? "cursor-not-allowed opacity-50" : "cursor-grab active:cursor-grabbing"}`}
              drag={disabled ? false : "x"}
              dragConstraints={{ left: 0, right: SLIDE_MAX_DISTANCE }}
              dragElastic={0}
              dragMomentum={false}
              onDragEnd={handleDragEnd}
              style={{ x }}
              tabIndex={disabled ? -1 : 0}
            >
              <Power className="text-red-600" size={32} />
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
