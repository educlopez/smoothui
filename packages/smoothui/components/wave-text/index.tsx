import { motion } from "motion/react";
import type React from "react";

export type WaveTextProps = {
  children: string;
  amplitude?: number;
  duration?: number;
  staggerDelay?: number;
  className?: string;
};

const WaveText: React.FC<WaveTextProps> = ({
  children,
  amplitude = 8,
  duration = 1.2,
  staggerDelay = 0.05,
  className = "",
}) => (
  <span className={className} style={{ display: "inline-block" }}>
    {children.split("").map((char, i) => (
      <motion.span
        animate={{ y: [0, -amplitude, 0, amplitude * 0.5, 0] }}
        key={`${i}-${char}`}
        style={{ display: "inline-block", willChange: "transform" }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration,
          delay: i * staggerDelay,
          ease: [0.37, 0, 0.63, 1],
          times: [0, 0.25, 0.5, 0.75, 1],
        }}
      >
        {char === " " ? "\u00A0" : char}
      </motion.span>
    ))}
  </span>
);

export default WaveText;
