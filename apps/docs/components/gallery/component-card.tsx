"use client";

import type { GalleryComponentMeta } from "@docs/lib/gallery";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { Check, Copy, Package } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { GalleryPreview } from "./gallery-preview";

const formatSize = (bytes: number): string => {
  const kb = bytes / 1024;
  return `~${kb.toFixed(1)} kB`;
};

export type ComponentCardProps = {
  component: GalleryComponentMeta;
};

export const ComponentCard = ({ component }: ComponentCardProps) => {
  const shouldReduceMotion = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const [isHoverDevice, setIsHoverDevice] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    setIsHoverDevice(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsHoverDevice(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const handleCopy = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!component.installer) {
        return;
      }

      const command = `npx shadcn@latest add @smoothui/${component.installer}`;
      navigator.clipboard.writeText(command);
      setCopied(true);
    },
    [component.installer]
  );

  useEffect(() => {
    if (!copied) {
      return;
    }
    const timeout = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timeout);
  }, [copied]);

  return (
    <motion.div
      className="group relative"
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
      animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { type: "spring", duration: 0.25, bounce: 0.1 }
      }
      whileHover={
        isHoverDevice && !shouldReduceMotion
          ? { y: -2 }
          : undefined
      }
    >
      <Link
        aria-label={`View ${component.title} component`}
        className={cn(
          "flex flex-col overflow-hidden rounded-lg border border-border bg-card no-underline",
          "transition-shadow",
          isHoverDevice && "hover:shadow-md hover:border-primary/30"
        )}
        href={component.href}
      >
        {/* Preview */}
        <GalleryPreview slug={component.slug} title={component.title} />

        {/* Card content */}
        <div className="flex flex-1 flex-col gap-2 border-t p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 space-y-1">
              <h3 className="font-semibold text-foreground text-sm leading-tight">
                {component.title}
              </h3>
              <p className="line-clamp-2 text-muted-foreground text-xs leading-relaxed">
                {component.description}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  "inline-flex rounded-full border px-2 py-0.5 font-medium text-[10px] leading-tight",
                  "border-border text-muted-foreground"
                )}
              >
                {component.category}
              </span>
              {component.bundleSize && (
                <span
                  className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground/70"
                  title={`Gzipped: ${formatSize(component.bundleSize.gzipped)}`}
                >
                  <Package aria-hidden="true" className="h-2.5 w-2.5" />
                  {formatSize(component.bundleSize.gzipped)}
                </span>
              )}
            </div>

            {component.installer && (
              <button
                aria-label={copied ? "Copied install command" : `Copy install command for ${component.title}`}
                className={cn(
                  "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[10px]",
                  "transition-colors",
                  copied
                    ? "border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400"
                    : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                )}
                onClick={handleCopy}
                type="button"
              >
                {copied ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
                {copied ? "Copied" : "Install"}
              </button>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
