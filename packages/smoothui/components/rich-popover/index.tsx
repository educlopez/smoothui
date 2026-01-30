"use client";

import {
  Arrow as PopoverArrow,
  Content as PopoverContent,
  Portal as PopoverPortal,
  Root as PopoverRoot,
  Trigger as PopoverTrigger,
} from "@radix-ui/react-popover";
import { Clock, ExternalLink, Play } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import type * as React from "react";

export interface RichTooltipProps {
  trigger: React.ReactNode;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  href?: string;
  actionLabel?: string;
  actionHref?: string;
  onActionClick?: () => void;
  meta?: string;
  className?: string;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
}

export function YouTubeIcon({
  className = "h-4 w-4 fill-red-600",
}: {
  className?: string;
}) {
  return (
    <svg
      aria-label="YouTube"
      className={className}
      focusable="false"
      height="16"
      role="img"
      viewBox="0 0 16 16"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.01 2.01 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.01 2.01 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31 31 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.01 2.01 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A100 100 0 0 1 7.858 2zM6.4 5.209v4.818l4.157-2.408z" />
    </svg>
  );
}

export default function RichTooltip({
  trigger,
  title,
  description,
  icon,
  href,
  actionLabel,
  actionHref,
  onActionClick,
  meta,
  className = "",
  side = "top",
  align = "center",
}: RichTooltipProps) {
  const shouldReduceMotion = useReducedMotion();
  const Title = (
    <div className="flex items-center gap-2 font-medium text-sm">
      {icon ?? <YouTubeIcon />}
      {href ? (
        <a
          className="inline-flex items-center gap-1 hover:underline"
          href={href}
          rel="noopener noreferrer"
          target="_blank"
        >
          <span>{title}</span>
          <ExternalLink className="h-3.5 w-3.5 opacity-70" />
        </a>
      ) : (
        <span>{title}</span>
      )}
    </div>
  );

  const renderAction = () => {
    if (!actionLabel) {
      return null;
    }

    const actionClassName =
      "inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 font-medium text-black text-xs transition-colors hover:bg-white/90";

    if (actionHref) {
      return (
        <a
          className={actionClassName}
          href={actionHref}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Play className="h-3.5 w-3.5" /> {actionLabel}
        </a>
      );
    }

    return (
      <button className={actionClassName} onClick={onActionClick} type="button">
        <Play className="h-3.5 w-3.5" /> {actionLabel}
      </button>
    );
  };

  const Action = renderAction();

  return (
    <PopoverRoot>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverPortal>
        <PopoverContent
          align={align}
          asChild
          className={`z-50 ${className}`}
          side={side}
          sideOffset={8}
        >
          <motion.div
            animate={
              shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }
            }
            className="relative rounded-2xl border border-white/10 bg-black px-4 py-3 text-white shadow-xl"
            exit={
              shouldReduceMotion
                ? { opacity: 0, transition: { duration: 0 } }
                : { opacity: 0, scale: 0.95, y: 5, filter: "blur(8px)" }
            }
            initial={
              shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 0, scale: 0.95, y: 5, filter: "blur(8px)" }
            }
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : {
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                    duration: 0.2,
                  }
            }
          >
            {Title}
            {description && (
              <p className="mt-3 max-w-xs text-balance text-base text-white/90 leading-relaxed">
                {description}
              </p>
            )}
            {(meta || Action) && (
              <div className="mt-4 flex items-center justify-between gap-3">
                {meta ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-white text-xs">
                    <Clock className="h-3.5 w-3.5" /> {meta}
                  </span>
                ) : (
                  <span />
                )}
                {Action}
              </div>
            )}

            {/* Tail */}
            <PopoverArrow className="fill-black" />
          </motion.div>
        </PopoverContent>
      </PopoverPortal>
    </PopoverRoot>
  );
}
