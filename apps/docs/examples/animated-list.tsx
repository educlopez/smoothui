"use client";

import type { AnimatedListItem } from "@repo/smoothui/components/animated-list";
import AnimatedList from "@repo/smoothui/components/animated-list";
import { useState } from "react";

type Activity = {
  avatar: string;
  id: string;
  message: string;
  name: string;
};

const ACTIVITIES: Activity[] = [
  {
    avatar: "https://i.pravatar.cc/128?img=11",
    id: "activity-1",
    message: "starred the repository",
    name: "Mira Solheim",
  },
  {
    avatar: "https://i.pravatar.cc/128?img=22",
    id: "activity-2",
    message: "opened a pull request",
    name: "Teo Kariba",
  },
  {
    avatar: "https://i.pravatar.cc/128?img=33",
    id: "activity-3",
    message: "left a comment",
    name: "Priya Chandran",
  },
  {
    avatar: "https://i.pravatar.cc/128?img=44",
    id: "activity-4",
    message: "merged a branch",
    name: "Owen Faasi",
  },
  {
    avatar: "https://i.pravatar.cc/128?img=55",
    id: "activity-5",
    message: "deployed to production",
    name: "Lucia Bergman",
  },
  {
    avatar: "https://i.pravatar.cc/128?img=66",
    id: "activity-6",
    message: "created a new project",
    name: "Devon Ashcroft",
  },
];

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
