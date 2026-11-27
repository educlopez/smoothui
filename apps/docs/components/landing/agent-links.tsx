"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import {
  DURATION,
  DURATION_INSTANT,
  EASE_OUT,
  spring,
} from "@repo/smoothui/lib/animation";
import { Plus } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useIsPresent,
  useReducedMotion,
} from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { type Ref, useEffect, useRef, useState } from "react";

const PRIMARY_AGENTS = [
  { href: "/docs/guides/mcp", icon: "claude.png", name: "Claude Code" },
  { href: "/docs/guides/mcp", icon: "cursor.png", name: "Cursor" },
  { href: "https://chatgpt.com/", icon: "chatgpt.png", name: "ChatGPT" },
  {
    href: "https://docs.x.ai/grok-bot/computer-and-apps",
    icon: "grok-bot.png",
    name: "Grok Bot",
  },
];

const MORE_AGENTS = [
  {
    href: "https://opencode.ai/docs/mcp-servers/",
    icon: "opencode.png",
    name: "OpenCode",
  },
  { href: "https://pi.dev/", icon: "pi.svg", name: "Pi" },
  {
    href: "https://geminicli.com/docs/",
    icon: "gemini-cli.png",
    name: "Gemini CLI",
  },
];

const SLOT =
  "focus-ring state-transition grid size-10 cursor-pointer place-items-center rounded-lg outline-none";
const TILE = "absolute top-1/2 left-1/2 -mt-5 -ml-5 focus-within:z-20";
const CROWD_SPRING = { ...spring.slow, bounce: 0.18 };
const PRIMARY_POSES = [
  { rotate: -14, x: -84, y: 9 },
  { rotate: 8, x: -44, y: 5 },
  { rotate: -10, x: -4, y: 8 },
  { rotate: 14, x: 36, y: 4 },
];
const EXTRA_POSES = [
  { rotate: 10, x: -64, y: -8 },
  { rotate: -12, x: -24, y: -6 },
  { rotate: 14, x: 16, y: -9 },
];

function AgentIcon({ file, size = 36 }: { file: string; size?: number }) {
  return (
    <Image
      alt=""
      height={size}
      src={`/brand/agents/${file}`}
      unoptimized
      width={size}
    />
  );
}

function ExtraAgent({
  agent,
  index,
  reduced,
  firstLink,
}: {
  agent: (typeof MORE_AGENTS)[number];
  index: number;
  reduced: boolean;
  firstLink?: Ref<HTMLAnchorElement>;
}) {
  const present = useIsPresent();
  const pose = EXTRA_POSES[index];

  return (
    <motion.li
      animate={{ opacity: 1, scale: 1, x: pose.x, y: 20 }}
      aria-hidden={!present}
      className={cn(TILE, "z-10")}
      data-extra-agent=""
      exit={reduced ? { opacity: 0 } : { opacity: 0, x: pose.x + 16, y: 30 }}
      initial={
        reduced ? false : { opacity: 0, scale: 0.95, x: pose.x + 36, y: 32 }
      }
      inert={!present}
      transition={
        reduced
          ? DURATION_INSTANT
          : {
              ...CROWD_SPRING,
              opacity: { delay: index * 0.035, duration: DURATION.fast },
            }
      }
    >
      <Link
        aria-label={agent.name}
        className={SLOT}
        href={agent.href}
        ref={firstLink}
        title={agent.name}
      >
        <motion.span
          aria-hidden="true"
          className={cn(
            "pointer-events-none grid size-9 place-items-center rounded-lg shadow-sm ring-2 ring-background",
            agent.icon === "pi.svg"
              ? "bg-muted"
              : "bg-smooth-950 dark:bg-smooth-100"
          )}
          initial={false}
          style={{ rotate: pose.rotate, y: pose.y }}
        >
          {agent.icon === "pi.svg" ? (
            <span className="mask-[url(/brand/agents/pi.svg)] mask-contain mask-center mask-no-repeat size-5 bg-foreground" />
          ) : (
            <AgentIcon file={agent.icon} size={24} />
          )}
        </motion.span>
      </Link>
    </motion.li>
  );
}

export function AgentLinks() {
  const reduced = useReducedMotion() ?? false;
  const [preview, setPreview] = useState(false);
  const [pinned, setPinned] = useState(false);
  const row = useRef<HTMLUListElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const firstExtra = useRef<HTMLAnchorElement>(null);
  const focusExtra = useRef(false);
  const expanded = preview || pinned;
  const transition = reduced ? DURATION_INSTANT : CROWD_SPRING;

  useEffect(() => {
    if (expanded && focusExtra.current) {
      firstExtra.current?.focus();
      focusExtra.current = false;
    }
  }, [expanded, pinned]);

  useEffect(() => {
    if (!pinned) {
      return;
    }
    const closeOutside = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !row.current?.contains(event.target)
      ) {
        setPreview(false);
        setPinned(false);
      }
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [pinned]);

  const close = () => {
    setPreview(false);
    setPinned(false);
    focusExtra.current = false;
  };

  return (
    <ul
      aria-label="AI agent resources"
      className="relative mt-5 h-14 w-64 max-w-full"
      data-expanded={expanded}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          close();
        }
      }}
      onKeyDown={(event) => {
        if (expanded && event.key === "Escape") {
          event.stopPropagation();
          toggle.current?.focus();
          close();
        }
      }}
      onPointerLeave={() => {
        if (!document.activeElement?.closest("[data-extra-agent]")) {
          setPreview(false);
        }
      }}
      ref={row}
    >
      {PRIMARY_AGENTS.map(({ href, icon, name }, index) => {
        const pose = PRIMARY_POSES[index];
        return (
          <motion.li
            animate={{
              x: expanded ? pose.x : (index - 2) * 48,
              y: expanded ? -20 : 0,
            }}
            className={TILE}
            initial={false}
            key={name}
            transition={transition}
          >
            <Link aria-label={name} className={SLOT} href={href} title={name}>
              <motion.span
                animate={{
                  rotate: expanded ? pose.rotate : 0,
                  y: expanded ? pose.y : 0,
                }}
                className="pointer-events-none"
                initial={false}
                transition={transition}
              >
                <AgentIcon file={icon} />
              </motion.span>
            </Link>
          </motion.li>
        );
      })}
      <AnimatePresence initial={false}>
        {expanded
          ? MORE_AGENTS.map((agent, index) => (
              <ExtraAgent
                agent={agent}
                firstLink={index === 0 ? firstExtra : undefined}
                index={index}
                key={agent.name}
                reduced={reduced}
              />
            ))
          : null}
      </AnimatePresence>
      <li className={cn(TILE, "translate-x-24")}>
        <button
          aria-expanded={expanded}
          aria-label="More AI agents"
          className={cn(
            SLOT,
            "text-muted-foreground hover:bg-muted hover:text-foreground",
            expanded && "bg-muted"
          )}
          onClick={(event) => {
            if (pinned || (preview && event.detail === 0)) {
              close();
              return;
            }
            focusExtra.current = event.detail === 0;
            setPinned(true);
          }}
          onPointerEnter={(event) => {
            if (
              event.pointerType === "mouse" &&
              window.matchMedia("(any-hover: hover) and (any-pointer: fine)")
                .matches
            ) {
              setPreview(true);
            }
          }}
          ref={toggle}
          type="button"
        >
          <motion.span
            animate={{ rotate: expanded ? 45 : 0 }}
            initial={false}
            transition={
              reduced
                ? DURATION_INSTANT
                : { duration: DURATION.fast, ease: EASE_OUT }
            }
          >
            <Plus aria-hidden="true" className="size-4" />
          </motion.span>
        </button>
      </li>
    </ul>
  );
}
