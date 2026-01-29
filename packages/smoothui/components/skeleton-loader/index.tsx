"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { useEffect, useState } from "react";

export type SkeletonLoaderProps = {
  variant?: "shimmer" | "pulse" | "wave";
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
};

export type SkeletonTextProps = {
  lines?: number;
  lastLineWidth?: string;
  className?: string;
  variant?: "shimmer" | "pulse" | "wave";
};

export type SkeletonAvatarProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
  variant?: "shimmer" | "pulse" | "wave";
};

export type SkeletonCardProps = {
  showAvatar?: boolean;
  showImage?: boolean;
  className?: string;
  variant?: "shimmer" | "pulse" | "wave";
};

const AVATAR_SIZES = {
  sm: 32,
  md: 40,
  lg: 56,
} as const;

const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
};

const SkeletonStyles = () => (
  <style
    dangerouslySetInnerHTML={{
      __html: `
        @keyframes skeleton-shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @keyframes skeleton-pulse {
          0%, 100% {
            opacity: 0.4;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes skeleton-wave {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .skeleton-shimmer {
          background: linear-gradient(
            90deg,
            hsl(var(--muted)) 0%,
            hsl(var(--muted-foreground) / 0.1) 50%,
            hsl(var(--muted)) 100%
          );
          background-size: 200% 100%;
          animation: skeleton-shimmer 1.5s ease-in-out infinite;
        }

        .skeleton-pulse {
          background: hsl(var(--muted));
          animation: skeleton-pulse 1.5s ease-in-out infinite;
        }

        .skeleton-wave {
          background: hsl(var(--muted));
          position: relative;
          overflow: hidden;
        }

        .skeleton-wave::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            hsl(var(--muted-foreground) / 0.15) 50%,
            transparent 100%
          );
          animation: skeleton-wave 1.5s ease-in-out infinite;
        }

        .skeleton-static {
          background: hsl(var(--muted));
        }

        @media (prefers-reduced-motion: reduce) {
          .skeleton-shimmer,
          .skeleton-pulse,
          .skeleton-wave {
            animation: none;
          }
          .skeleton-wave::after {
            animation: none;
            display: none;
          }
          .skeleton-shimmer {
            background: hsl(var(--muted));
          }
        }
      `,
    }}
  />
);

const SkeletonLoader = ({
  variant = "shimmer",
  width,
  height,
  borderRadius,
  className,
}: SkeletonLoaderProps) => {
  const prefersReducedMotion = useReducedMotion();

  const variantClass = prefersReducedMotion ? "skeleton-static" : `skeleton-${variant}`;

  const style: React.CSSProperties = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
    borderRadius: typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius,
  };

  return (
    <>
      <SkeletonStyles />
      <div
        aria-hidden="true"
        className={cn("rounded-md", variantClass, className)}
        role="presentation"
        style={style}
      />
    </>
  );
};

export const SkeletonText = ({
  lines = 3,
  lastLineWidth = "60%",
  className,
  variant = "shimmer",
}: SkeletonTextProps) => {
  const prefersReducedMotion = useReducedMotion();
  const variantClass = prefersReducedMotion ? "skeleton-static" : `skeleton-${variant}`;

  return (
    <>
      <SkeletonStyles />
      <div
        aria-label="Loading text content"
        className={cn("flex flex-col gap-2", className)}
        role="status"
      >
        {Array.from({ length: lines }).map((_, index) => (
          <div
            aria-hidden="true"
            className={cn("h-4 rounded", variantClass)}
            key={index}
            style={{
              width: index === lines - 1 ? lastLineWidth : "100%",
            }}
          />
        ))}
        <span className="sr-only">Loading...</span>
      </div>
    </>
  );
};

export const SkeletonAvatar = ({
  size = "md",
  className,
  variant = "shimmer",
}: SkeletonAvatarProps) => {
  const prefersReducedMotion = useReducedMotion();
  const variantClass = prefersReducedMotion ? "skeleton-static" : `skeleton-${variant}`;
  const sizeValue = AVATAR_SIZES[size];

  return (
    <>
      <SkeletonStyles />
      <div
        aria-label="Loading avatar"
        className={cn("shrink-0 rounded-full", variantClass, className)}
        role="status"
        style={{
          width: sizeValue,
          height: sizeValue,
        }}
      >
        <span className="sr-only">Loading...</span>
      </div>
    </>
  );
};

export const SkeletonCard = ({
  showAvatar = true,
  showImage = true,
  className,
  variant = "shimmer",
}: SkeletonCardProps) => {
  const prefersReducedMotion = useReducedMotion();
  const variantClass = prefersReducedMotion ? "skeleton-static" : `skeleton-${variant}`;

  return (
    <>
      <SkeletonStyles />
      <div
        aria-label="Loading card content"
        className={cn(
          "flex w-full flex-col gap-4 rounded-xl border bg-background p-4",
          className
        )}
        role="status"
      >
        {showImage && (
          <div
            aria-hidden="true"
            className={cn("h-40 w-full rounded-lg", variantClass)}
          />
        )}
        <div className="flex items-center gap-3">
          {showAvatar && (
            <div
              aria-hidden="true"
              className={cn("size-10 shrink-0 rounded-full", variantClass)}
            />
          )}
          <div className="flex flex-1 flex-col gap-2">
            <div
              aria-hidden="true"
              className={cn("h-4 w-3/4 rounded", variantClass)}
            />
            <div
              aria-hidden="true"
              className={cn("h-3 w-1/2 rounded", variantClass)}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div
            aria-hidden="true"
            className={cn("h-4 w-full rounded", variantClass)}
          />
          <div
            aria-hidden="true"
            className={cn("h-4 w-full rounded", variantClass)}
          />
          <div
            aria-hidden="true"
            className={cn("h-4 w-2/3 rounded", variantClass)}
          />
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    </>
  );
};

export default SkeletonLoader;
