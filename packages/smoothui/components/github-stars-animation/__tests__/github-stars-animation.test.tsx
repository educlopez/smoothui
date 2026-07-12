import { waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "../../../test-utils/render";
import Component, { type Stargazer } from "../index";

const stargazers: Stargazer[] = [
  {
    login: "octocat",
    avatar_url: "https://example.com/octocat.png",
    html_url: "https://github.com/octocat",
  },
  {
    login: "hubot",
    avatar_url: "https://example.com/hubot.png",
    html_url: "https://github.com/hubot",
  },
];

describe("GithubStarsAnimation", () => {
  beforeEach(() => {
    // The count-up animation reads Date.now() to compute progress. Jumping
    // it forward on every call guarantees the very next read after the
    // effect captures `startTime` already exceeds COUNTDOWN_DURATION, so the
    // animation resolves to its final value on the first synchronous tick
    // instead of requiring real requestAnimationFrame timing in jsdom.
    let now = 0;
    vi.spyOn(Date, "now").mockImplementation(() => {
      now += 10_000;
      return now;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("renders without throwing", () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise(() => {}))
    );
    const { container } = render(<Component />);
    expect(container).toBeInTheDocument();
  });

  it("shows a loading skeleton while fetching", () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise(() => {}))
    );
    const { container } = render(<Component />);
    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(
      0
    );
  });

  it("does not fetch when stargazers and starCount are provided", () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    render(<Component starCount={42} stargazers={stargazers} />);

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("renders provided avatars with accessible links", () => {
    const { getByLabelText } = render(
      <Component starCount={2} stargazers={stargazers} />
    );

    const link = getByLabelText("octocat's GitHub profile");
    expect(link).toHaveAttribute("href", "https://github.com/octocat");
  });

  it("hides avatars when showAvatars is false", () => {
    const { queryByLabelText, getByText } = render(
      <Component showAvatars={false} starCount={2} stargazers={stargazers} />
    );

    expect(
      queryByLabelText("octocat's GitHub profile")
    ).not.toBeInTheDocument();
    expect(getByText("2")).toBeInTheDocument();
  });

  it("formats the count with thousands separators and pluralizes stars", () => {
    const { getByText } = render(
      <Component starCount={1234} stargazers={stargazers} />
    );

    expect(getByText("1,234")).toBeInTheDocument();
    expect(getByText("stars")).toBeInTheDocument();
  });

  it("uses the singular label when the star count is 1", () => {
    const { getByText } = render(
      <Component starCount={1} stargazers={stargazers} />
    );

    expect(getByText("star")).toBeInTheDocument();
  });

  it("fetches from a custom apiEndpoint and renders the result", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            stargazers,
            stars: 99,
          }),
      })
    );

    const { findByText } = render(<Component apiEndpoint="/api/stars" />);

    expect(await findByText("99")).toBeInTheDocument();
  });

  it("falls back to the GitHub API when no apiEndpoint is given", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) => {
        if (url.includes("/stargazers")) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(stargazers),
          });
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ stargazers_count: 7 }),
        });
      })
    );

    const { findByText } = render(<Component />);

    expect(await findByText("7")).toBeInTheDocument();
  });

  it("renders nothing when fetching fails and there is no star count", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new Error("network error")))
    );

    const { container } = render(<Component />);

    await waitFor(() => expect(container).toBeEmptyDOMElement());
  });
});
