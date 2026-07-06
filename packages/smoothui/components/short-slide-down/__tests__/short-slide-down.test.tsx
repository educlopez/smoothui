import { act, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "../../../test-utils/render";
import ShortSlideDown from "../index";

describe("ShortSlideDown", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders only the first word of the first phrase initially", () => {
    render(<ShortSlideDown phrases={["Hello World", "Second Phrase"]} />);

    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.queryByText("World")).not.toBeInTheDocument();
  });

  it("reveals subsequent words as the build schedule advances", () => {
    render(<ShortSlideDown phrases={["Hello World"]} />);

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(screen.getByText("World")).toBeInTheDocument();
  });

  it("cycles to the next phrase after the build completes and interval elapses", () => {
    const { container } = render(
      <ShortSlideDown interval={100} phrases={["Hi", "Bye"]} />
    );

    expect(container.textContent).toContain("Hi");

    act(() => {
      vi.advanceTimersByTime(360 + 100 + 320 + 180);
    });

    expect(container.textContent).toContain("Bye");
  });

  it("wraps back to the first phrase after the last one", () => {
    const { container } = render(
      <ShortSlideDown interval={100} phrases={["Hi", "Bye"]} />
    );

    act(() => {
      vi.advanceTimersByTime(360 + 100 + 320 + 180);
    });
    act(() => {
      vi.advanceTimersByTime(360 + 100 + 320 + 180);
    });

    expect(container.textContent).toContain("Hi");
  });

  it("applies a custom className to the wrapper", () => {
    const { container } = render(
      <ShortSlideDown className="custom-class" phrases={["Hi"]} />
    );

    expect(container.querySelector("span.custom-class")).toBeInTheDocument();
  });

  it("marks the wrapper as an aria-live region", () => {
    const { container } = render(<ShortSlideDown phrases={["Hi"]} />);

    expect(
      container.querySelector("span[aria-live='polite']")
    ).toBeInTheDocument();
  });
});

describe("ShortSlideDown with reduced motion", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.resetModules();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.doUnmock("motion/react");
  });

  it("shows the full phrase immediately and advances only via the interval", async () => {
    vi.doMock("motion/react", async (importOriginal) => {
      const actual = await importOriginal<typeof import("motion/react")>();
      return { ...actual, useReducedMotion: () => true };
    });
    const { default: ShortSlideDownReduced } = await import("../index");

    render(
      <ShortSlideDownReduced
        interval={200}
        phrases={["Hello there", "Goodbye now"]}
      />
    );

    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("there")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(screen.getByText("Goodbye")).toBeInTheDocument();
    expect(screen.getByText("now")).toBeInTheDocument();
  });
});
