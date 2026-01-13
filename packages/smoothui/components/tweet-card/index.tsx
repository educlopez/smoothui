/* eslint-disable @next/next/no-img-element */

import { cn } from "@repo/shadcn-ui/lib/utils";
import { Suspense } from "react";
import { type EnrichedTweet, enrichTweet, type TweetProps } from "react-tweet";
import { getTweet, type Tweet } from "react-tweet/api";

interface IconProps {
  className?: string;
  [key: string]: unknown;
}

const ExternalLink = ({ className, ...props }: IconProps) => (
  <svg
    className={className}
    fill="none"
    height="16"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width="16"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" x2="21" y1="14" y2="3" />
  </svg>
);

export const truncate = (str: string | null, length: number) => {
  if (!str || str.length <= length) return str;
  return `${str.slice(0, length - 3)}...`;
};

const Skeleton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("rounded-md bg-primary/10", className)} {...props} />
);

export const TweetSkeleton = ({
  className,
  ...props
}: {
  className?: string;
  [key: string]: unknown;
}) => (
  <div
    className={cn(
      "flex size-full max-h-max min-w-72 flex-col gap-2 rounded-xl border p-4",
      className
    )}
    {...props}
  >
    <div className="flex flex-row gap-2">
      <Skeleton className="size-10 shrink-0 rounded-full" />
      <Skeleton className="h-10 w-full" />
    </div>
    <Skeleton className="h-20 w-full" />
  </div>
);

export const TweetNotFound = ({
  className,
  ...props
}: {
  className?: string;
  [key: string]: unknown;
}) => (
  <div
    className={cn(
      "flex size-full flex-col items-center justify-center gap-2 rounded-lg border p-4",
      className
    )}
    {...props}
  >
    <h3>Tweet not found</h3>
  </div>
);

export const TweetHeader = ({
  tweet,
  avatarRounded = "rounded",
}: {
  tweet: EnrichedTweet;
  avatarRounded?: string;
}) => (
  <div className="flex items-center gap-2">
    <a href={tweet.user.url} rel="noreferrer" target="_blank">
      <img
        alt={tweet.user.screen_name}
        className={cn("size-10 object-cover object-center", avatarRounded)}
        height={40}
        loading="eager"
        src={tweet.user.profile_image_url_https}
        title={`Profile picture of ${tweet.user.name}`}
        width={40}
      />
    </a>
    <div>
      <p className="font-semibold text-foreground text-sm tracking-tighter 2xl:text-base">
        {tweet.user.name}
      </p>
      <p className="text-foreground/60 text-xs 2xl:text-sm">
        @{truncate(tweet.user.screen_name, 16)}
      </p>
    </div>
  </div>
);

export const TweetBody = ({ tweet }: { tweet: EnrichedTweet }) => (
  <blockquote className="flex-1">
    <p className="text-balance text-foreground text-sm tracking-tight 2xl:text-base">
      {tweet.entities.map((entity, idx) => {
        switch (entity.type) {
          case "url":
          case "symbol":
          case "hashtag":
          case "mention":
            return (
              <a
                className="ease text-foreground transition-colors duration-200 hover:text-foreground/80"
                href={entity.href}
                key={idx}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span>{entity.text}</span>
              </a>
            );
          case "text":
            return (
              <span
                className="text-foreground"
                dangerouslySetInnerHTML={{ __html: entity.text }}
                key={idx}
              />
            );
        }
      })}
    </p>
  </blockquote>
);

export const TweetMedia = ({ tweet }: { tweet: EnrichedTweet }) => {
  if (!(tweet.video || tweet.photos)) return null;
  return (
    <div className="flex w-full flex-col gap-2">
      {tweet.video && (
        <video
          autoPlay
          className="w-full rounded-xl border shadow-sm"
          loop
          muted
          playsInline
          poster={tweet.video.poster}
        >
          <source src={tweet.video.variants[0].src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      {tweet.photos &&
        (() => {
          const photos = tweet.photos;
          return (
            <div className="relative grid w-full gap-2">
              {photos.length === 1 && (
                <img
                  alt={tweet.text}
                  className="w-full rounded-xl border object-cover shadow-sm"
                  height={photos[0].height}
                  key={photos[0].url}
                  src={photos[0].url}
                  title={"Photo by " + tweet.user.name}
                  width={photos[0].width}
                />
              )}
              {photos.length === 2 && (
                <div className="grid grid-cols-2 gap-2">
                  {photos.map((photo) => (
                    <img
                      alt={tweet.text}
                      className="w-full rounded-xl border object-cover shadow-sm"
                      height={photo.height}
                      key={photo.url}
                      src={photo.url}
                      title={"Photo by " + tweet.user.name}
                      width={photo.width}
                    />
                  ))}
                </div>
              )}
              {photos.length >= 3 && (
                <div className="grid grid-cols-2 gap-2">
                  {photos.slice(0, 4).map((photo, index) => (
                    <img
                      alt={tweet.text}
                      className={cn(
                        "w-full rounded-xl border object-cover shadow-sm",
                        index === 0 && photos.length > 3 && "row-span-2"
                      )}
                      height={photo.height}
                      key={photo.url}
                      src={photo.url}
                      title={"Photo by " + tweet.user.name}
                      width={photo.width}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })()}
      {!(tweet.video || tweet.photos) &&
        // @ts-expect-error package doesn't have type definitions
        tweet?.card?.binding_values?.thumbnail_image_large?.image_value.url && (
          <img
            alt={tweet.text}
            className="w-full rounded-xl border object-cover shadow-sm"
            src={
              // @ts-expect-error package doesn't have type definitions
              tweet.card.binding_values.thumbnail_image_large.image_value.url
            }
          />
        )}
    </div>
  );
};

export const SmoothTweet = ({
  tweet,
  className,
  userInfoPosition = "bottom",
  avatarRounded = "rounded",
  ...props
}: {
  tweet: Tweet;
  className?: string;
  userInfoPosition?: "top" | "bottom";
  avatarRounded?: string;
}) => {
  const enrichedTweet = enrichTweet(tweet);
  const userInfo = (
    <TweetHeader avatarRounded={avatarRounded} tweet={enrichedTweet} />
  );
  const content = (
    <div className="flex w-full flex-col gap-4">
      <TweetMedia tweet={enrichedTweet} />
      {userInfoPosition === "bottom" && userInfo}
    </div>
  );

  return (
    <article
      className={cn(
        "group !p-6 relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-xl border bg-background lg:gap-8",
        className
      )}
      data-tweet
      {...props}
    >
      {userInfoPosition === "top" && userInfo}
      <TweetBody tweet={enrichedTweet} />
      {content}
      <button
        aria-label="Open tweet in new tab"
        className="absolute right-6 bottom-6 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border bg-primary text-foreground opacity-0 backdrop-blur-sm transition-all duration-200 ease-out group-hover:opacity-100 motion-safe:hover:scale-110"
        onClick={() =>
          window.open(enrichedTweet.url, "_blank", "noopener,noreferrer")
        }
        type="button"
      >
        <ExternalLink className="h-4 w-4" />
      </button>
    </article>
  );
};

/**
 * TweetCard (Server Side Only)
 */
export type TweetCardProps = TweetProps & {
  className?: string;
  userInfoPosition?: "top" | "bottom";
  avatarRounded?: string;
};

export const TweetCard = async ({
  id,
  components,
  fallback = <TweetSkeleton />,
  onError,
  ...props
}: TweetCardProps) => {
  const tweet = id
    ? await getTweet(id).catch((err) => {
        if (onError) {
          onError(err);
        } else {
          console.error(err);
        }
      })
    : undefined;

  if (!tweet) {
    const NotFound = components?.TweetNotFound || TweetNotFound;
    return <NotFound {...props} />;
  }

  return (
    <Suspense fallback={fallback}>
      <SmoothTweet tweet={tweet} {...props} />
    </Suspense>
  );
};

export { ClientTweetCard } from "./client";
export default TweetCard;
