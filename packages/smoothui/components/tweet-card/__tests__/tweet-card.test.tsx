import { describe, expect, it } from "vitest";
import { TweetCard } from "../index";

// TweetCard is an async React Server Component (react-tweet); it cannot be
// rendered in jsdom, so this is an import-level smoke test.
describe("TweetCard", () => {
  it("exports a component function", () => {
    expect(typeof TweetCard).toBe("function");
  });
});
