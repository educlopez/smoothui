"use client";

import { ClientTweetCard, TweetSkeleton } from "@repo/smoothui/components";

export default function TweetCardTopDemo() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <div className="grid gap-6 md:grid-cols-2">
        {/* User info at top with default rounded avatar */}
        <ClientTweetCard
          fallback={<TweetSkeleton />}
          id="1944804313156419771"
          userInfoPosition="top"
        />
        {/* User info at top with circular avatar */}
        <ClientTweetCard
          avatarRounded="rounded-full"
          fallback={<TweetSkeleton />}
          id="2010439383795810775"
          userInfoPosition="top"
        />
      </div>
    </div>
  );
}
