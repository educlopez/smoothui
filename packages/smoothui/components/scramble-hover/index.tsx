import type React from "react";
import { useEffect, useRef, useState } from "react";

export type ScrambleHoverProps = {
  children: string;
  duration?: number; // total animation duration in ms
  speed?: number; // interval between scrambles in ms
  className?: string;
};

const CHARACTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=<>?".split(
    ""
  );

function scrambleText(original: string) {
  return original
    .split("")
    .map((char) =>
      char === " "
        ? " "
        : CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]
    )
    .join("");
}

const ScrambleHover: React.FC<ScrambleHoverProps> = ({
  children,
  duration = 600,
  speed = 30,
  className = "",
}) => {
  const [display, setDisplay] = useState(children);
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const [isHoverDevice, setIsHoverDevice] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

    setShouldReduceMotion(motionQuery.matches);
    setIsHoverDevice(hoverQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setShouldReduceMotion(e.matches);
    };
    const handleHoverChange = (e: MediaQueryListEvent) => {
      setIsHoverDevice(e.matches);
    };

    motionQuery.addEventListener("change", handleMotionChange);
    hoverQuery.addEventListener("change", handleHoverChange);

    return () => {
      motionQuery.removeEventListener("change", handleMotionChange);
      hoverQuery.removeEventListener("change", handleHoverChange);
    };
  }, []);

  const handleMouseEnter = () => {
    if (shouldReduceMotion || !isHoverDevice) return;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    intervalRef.current = setInterval(() => {
      setDisplay(() => scrambleText(children));
    }, speed);
    timeoutRef.current = setTimeout(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setDisplay(children);
    }, duration);
  };

  const handleMouseLeave = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setDisplay(children);
  };

  return (
    <button
      className={className}
      onBlur={handleMouseLeave}
      onFocus={isHoverDevice ? handleMouseEnter : undefined}
      onMouseEnter={isHoverDevice ? handleMouseEnter : undefined}
      onMouseLeave={handleMouseLeave}
      style={{
        cursor: "pointer",
        display: "inline-block",
        background: "none",
        border: "none",
        padding: 0,
        font: "inherit",
        color: "inherit",
        textAlign: "inherit",
      }}
      type="button"
    >
      {display}
    </button>
  );
};

export default ScrambleHover;
