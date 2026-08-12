"use client";

import EmojiReaction, {
  type EmojiReactionItem,
} from "@repo/smoothui/components/emoji-reaction";
import SmoothButton from "@repo/smoothui/components/smooth-button";
import { useState } from "react";

const EMOJI_LABELS: Record<string, string> = {
  "\u{1F4AF}": "Nailed it",
  "\u{1F60D}": "Love it",
  "\u{1F389}": "Celebrate",
  "\u{1F440}": "Eyes",
  "\u{1F525}": "Fire",
  "\u{1F680}": "Ship it",
};

const INITIAL_POST: EmojiReactionItem[] = [
  { count: 24, emoji: "👍", id: "like", label: "Like", reacted: true },
  { count: 9, emoji: "❤️", id: "love", label: "Love" },
  { count: 3, emoji: "😂", id: "haha", label: "Haha" },
];

const INITIAL_COMMENT: EmojiReactionItem[] = [
  { count: 6, emoji: "🎉", id: "party", label: "Celebrate" },
  { count: 2, emoji: "🚀", id: "ship", label: "Ship it" },
];

const applyReaction = (
  current: EmojiReactionItem[],
  id: string,
  nextReacted: boolean
): EmojiReactionItem[] => {
  const existing = current.find((reaction) => reaction.id === id);
  if (existing) {
    return current.map((reaction) =>
      reaction.id === id
        ? {
            ...reaction,
            count: Math.max(0, (reaction.count ?? 0) + (nextReacted ? 1 : -1)),
            reacted: nextReacted,
          }
        : reaction
    );
  }
  // The picker reports an emoji that isn't in the bar yet — append it.
  return [
    ...current,
    {
      count: 1,
      emoji: id,
      id,
      label: EMOJI_LABELS[id] ?? "Reaction",
      reacted: true,
    },
  ];
};

export default function EmojiReactionDemo() {
  const [post, setPost] = useState(INITIAL_POST);
  const [comment, setComment] = useState(INITIAL_COMMENT);

  const handleReset = () => {
    setPost(INITIAL_POST);
    setComment(INITIAL_COMMENT);
  };

  return (
    <div className="flex h-full w-full flex-col justify-center gap-3">
      <article className="rounded-2xl border border-foreground/10 bg-background p-4 shadow-black/5 shadow-sm">
        <header className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex size-9 shrink-0 select-none items-center justify-center rounded-full bg-brand/15 font-semibold text-brand text-xs"
          >
            EC
          </span>
          <div className="min-w-0">
            <p className="truncate font-semibold text-foreground text-sm">
              Eduardo Calvo
            </p>
            <p className="truncate text-muted-foreground text-xs">
              @educalvolpz · 2h ago
            </p>
          </div>
        </header>

        <p className="mt-3 text-[15px] text-foreground/85 leading-relaxed">
          Shipped the new page preloader: four curtain styles, zero new deps.
        </p>

        <footer className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <EmojiReaction
            onReact={(id, nextReacted) =>
              setPost((current) => applyReaction(current, id, nextReacted))
            }
            reactions={post}
            showPicker
          />
          <SmoothButton shape="pill" size="sm" variant="ghost">
            Reply
          </SmoothButton>
        </footer>
      </article>

      <div className="flex items-center justify-between gap-3">
        <p className="text-muted-foreground text-sm">Picker open by default</p>
        <SmoothButton
          onClick={handleReset}
          shape="pill"
          size="sm"
          variant="soft"
        >
          Reset counts
        </SmoothButton>
      </div>

      {/* Extra top padding gives the upward popover room inside the card. */}
      <div className="rounded-2xl border border-foreground/10 bg-background px-4 pt-12 pb-4 shadow-black/5 shadow-sm">
        <p className="text-[15px] text-foreground/85 leading-relaxed">
          The curtain one. It reads as intentional, not as a loading state.
        </p>
        <div className="mt-4">
          <EmojiReaction
            defaultPickerOpen
            onReact={(id, nextReacted) =>
              setComment((current) => applyReaction(current, id, nextReacted))
            }
            reactions={comment}
            showPicker
          />
        </div>
      </div>
    </div>
  );
}
