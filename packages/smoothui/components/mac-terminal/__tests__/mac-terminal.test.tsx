import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "../../../test-utils/render";
import MacTerminal, { type TerminalLine } from "../index";

const lines: TerminalLine[] = [
  { id: "line-1", text: "pnpm install", type: "command" },
  { id: "line-2", text: "Installed 42 packages", type: "output" },
  { id: "line-3", text: "Done", type: "success" },
];

/** jsdom's IntersectionObserver stub (test-utils/setup.ts) never invokes its
 * callback, so the component's `isInView` gate would stay false forever and
 * the typing machine would never tick. Replace it with one that reports the
 * terminal as immediately visible. */
class ImmediateIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin = "0px";
  readonly thresholds: readonly number[] = [0];
  private readonly callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }

  observe(target: Element) {
    this.callback(
      [{ isIntersecting: true, target } as IntersectionObserverEntry],
      this
    );
  }
  unobserve() {
    // no-op
  }
  disconnect() {
    // no-op
  }
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

describe("MacTerminal", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal("IntersectionObserver", ImmediateIntersectionObserver);
  });

  afterEach(() => {
    act(() => {
      vi.runOnlyPendingTimers();
    });
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("renders without throwing", () => {
    const { container } = render(<MacTerminal lines={lines} />);
    expect(container).toBeInTheDocument();
  });

  it("renders a light theme without autoplay without throwing", () => {
    const { container } = render(
      <MacTerminal autoPlay={false} lines={lines} theme="light" />
    );
    expect(container).toBeInTheDocument();
  });

  it("types through every line and calls onComplete once", () => {
    const onComplete = vi.fn();
    render(<MacTerminal lines={lines} onComplete={onComplete} />);

    act(() => {
      vi.advanceTimersByTime(10_000);
    });

    expect(screen.getByText("pnpm install")).toBeInTheDocument();
    expect(screen.getByText("Installed 42 packages")).toBeInTheDocument();
    expect(screen.getByText("Done")).toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("restarts from the first line when loop is set, calling onComplete again", () => {
    const onComplete = vi.fn();
    render(<MacTerminal lines={lines} loop onComplete={onComplete} />);

    // Comfortably past a single run (~900ms) but short of the loop reset,
    // which only happens LOOP_PAUSE_MS (1500ms) after that first finish.
    act(() => {
      vi.advanceTimersByTime(1600);
    });
    expect(onComplete).toHaveBeenCalledTimes(1);

    // Past the reset and a full second run.
    act(() => {
      vi.advanceTimersByTime(3400);
    });
    expect(onComplete).toHaveBeenCalledTimes(2);
  });

  it("does not start typing until manually activated when autoPlay is false", () => {
    render(<MacTerminal autoPlay={false} lines={lines} />);

    const container = screen.getByRole("button", { name: "Terminal terminal" });
    expect(
      screen.getByText("Click or press Enter to run this session")
    ).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.queryByText("pnpm install")).not.toBeInTheDocument();

    fireEvent.keyDown(container, { key: "Enter" });
    act(() => {
      vi.advanceTimersByTime(10_000);
    });

    expect(screen.getByText("pnpm install")).toBeInTheDocument();
    expect(
      screen.queryByText("Click or press Enter to run this session")
    ).not.toBeInTheDocument();
  });

  it("renders real, labelled traffic-light buttons only when handlers are supplied", () => {
    const { rerender } = render(<MacTerminal lines={lines} />);
    expect(
      screen.queryByRole("button", { name: "Close terminal" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Minimize terminal" })
    ).not.toBeInTheDocument();

    const onClose = vi.fn();
    const onMinimize = vi.fn();
    rerender(
      <MacTerminal lines={lines} onClose={onClose} onMinimize={onMinimize} />
    );

    const closeButton = screen.getByRole("button", { name: "Close terminal" });
    const minimizeButton = screen.getByRole("button", {
      name: "Minimize terminal",
    });

    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);

    fireEvent.click(minimizeButton);
    expect(onMinimize).toHaveBeenCalledTimes(1);
  });

  it("does not let a traffic-light click bubble into starting the session", () => {
    const onClose = vi.fn();
    render(<MacTerminal autoPlay={false} lines={lines} onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: "Close terminal" }));

    expect(onClose).toHaveBeenCalledTimes(1);
    // The click must not have bubbled up to the container and started the
    // scripted session.
    expect(
      screen.getByText("Click or press Enter to run this session")
    ).toBeInTheDocument();
  });
});
