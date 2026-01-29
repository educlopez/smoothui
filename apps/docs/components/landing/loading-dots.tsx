"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { useEffect, useState } from "react";

interface LoadingDotsProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

// Wave animation delays for each dot (creates a wave effect)
const dotDelays = [
  [0, 0.2, 0.4], // Row 1
  [0.1, 0.3, 0.5], // Row 2
  [0.2, 0.4, 0.6], // Row 3
];

const funnyMessages = [
  "Gathering testimonials...",
  "Reading tweets...",
  "Loading the good vibes...",
  "Almost there...",
  "Fetching compliments...",
  "Preparing awesomeness...",
];

export function LoadingDots({
  className,
  size = 24,
  showText = true,
}: LoadingDotsProps) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!showText) {
      return;
    }

    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % funnyMessages.length);
    }, 1000);

    return () => clearInterval(interval);
  }, [showText]);

  return (
    <div className="flex flex-col items-center gap-4">
      <svg
        className={cn("text-brand", className)}
        fill="none"
        height={size}
        viewBox="0 0 24 24"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <style>
          {`
          @keyframes dot-wave {
            0%, 100% {
              opacity: 0.2;
            }
            50% {
              opacity: 1;
            }
          }
          .dot-animate {
            animation: dot-wave 1.4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .dot-animate {
              animation: none;
              opacity: 0.5;
            }
          }
        `}
        </style>
        <defs>
          <clipPath id="clip0_331_2">
            <rect fill="white" height="24" width="24" />
          </clipPath>
        </defs>
        <g clipPath="url(#clip0_331_2)">
          <mask
            id="mask0_331_2"
            maskUnits="userSpaceOnUse"
            style={{ maskType: "luminance" }}
            x="0"
            y="0"
          >
            <path d="M24 0H0V24H24V0Z" fill="white" />
          </mask>
          <g mask="url(#mask0_331_2)">
            <mask
              id="mask1_331_2"
              maskUnits="userSpaceOnUse"
              style={{ maskType: "luminance" }}
              x="0"
              y="0"
            >
              <path d="M0 0H24V24H0V0Z" fill="white" />
            </mask>
            <g mask="url(#mask1_331_2)">
              {/* Row 1 */}
              <g
                className="dot-animate"
                style={{ animationDelay: `${dotDelays[0][0]}s` }}
              >
                <path
                  d="M5.6 7.2C6.484 7.2 7.2 6.484 7.2 5.6C7.2 4.716 6.484 4 5.6 4C4.716 4 4 4.716 4 5.6C4 6.484 4.716 7.2 5.6 7.2Z"
                  fill="currentColor"
                />
              </g>
              <g
                className="dot-animate"
                style={{ animationDelay: `${dotDelays[0][1]}s` }}
              >
                <path
                  d="M11.9999 7.2C12.8839 7.2 13.5999 6.484 13.5999 5.6C13.5999 4.716 12.8839 4 11.9999 4C11.1159 4 10.3999 4.716 10.3999 5.6C10.3999 6.484 11.1159 7.2 11.9999 7.2Z"
                  fill="currentColor"
                />
              </g>
              <g
                className="dot-animate"
                style={{ animationDelay: `${dotDelays[0][2]}s` }}
              >
                <path
                  d="M18.3998 7.2C19.2838 7.2 19.9998 6.484 19.9998 5.6C19.9998 4.716 19.2838 4 18.3998 4C17.5158 4 16.7998 4.716 16.7998 5.6C16.7998 6.484 17.5158 7.2 18.3998 7.2Z"
                  fill="currentColor"
                />
              </g>

              {/* Row 2 */}
              <g
                className="dot-animate"
                style={{ animationDelay: `${dotDelays[1][0]}s` }}
              >
                <path
                  d="M5.6 13.6C6.484 13.6 7.2 12.884 7.2 12C7.2 11.116 6.484 10.4 5.6 10.4C4.716 10.4 4 11.116 4 12C4 12.884 4.716 13.6 5.6 13.6Z"
                  fill="currentColor"
                />
              </g>
              <g
                className="dot-animate"
                style={{ animationDelay: `${dotDelays[1][1]}s` }}
              >
                <path
                  d="M11.9999 13.6C12.8839 13.6 13.5999 12.884 13.5999 12C13.5999 11.116 12.8839 10.4 11.9999 10.4C11.1159 10.4 10.3999 11.116 10.3999 12C10.3999 12.884 11.1159 13.6 11.9999 13.6Z"
                  fill="currentColor"
                />
              </g>
              <g
                className="dot-animate"
                style={{ animationDelay: `${dotDelays[1][2]}s` }}
              >
                <path
                  d="M18.3998 13.6C19.2838 13.6 19.9998 12.884 19.9998 12C19.9998 11.116 19.2838 10.4 18.3998 10.4C17.5158 10.4 16.7998 11.116 16.7998 12C16.7998 12.884 17.5158 13.6 18.3998 13.6Z"
                  fill="currentColor"
                />
              </g>

              {/* Row 3 */}
              <g
                className="dot-animate"
                style={{ animationDelay: `${dotDelays[2][0]}s` }}
              >
                <path
                  d="M5.6 20C6.484 20 7.2 19.284 7.2 18.4C7.2 17.516 6.484 16.8 5.6 16.8C4.716 16.8 4 17.516 4 18.4C4 19.284 4.716 20 5.6 20Z"
                  fill="currentColor"
                />
              </g>
              <g
                className="dot-animate"
                style={{ animationDelay: `${dotDelays[2][1]}s` }}
              >
                <path
                  d="M11.9999 20C12.8839 20 13.5999 19.284 13.5999 18.4C13.5999 17.516 12.8839 16.8 11.9999 16.8C11.1159 16.8 10.3999 17.516 10.3999 18.4C10.3999 19.284 11.1159 20 11.9999 20Z"
                  fill="currentColor"
                />
              </g>
              <g
                className="dot-animate"
                style={{ animationDelay: `${dotDelays[2][2]}s` }}
              >
                <path
                  d="M18.3998 20C19.2838 20 19.9998 19.284 19.9998 18.4C19.9998 17.516 19.2838 16.8 18.3998 16.8C17.5158 16.8 16.7998 17.516 16.7998 18.4C16.7998 19.284 17.5158 20 18.3998 20Z"
                  fill="currentColor"
                />
              </g>
            </g>
          </g>
        </g>
      </svg>
      {showText && (
        <p className="animate-pulse font-medium text-foreground text-sm">
          {funnyMessages[messageIndex]}
        </p>
      )}
    </div>
  );
}
