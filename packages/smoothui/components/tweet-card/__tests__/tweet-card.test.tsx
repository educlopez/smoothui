import { fireEvent } from "@testing-library/react";
import type { Tweet } from "react-tweet/api";
import { describe, expect, it, vi } from "vitest";
import { render } from "../../../test-utils/render";
import {
  SmoothTweet,
  TweetCard,
  TweetNotFound,
  TweetSkeleton,
  truncate,
} from "../index";

const baseTweet: Tweet = {
  __typename: "Tweet",
  lang: "en",
  created_at: "Mon Jan 01 00:00:00 +0000 2024",
  display_text_range: [0, 12],
  id_str: "1234567890",
  text: "Hello world!",
  favorite_count: 10,
  conversation_count: 2,
  news_action_type: "conversation",
  isEdited: false,
  isStaleEdit: false,
  edit_control: {
    edit_tweet_ids: ["1234567890"],
    editable_until_msecs: "0",
    is_edit_eligible: false,
    edits_remaining: "0",
  },
  entities: {
    hashtags: [],
    urls: [],
    user_mentions: [],
    symbols: [],
  },
  user: {
    id_str: "1",
    name: "Ada Lovelace",
    profile_image_url_https: "https://example.com/avatar.jpg",
    profile_image_shape: "Circle",
    screen_name: "adalovelace",
    verified: false,
    is_blue_verified: false,
  },
};

describe("truncate", () => {
  it("returns the original string when shorter than the limit", () => {
    expect(truncate("short", 10)).toBe("short");
  });

  it("truncates and appends an ellipsis when longer than the limit", () => {
    expect(truncate("a very long screen name", 10)).toBe("a very ...");
  });

  it("returns null as-is", () => {
    expect(truncate(null, 10)).toBeNull();
  });
});

describe("TweetSkeleton", () => {
  it("renders the skeleton placeholders", () => {
    const { container } = render(<TweetSkeleton />);
    expect(container.querySelectorAll(".bg-primary\\/10").length).toBe(3);
  });
});

describe("TweetNotFound", () => {
  it("renders a not found message", () => {
    const { getByText } = render(<TweetNotFound />);
    expect(getByText("Tweet not found")).toBeInTheDocument();
  });
});

describe("SmoothTweet", () => {
  it("renders the tweet author and text", () => {
    const { getByText } = render(<SmoothTweet tweet={baseTweet} />);
    expect(getByText("Ada Lovelace")).toBeInTheDocument();
    expect(getByText("@adalovelace")).toBeInTheDocument();
    expect(getByText("Hello world!")).toBeInTheDocument();
  });

  it("positions the user info at the top when requested", () => {
    const { container } = render(
      <SmoothTweet tweet={baseTweet} userInfoPosition="top" />
    );
    const article = container.querySelector("article");
    expect(article?.firstElementChild).toHaveTextContent("Ada Lovelace");
  });

  it("normalizes missing entities instead of crashing", () => {
    const tweetWithoutEntities = {
      ...baseTweet,
      entities: undefined,
    } as unknown as Tweet;
    const { getByText } = render(<SmoothTweet tweet={tweetWithoutEntities} />);
    expect(getByText("Hello world!")).toBeInTheDocument();
  });

  it("opens the tweet URL when the external link button is clicked", () => {
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
    const { getByLabelText } = render(<SmoothTweet tweet={baseTweet} />);

    fireEvent.click(getByLabelText("Open tweet in new tab"));

    expect(openSpy).toHaveBeenCalledWith(
      "https://x.com/adalovelace/status/1234567890",
      "_blank",
      "noopener,noreferrer"
    );
    openSpy.mockRestore();
  });
});

// TweetCard is an async React Server Component (react-tweet); it cannot be
// rendered in jsdom, so this is an import-level smoke test.
describe("TweetCard", () => {
  it("exports a component function", () => {
    expect(typeof TweetCard).toBe("function");
  });
});
