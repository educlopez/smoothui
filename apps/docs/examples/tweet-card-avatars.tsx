"use client";

import { ClientTweetCard, TweetSkeleton } from "@repo/smoothui/components";

export default function TweetCardAvatarsDemo() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Default rounded */}
        <ClientTweetCard
          avatarRounded="rounded"
          fallback={<TweetSkeleton />}
          id="1944804313156419771"
        />
        {/* Circular avatar */}
        <ClientTweetCard
          avatarRounded="rounded-full"
          fallback={<TweetSkeleton />}
          id="2010439383795810775"
        />
        {/* Large rounded */}
        <ClientTweetCard
          avatarRounded="rounded-lg"
          fallback={<TweetSkeleton />}
          id="1944804313156419771"
        />
        {/* Medium rounded */}
        <ClientTweetCard
          avatarRounded="rounded-md"
          fallback={<TweetSkeleton />}
          id="2010439383795810775"
        />
      </div>
    </div>
  );
}
