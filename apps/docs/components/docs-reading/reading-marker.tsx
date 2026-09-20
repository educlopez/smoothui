"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { type ReactNode, useEffect, useRef } from "react";

import { isDemoHeading, useDemoSync } from "./demo-sync";

/** How far down the column the reading line sits. */
const BAND = 0.32;

/** What the sections that are not being read fade back to. */
const RESTING = "0.55";

/** How much of the top of the window the navbar covers. */
const BAR = 96;

const isHeading = (tagName: string) => tagName === "H2" || tagName === "H3";

/**
 * Fumadocs injects a "Copy Anchor Link" button inside headings. Using the
 * whole `textContent` would send "SwitchCopy Anchor Link" and never match a
 * demo scene — pull the visible title only.
 */
const headingLabel = (heading: HTMLElement): string => {
  const clone = heading.cloneNode(true) as HTMLElement;
  for (const node of clone.querySelectorAll("button, [role='button']")) {
    node.remove();
  }
  return clone.textContent?.replace(/\s+/g, " ").trim() ?? "";
};

/**
 * The nearest ancestor the content actually scrolls in, or null for the
 * document itself.
 *
 * Matched on behaviour rather than on a class name, so this keeps working if
 * the scrolling wrapper around it is ever rebuilt.
 */
const scrollerOf = (el: HTMLElement): HTMLElement | null => {
  let node = el.parentElement;
  while (node) {
    const overflow = getComputedStyle(node).overflowY;
    if (overflow === "auto" || overflow === "scroll") {
      return node;
    }
    node = node.parentElement;
  }
  return null;
};

/** The part of the window the column is read in, in viewport coordinates. */
const frameOf = (
  scroller: HTMLElement | null
): { top: number; height: number } => {
  if (scroller) {
    const box = scroller.getBoundingClientRect();
    return { height: scroller.clientHeight, top: box.top };
  }
  return { height: window.innerHeight - BAR, top: BAR };
};

/** Whether the scroll is against one of its ends, within a pixel or two. */
const endsOf = (
  scroller: HTMLElement | null
): { atStart: boolean; atEnd: boolean } => {
  const top = scroller ? scroller.scrollTop : window.scrollY;
  const height = scroller ? scroller.clientHeight : window.innerHeight;
  const total = scroller
    ? scroller.scrollHeight
    : document.documentElement.scrollHeight;

  return { atEnd: top + height >= total - 2, atStart: top <= 2 };
};

export interface ReadingMarkerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Marks which section of a long column is being read, and stands the rest of
 * it down.
 *
 * Sections are delimited by the `h2`s and `h3`s the column already has, so
 * nothing in the content needs marking up. A column with no headings gets
 * neither the rule nor the dimming.
 *
 * Nothing here is React state. A scroll handler that sets state renders the
 * whole column on every frame of a scroll, and each render re-applies the
 * same transform mid-transition — the rule restarts its travel forever and
 * never arrives.
 */
export const ReadingMarker = ({ children, className }: ReadingMarkerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const ruleRef = useRef<HTMLSpanElement>(null);

  const { showSection } = useDemoSync();
  const showSectionRef = useRef(showSection);
  showSectionRef.current = showSection;

  useEffect(() => {
    const root = ref.current;
    if (!root) {
      return;
    }

    const column = root;
    const scroller = scrollerOf(root);
    const source: HTMLElement | Window = scroller ?? window;

    const own = Array.from(root.children).filter(
      (el): el is HTMLElement =>
        el instanceof HTMLElement && el !== ruleRef.current
    );
    const host = own.length === 1 && own[0] ? own[0] : root;

    const blocks =
      host === root
        ? own
        : Array.from(host.children).filter(
            (el): el is HTMLElement => el instanceof HTMLElement
          );

    const groups: HTMLElement[][] = [];
    for (const block of blocks) {
      if (isHeading(block.tagName) || groups.length === 0) {
        groups.push([]);
      }
      groups.at(-1)?.push(block);
    }

    const rule = ruleRef.current;
    if (groups.length < 2) {
      if (rule) {
        rule.style.opacity = "0";
      }
      return;
    }

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const ease = "cubic-bezier(0.32, 0.72, 0, 1)";

    for (const block of blocks) {
      block.style.transition = motion.matches
        ? "none"
        : `opacity 300ms ${ease}`;
    }
    if (rule) {
      rule.style.transition = motion.matches
        ? "opacity 200ms linear"
        : `transform 420ms ${ease}, height 420ms ${ease}, opacity 200ms linear`;
    }

    let current = -1;

    const paint = (index: number) => {
      if (index === current) {
        return;
      }
      current = index;

      for (const [i, group] of groups.entries()) {
        for (const block of group) {
          block.style.opacity = i === index ? "1" : RESTING;
        }
      }

      // Prefer the deepest heading in the group (h3 over h2) so a Variants
      // section that already named a leaf like "Orb" drives that leaf, not the
      // parent overview. Skip meta headings so Installation/Props leave the
      // panel alone.
      const headings = groups[index]?.filter((block) =>
        isHeading(block.tagName)
      );
      let heading: HTMLElement | undefined;
      for (let i = (headings?.length ?? 0) - 1; i >= 0; i -= 1) {
        const candidate = headings?.[i];
        if (candidate?.tagName === "H3") {
          heading = candidate;
          break;
        }
      }
      heading ??= headings?.find((block) => block.tagName === "H2");
      const label = heading ? headingLabel(heading) : "";
      if (label && isDemoHeading(label)) {
        showSectionRef.current(label);
      }

      const group = groups[index];
      const first = group?.[0];
      const last = group?.at(-1);
      if (!(rule && first && last)) {
        return;
      }

      const origin = column.getBoundingClientRect().top;
      const top = first.getBoundingClientRect().top - origin;
      const height = last.getBoundingClientRect().bottom - origin - top;

      rule.style.transform = `translateY(${top}px)`;
      rule.style.height = `${height}px`;
      rule.style.opacity = "1";
    };

    const measure = () => {
      const { atStart, atEnd } = endsOf(scroller);
      if (atStart) {
        paint(0);
        return;
      }
      if (atEnd) {
        paint(groups.length - 1);
        return;
      }

      const frame = frameOf(scroller);
      const line = frame.top + frame.height * BAND;

      let index = 0;
      for (let i = 0; i < groups.length; i += 1) {
        const group = groups[i];
        const first = group?.[0];
        if (!first) {
          continue;
        }
        if (first.getBoundingClientRect().top > line) {
          break;
        }
        index = i;
      }

      paint(index);
    };

    const remeasure = () => {
      const index = current;
      current = -1;
      paint(index === -1 ? 0 : index);
    };

    measure();
    source.addEventListener("scroll", measure, { passive: true });

    const observer = new ResizeObserver(remeasure);
    observer.observe(host);
    if (scroller) {
      observer.observe(scroller);
    }

    return () => {
      source.removeEventListener("scroll", measure);
      observer.disconnect();
      for (const block of blocks) {
        block.style.transition = "";
        block.style.opacity = "";
      }
    };
  }, []);

  return (
    <div className={cn("relative", className)} ref={ref}>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-0 -left-4 w-0.5 rounded-full bg-foreground opacity-0"
        ref={ruleRef}
      />
      {children}
    </div>
  );
};
