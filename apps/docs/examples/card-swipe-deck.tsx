"use client";

import type {
  CardSwipeDeckHandle,
  CardSwipeDeckItem,
} from "@repo/smoothui/components/card-swipe-deck";
import CardSwipeDeck from "@repo/smoothui/components/card-swipe-deck";
import SmoothButton from "@repo/smoothui/components/smooth-button";
import { Heart, RotateCcw, X } from "lucide-react";
import { useRef, useState } from "react";

const PROFILES = [
  {
    age: 27,
    id: "nova",
    location: "Lisbon · 4 km away",
    name: "Nova",
    tags: ["Product design", "Film", "Cortado"],
  },
  {
    age: 31,
    id: "kai",
    location: "Porto · 12 km away",
    name: "Kai",
    tags: ["Frontend", "Bouldering", "Vinyl"],
  },
  {
    age: 24,
    id: "rui",
    location: "Lisbon · 2 km away",
    name: "Rui",
    tags: ["Illustration", "Ceramics", "Jazz"],
  },
  {
    age: 29,
    id: "sage",
    location: "Braga · 38 km away",
    name: "Sage",
    tags: ["Motion", "Surfing", "Ramen"],
  },
  {
    age: 26,
    id: "mira",
    location: "Sintra · 21 km away",
    name: "Mira",
    tags: ["Type design", "Trail running"],
  },
] as const;

const items: CardSwipeDeckItem[] = PROFILES.map((profile) => ({
  content: (
    <div className="relative h-full w-full bg-muted">
      <img
        alt={`Portrait of ${profile.name}`}
        className="h-full w-full object-cover"
        src={`https://picsum.photos/seed/smoothui-${profile.id}/600/760`}
      />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2.5 p-5">
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-2xl text-white tracking-tight">
            {profile.name}
          </span>
          <span className="font-light text-white/85 text-xl tabular-nums">
            {profile.age}
          </span>
        </div>
        <span className="text-[13px] text-white/75">{profile.location}</span>
        <div className="flex flex-wrap gap-1.5">
          {profile.tags.map((tag) => (
            <span
              className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] text-white/90 ring-1 ring-white/25 backdrop-blur-sm"
              key={tag}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  ),
  id: profile.id,
}));

export default function CardSwipeDeckDemo() {
  const deckRef = useRef<CardSwipeDeckHandle>(null);
  const [liked, setLiked] = useState<string[]>([]);
  const [passed, setPassed] = useState<string[]>([]);

  const handleSwipe = (id: string, direction: "left" | "right") => {
    if (direction === "right") {
      setLiked((prev) => [...prev, id]);
    } else {
      setPassed((prev) => [...prev, id]);
    }
  };

  const reset = () => {
    setLiked([]);
    setPassed([]);
    deckRef.current?.reset();
  };

  return (
    <div className="flex w-full items-center justify-center gap-5 py-8 sm:gap-9">
      <CardSwipeDeck
        className="h-[400px] w-[286px] sm:h-[480px] sm:w-[340px]"
        items={items}
        labels={{ left: "Nope", right: "Like" }}
        onSwipe={handleSwipe}
        ref={deckRef}
      />

      <div className="flex w-[132px] shrink-0 flex-col gap-6 sm:w-[152px]">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-baseline justify-between gap-2 border-foreground/10 border-b pb-2">
            <span className="text-muted-foreground text-xs">Liked</span>
            <span className="font-semibold text-green text-lg tabular-nums">
              {liked.length}
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-2 border-foreground/10 border-b pb-2">
            <span className="text-muted-foreground text-xs">Passed</span>
            <span className="font-semibold text-destructive text-lg tabular-nums">
              {passed.length}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <SmoothButton
            aria-label="Pass"
            color="destructive"
            onClick={() => deckRef.current?.swipeLeft()}
            shape="pill"
            size="icon"
            variant="soft"
          >
            <X />
          </SmoothButton>
          <SmoothButton
            aria-label="Like"
            color="green"
            onClick={() => deckRef.current?.swipeRight()}
            shape="pill"
            size="icon"
            variant="solid"
          >
            <Heart />
          </SmoothButton>
          <SmoothButton
            aria-label="Reset the deck"
            onClick={reset}
            shape="pill"
            size="icon-sm"
            variant="ghost"
          >
            <RotateCcw />
          </SmoothButton>
        </div>

        <p className="text-[11px] text-muted-foreground leading-snug">
          Drag the card, or use the buttons — both run the same gesture.
        </p>
      </div>
    </div>
  );
}
