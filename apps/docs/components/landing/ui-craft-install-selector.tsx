"use client";

import {
  BrewInstallIcon,
  ClaudeInstallIcon,
  NpxInstallIcon,
} from "@docs/components/landing/logos/install-method-icons";
import { useUiSound } from "@docs/components/sound-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/shadcn-ui/components/ui/dropdown-menu";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  IconCheckFill24,
  IconChevronDownFill24,
  IconCopy2Fill24,
} from "nucleo-core-fill-24";
import type { ComponentType, SVGProps } from "react";
import { useEffect, useRef, useState } from "react";

const INSTALL_METHODS = [
  {
    id: "brew",
    label: "brew",
    command: "brew install --cask educlopez/tap/ui-craft",
    followUp: "Then run ui-craft install",
    Icon: BrewInstallIcon,
  },
  {
    id: "npx",
    label: "npx",
    command: "npx skills add educlopez/ui-craft",
    Icon: NpxInstallIcon,
  },
  {
    id: "claude",
    label: "Claude",
    command: "/plugin install ui-craft",
    Icon: ClaudeInstallIcon,
  },
] as const;

type InstallMethodId = (typeof INSTALL_METHODS)[number]["id"];
type InstallMethodIcon = ComponentType<SVGProps<SVGSVGElement>>;

interface UiCraftInstallSelectorProps {
  className?: string;
  defaultMethod?: InstallMethodId;
}

function MethodIcon({
  icon: Icon,
  className,
}: {
  icon: InstallMethodIcon;
  className?: string;
}) {
  return <Icon className={cn("text-current", className)} />;
}

export function UiCraftInstallSelector({
  className,
  defaultMethod = "brew",
}: UiCraftInstallSelectorProps) {
  const shouldReduceMotion = useReducedMotion();
  const playCopied = useUiSound("/sounds/celebration.wav", 0.35);
  const [methodId, setMethodId] = useState<InstallMethodId>(defaultMethod);
  const [copied, setCopied] = useState(false);
  const ghostRef = useRef<HTMLSpanElement>(null);
  const wrapRef = useRef<HTMLSpanElement>(null);

  const method =
    INSTALL_METHODS.find((item) => item.id === methodId) ?? INSTALL_METHODS[0];

  const sizeToCommand = () => {
    if (!(ghostRef.current && wrapRef.current)) {
      return;
    }
    wrapRef.current.style.width = `${ghostRef.current.offsetWidth}px`;
  };

  useEffect(() => {
    sizeToCommand();
  }, [method.command]);

  useEffect(() => {
    const onResize = () => sizeToCommand();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [method.command]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(method.command);
      setCopied(true);
      playCopied();
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard unavailable — no-op
    }
  };

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="inline-flex max-w-[calc(100vw-4rem)] items-center gap-1 rounded-xl border border-white/25 bg-white/10 py-1.5 pr-1 pl-1.5 shadow-[0_1px_2px_oklch(0%_0_0/0.08)] backdrop-blur-md">
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 font-medium text-sm text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40">
            <MethodIcon className="text-white/80" icon={method.Icon} />
            <span>{method.label}</span>
            <IconChevronDownFill24
              aria-hidden
              className="size-3.5 text-white/70"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="min-w-[9.5rem] rounded-xl p-1 shadow-[0_1px_2px_oklch(0%_0_0/0.04),0_8px_28px_oklch(0%_0_0/0.12)]"
            sideOffset={8}
          >
            {INSTALL_METHODS.map((item) => {
              const isSelected = item.id === methodId;

              return (
                <DropdownMenuItem
                  className="gap-2 rounded-lg px-2 py-1.5 font-medium text-[13px]"
                  key={item.id}
                  onSelect={() => setMethodId(item.id)}
                >
                  <MethodIcon
                    className="text-muted-foreground"
                    icon={item.Icon}
                  />
                  <span className="flex-1 text-left">{item.label}</span>
                  <svg
                    aria-hidden
                    className={cn(
                      "size-3.5 shrink-0 text-brand",
                      isSelected ? "opacity-100" : "opacity-0"
                    )}
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.4"
                    viewBox="0 0 24 24"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        <span aria-hidden className="my-1 w-px self-stretch bg-white/20" />

        <span
          aria-hidden
          className="select-none pl-1 font-mono text-sm text-white/60"
        >
          $
        </span>

        <span
          className="relative block max-w-[min(100vw-12rem,28rem)] overflow-hidden"
          ref={wrapRef}
          style={
            shouldReduceMotion
              ? undefined
              : { transition: "width 400ms cubic-bezier(0.32, 0.72, 0, 1)" }
          }
        >
          <span
            aria-hidden
            className="pointer-events-none invisible absolute whitespace-nowrap font-mono text-sm"
            ref={ghostRef}
          >
            {method.command}
          </span>
          <code className="block max-w-full overflow-x-auto whitespace-nowrap font-mono text-sm text-white [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {method.command}
          </code>
        </span>

        <button
          aria-label="Copy install command"
          className="group relative flex size-8 shrink-0 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          onClick={copy}
          type="button"
        >
          <AnimatePresence initial={false} mode="wait">
            {copied ? (
              <motion.span
                animate={
                  shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }
                }
                initial={
                  shouldReduceMotion
                    ? { opacity: 1 }
                    : { opacity: 0, scale: 0.6 }
                }
                key="check"
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 500, damping: 28 }
                }
              >
                <IconCheckFill24 className="size-4 text-brand-lighter" />
              </motion.span>
            ) : (
              <motion.span
                animate={{ opacity: 1 }}
                exit={
                  shouldReduceMotion
                    ? { opacity: 0, transition: { duration: 0 } }
                    : { opacity: 0, scale: 0.6 }
                }
                initial={{ opacity: 1 }}
                key="copy"
              >
                <IconCopy2Fill24 className="size-4" />
              </motion.span>
            )}
          </AnimatePresence>
          <span aria-live="polite" className="sr-only">
            {copied ? "Copied to clipboard" : ""}
          </span>
        </button>
      </div>

      {"followUp" in method && method.followUp ? (
        <p className="font-mono text-white/60 text-xs">{method.followUp}</p>
      ) : null}
    </div>
  );
}
