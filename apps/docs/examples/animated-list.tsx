"use client";

import type { AnimatedListItem } from "@repo/smoothui/components/animated-list";
import AnimatedList from "@repo/smoothui/components/animated-list";
import { somePeople } from "@smoothui/data/people";
import { useState } from "react";

type Activity = {
  avatar: string;
  id: string;
  message: string;
  name: string;
};

const MESSAGES = [
  "starred the repository",
  "opened a pull request",
  "left a comment",
  "merged a branch",
  "deployed to production",
  "created a new project",
];

const ACTIVITIES: Activity[] = somePeople(MESSAGES.length, 60).map(
  (person, index) => ({
    avatar: `${person.avatar}?tr=w-128,h-128,f-auto`,
    id: person.id,
    message: MESSAGES[index],
    name: person.name,
  })
);

const buildItems = (): AnimatedListItem[] =>
  ACTIVITIES.map((activity) => ({
    content: (
      <div className="flex items-center gap-3 rounded-xl border border-foreground/10 bg-background px-3 py-2">
        <img
          alt={activity.name}
          className="size-8 shrink-0 rounded-full object-cover"
          height={32}
          src={activity.avatar}
          width={32}
        />
        <p className="text-foreground text-sm leading-snug">
          <span className="font-medium">{activity.name}</span>{" "}
          <span className="text-muted-foreground">{activity.message}</span>
        </p>
      </div>
    ),
    id: activity.id,
  }));

export default function AnimatedListDemo() {
  const [items] = useState<AnimatedListItem[]>(buildItems);
  const [lastClicked, setLastClicked] = useState<string | null>(null);

  return (
    <div className="mx-auto w-full max-w-md px-4 py-8">
      <AnimatedList
        className="w-full"
        feed
        feedInterval={1400}
        items={items}
        maxVisible={4}
        onItemClick={(id) => setLastClicked(id)}
        pauseOnHover
      />
      <p aria-live="polite" className="mt-4 text-muted-foreground text-xs">
        {lastClicked
          ? `You selected: ${lastClicked}`
          : "Hover the list to pause the feed, click a row to select it."}
      </p>
    </div>
  );
}
