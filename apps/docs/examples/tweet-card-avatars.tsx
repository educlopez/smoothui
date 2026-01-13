"use client";

import { ClientTweetCard, TweetSkeleton } from "@repo/smoothui/components";

export default function TweetCardAvatarsDemo() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Default rounded */}
        <ClientTweetCard
          fallback={<TweetSkeleton />}
          id="1944804313156419771"
          avatarRounded="rounded"
        />
        {/* Circular avatar */}
        <ClientTweetCard
          fallback={<TweetSkeleton />}
          id="2010439383795810775"
          avatarRounded="rounded-full"
        />
        {/* Large rounded */}
        <ClientTweetCard
          fallback={<TweetSkeleton />}
          id="1944804313156419771"
          avatarRounded="rounded-lg"
        />
        {/* Medium rounded */}
        <ClientTweetCard
          fallback={<TweetSkeleton />}
          id="2010439383795810775"
          avatarRounded="rounded-md"
        />
      </div>
    </div>
  );
}
