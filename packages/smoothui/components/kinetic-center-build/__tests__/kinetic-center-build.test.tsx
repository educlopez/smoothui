import { act, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "../../../test-utils/render";
import KineticCenterBuild from "../index";

describe("KineticCenterBuild", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders only the first word of the first phrase initially", () => {
    render(<KineticCenterBuild phrases={["Hello World", "Second Phrase"]} />);

    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.queryByText("World")).not.toBeInTheDocument();
  });

  it("reveals subsequent words as the build schedule advances", () => {
    render(<KineticCenterBuild phrases={["Hello World"]} />);

    act(() => {
      vi.advanceTimersByTime(430);
    });

    expect(screen.getByText("World")).toBeInTheDocument();
  });

  it("cycles to the next phrase after the build completes and interval elapses", () => {
    const { container } = render(
      <KineticCenterBuild interval={100} phrases={["Hi", "Bye"]} />
    );

    expect(container.textContent).toContain("Hi");

    act(() => {
      vi.advanceTimersByTime(340 + 100 + 260 + 220);
    });

    expect(container.textContent).toContain("Bye");
  });

  it("wraps back to the first phrase after the last one", () => {
    const { container } = render(
      <KineticCenterBuild interval={100} phrases={["Hi", "Bye"]} />
    );

    act(() => {
      vi.advanceTimersByTime(340 + 100 + 260 + 220);
    });
    act(() => {
      vi.advanceTimersByTime(340 + 100 + 260 + 220);
    });

    expect(container.textContent).toContain("Hi");
  });

  it("applies a custom className to the wrapper", () => {
    const { container } = render(
      <KineticCenterBuild className="custom-class" phrases={["Hi"]} />
    );

    expect(container.querySelector("span.custom-class")).toBeInTheDocument();
  });

  it("marks the wrapper as an aria-live region", () => {
    const { container } = render(<KineticCenterBuild phrases={["Hi"]} />);

    expect(
      container.querySelector("span[aria-live='polite']")
    ).toBeInTheDocument();
  });
});

describe("KineticCenterBuild with reduced motion", () => {
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
    const { default: KineticCenterBuildReduced } = await import("../index");

    render(
      <KineticCenterBuildReduced
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
