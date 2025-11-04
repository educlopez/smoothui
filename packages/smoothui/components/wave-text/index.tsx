import { motion } from "motion/react";
import type React from "react";

export interface WaveTextProps {
  children: string;
  amplitude?: number;
  speed?: number;
  className?: string;
}

const WaveText: React.FC<WaveTextProps> = ({
  children,
  amplitude = 8,
  speed = 0.3,
  className = "",
}) => (
  <span className={className} style={{ display: "inline-block" }}>
    {children.split("").map((char, i) => (
      <motion.span
        animate={{ y: [0, -amplitude, 0] }}
        key={i}
        style={{ display: "inline-block" }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: speed * children.length,
          delay: i * speed,
          ease: "easeInOut",
        }}
      >
        {char === " " ? "\u00A0" : char}
      </motion.span>
    ))}
  </span>
);

export default WaveText;
