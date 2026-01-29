"use client";

import { ClientTweetCard, TweetSkeleton } from "@repo/smoothui/components";
import { ExternalLink } from "lucide-react";
import type { TestimonialMedia } from "./what-they-say";

interface MediaPlayerProps {
  media: TestimonialMedia;
}

// Regex for extracting tweet ID - defined at top level for performance
const TWITTER_URL_REGEX = /(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/;

// Extract Twitter/X tweet ID from URL
function getTwitterId(url: string): string | null {
  const match = url.match(TWITTER_URL_REGEX);
  return match ? match[1] : null;
}

export function MediaPlayer({ media }: MediaPlayerProps) {
  const handleOpenExternal = () => {
    window.open(media.url, "_blank", "noopener,noreferrer");
  };

  const tweetId = getTwitterId(media.url);

  if (!tweetId) {
    return (
      <div className="relative min-h-[400px] overflow-hidden rounded-2xl border bg-background">
        <div className="flex h-full min-h-[400px] items-center justify-center p-6">
          <div className="text-center">
            <p className="mb-4 text-foreground/60 text-sm">Invalid tweet URL</p>
            <button
              className="ease inline-flex items-center gap-2 rounded-lg border bg-background px-4 py-2 text-foreground text-sm transition-colors duration-200 hover:bg-accent"
              onClick={handleOpenExternal}
              type="button"
            >
              <ExternalLink className="h-4 w-4" />
              Open on X
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <ClientTweetCard fallback={<TweetSkeleton />} id={tweetId} />;
}
