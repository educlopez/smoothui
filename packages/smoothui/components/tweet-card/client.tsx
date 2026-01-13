"use client";

import { TweetProps, useTweet } from "react-tweet";

import {
  SmoothTweet,
  TweetNotFound,
  TweetSkeleton,
} from "./index";

export type ClientTweetCardProps = TweetProps & {
  className?: string;
  userInfoPosition?: "top" | "bottom";
  avatarRounded?: string;
};

export const ClientTweetCard = ({
  id,
  apiUrl,
  fallback = <TweetSkeleton />,
  components,
  fetchOptions,
  onError,
  ...props
}: ClientTweetCardProps) => {
  const { data, error, isLoading } = useTweet(id, apiUrl, fetchOptions);

  if (isLoading) return fallback;
  if (error || !data) {
    const NotFound = components?.TweetNotFound || TweetNotFound;
    return <NotFound error={onError ? onError(error) : error} />;
  }

  return <SmoothTweet tweet={data} {...props} />;
};