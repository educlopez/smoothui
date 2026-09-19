"use client";

import type { PinnedListItem } from "@repo/smoothui/components/pinned-list";
import PinnedList from "@repo/smoothui/components/pinned-list";
import SmoothButton from "@repo/smoothui/components/smooth-button";
import {
  Figma,
  FileText,
  GitPullRequest,
  Megaphone,
  MessageCircle,
  Rocket,
  Star,
  Users,
} from "lucide-react";
import { useState } from "react";

const MAX_PINNED = 4;

const ITEMS: PinnedListItem[] = [
  {
    icon: <MessageCircle className="size-4" />,
    id: "conv-nadia",
    meta: "“Numbers are in — they look good.”",
    title: "Nadia Ferreira",
  },
  {
    icon: <Rocket className="size-4" />,
    id: "team-launch",
    meta: "8 members · active now",
    title: "Launch War Room",
  },
  {
    icon: <FileText className="size-4" />,
    id: "doc-roadmap",
    meta: "Edited yesterday by Hiro",
    title: "Q3 Roadmap Draft",
  },
  {
    icon: <GitPullRequest className="size-4" />,
    id: "pr-registry",
    meta: "#482 · 2 approvals, 1 change requested",
    title: "feat: registry bundling",
  },
  {
    icon: <Figma className="size-4" />,
    id: "design-tokens",
    meta: "3 new comments",
    title: "Design tokens · v4",
  },
  {
    icon: <Star className="size-4" />,
    id: "conv-hiro",
    meta: "“Shipping the fix tonight.”",
    title: "Hiro Tanaka",
  },
  {
    icon: <Users className="size-4" />,
    id: "team-support",
    meta: "12 members · 4 unread",
    title: "Customer Support",
  },
  {
    icon: <Megaphone className="size-4" />,
    id: "chan-announcements",
    meta: "Last post 3h ago",
    title: "Announcements",
  },
];

const DEFAULT_PINNED = ["conv-nadia", "team-launch", "doc-roadmap"];

export default function PinnedListDemo() {
  const [pinned, setPinned] = useState<string[]>(DEFAULT_PINNED);

  return (
    <div className="flex h-[26rem] w-full gap-4 overflow-hidden rounded-2xl border border-border bg-muted/30 p-4">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2.5">
        <header className="flex shrink-0 items-baseline justify-between gap-3">
          <h3 className="font-semibold text-base text-foreground tracking-tight">
            Inbox
          </h3>
          <span className="text-muted-foreground text-xs tabular-nums">
            {pinned.length} / {MAX_PINNED} pinned
          </span>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          <PinnedList
            emptyPinnedMessage="Nothing pinned — pin a row to keep it up here."
            items={ITEMS}
            label="Inbox items"
            maxPinned={MAX_PINNED}
            onPinnedChange={setPinned}
            pinnedIds={pinned}
            showDivider
          />
        </div>
      </div>

      <aside className="hidden w-52 shrink-0 flex-col gap-3 rounded-xl border border-border bg-background/70 p-3 sm:flex">
        <div>
          <p className="font-medium text-foreground text-sm">Try it</p>
          <p className="mt-1 text-muted-foreground text-xs leading-relaxed">
            Click a row, or tab into the list and use the keys below. Pinning
            launches the row into the pinned group on an overshooting spring,
            the pin snaps 45°, and the rows underneath close the gap one after
            another.
          </p>
        </div>

        <ul className="flex flex-col gap-1.5 text-muted-foreground text-xs">
          <li className="flex items-center gap-1.5">
            <kbd className="rounded border border-border bg-muted px-1.5 font-mono">
              ↑
            </kbd>
            <kbd className="rounded border border-border bg-muted px-1.5 font-mono">
              ↓
            </kbd>
            Move between rows
          </li>
          <li className="flex items-center gap-1.5">
            <kbd className="rounded border border-border bg-muted px-1.5 font-mono">
              P
            </kbd>
            Pin / unpin the focused row
          </li>
          <li className="flex items-center gap-1.5">
            <kbd className="rounded border border-border bg-muted px-1.5 font-mono">
              Home
            </kbd>
            <kbd className="rounded border border-border bg-muted px-1.5 font-mono">
              End
            </kbd>
            First / last
          </li>
        </ul>

        <div className="mt-auto flex flex-col gap-1.5">
          <SmoothButton
            onClick={() => setPinned(DEFAULT_PINNED)}
            size="xs"
            variant="outline"
          >
            Reset
          </SmoothButton>
          <SmoothButton
            disabled={pinned.length === 0}
            onClick={() => setPinned([])}
            size="xs"
            variant="ghost"
          >
            Unpin all
          </SmoothButton>
        </div>
      </aside>
    </div>
  );
}
