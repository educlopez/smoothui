"use client";

import { motion } from "motion/react";
import { type ReactNode, useEffect, useRef, useState } from "react";

const RESET_PROBABILITY = 0.975;

export type MatrixCardProps = {
  title?: string;
  description?: string;
  fontSize?: number;
  chars?: string;
  className?: string;
  children?: ReactNode;
};

export default function MatrixCard({
  title = "Matrix Effect Card",
  description = "Hover or hold down over this card to see the matrix rain effect in action.",
  fontSize = 14,
  chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$@#%",
  className = "",
  children,
}: MatrixCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!(isHovered && canvasRef.current && containerRef.current)) {
      return;
    }

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = new Array(columns).fill(1);

    ctx.font = `${fontSize}px monospace`;

    const matrix = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#0F0";
      ctx.textAlign = "center";

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (
          drops[i] * fontSize > canvas.height &&
          Math.random() > RESET_PROBABILITY
        ) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      requestRef.current = requestAnimationFrame(matrix);
    };

    matrix();

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [isHovered, fontSize, chars]);

  return (
    <div
      className={
        "flex h-[400px] min-h-[300px] w-full items-center justify-center p-4 md:h-[640px]"
      }
    >
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className={`group relative h-full w-full max-w-md overflow-hidden rounded-xl border bg-background p-6 transition-colors ${className}`}
        initial={{ opacity: 0, y: 20 }}
        onHoverEnd={() => setIsHovered(false)}
        onHoverStart={() => setIsHovered(true)}
        onTouchEnd={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
        ref={containerRef}
        transition={{ duration: 0.3 }}
      >
        <canvas
          className="pointer-events-none absolute inset-0 h-full w-full opacity-0 transition-opacity duration-300 group-hover:opacity-20"
          ref={canvasRef}
        />
        <div className="relative z-10 flex h-full flex-col items-center justify-center">
          {children ? (
            children
          ) : (
            <>
              <p className="pointer-events-none mb-2 select-none font-bold text-foreground text-xl">
                {title}
              </p>
              <p className="pointer-events-none select-none text-center text-primary-foreground">
                {description}
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
