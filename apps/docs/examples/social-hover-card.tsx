"use client";

import type { SocialProfile } from "@repo/smoothui/components/social-hover-card";
import SocialHoverCard from "@repo/smoothui/components/social-hover-card";
import { somePeople } from "@smoothui/data/people";
import { useState } from "react";

const [person] = somePeople(1, 47);

const PROFILE: SocialProfile = {
  avatar: `${person.avatar}?tr=w-128,h-128,f-auto`,
  bio: "Building playful, accessible interfaces. Currently obsessed with spring physics and tiny delightful details.",
  handle: person.handle.replace("@", ""),
  id: person.id,
  name: person.name,
  stats: [
    { label: "Following", value: 312 },
    { label: "Followers", value: 8420 },
    { label: "Posts", value: 96 },
  ],
  url: `https://example.com/${person.handle.replace("@", "")}`,
  verified: true,
};

export default function SocialHoverCardDemo() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 px-4 py-16">
      <p className="text-center text-foreground/80 text-sm leading-relaxed">
        Say hi to <SocialHoverCard loading={loading} profile={PROFILE} />, who
        just shipped a new release.
      </p>
      <button
        className="rounded-full border border-foreground/10 px-3 py-1 text-xs"
        onClick={() => setLoading((value) => !value)}
        type="button"
      >
        {loading ? "Show loaded card" : "Show loading skeleton"}
      </button>
    </div>
  );
}
