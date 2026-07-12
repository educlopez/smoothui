import { act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "../../../test-utils/render";
import ScrollableCardStack from "../index";

const buildItems = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: `${i + 1}`,
    name: `User ${i + 1}`,
    handle: `@user${i + 1}`,
    avatar: `/avatar-${i + 1}.jpg`,
    image: `/image-${i + 1}.jpg`,
    href: `#user-${i + 1}`,
  }));

const mockMatchMedia = (matches: boolean) => {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
};

describe("ScrollableCardStack", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockMatchMedia(false);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders without throwing", () => {
    const { container } = render(<ScrollableCardStack items={buildItems(1)} />);
    expect(container).toBeInTheDocument();
  });

  it("renders a navigation dot per item and the current position for screen readers", () => {
    render(<ScrollableCardStack items={buildItems(3)} />);

    expect(screen.getAllByRole("tab")).toHaveLength(3);
    expect(screen.getByText(/Card 1 of 3 selected/)).toBeInTheDocument();
  });

  it("jumps to the clicked card and updates the selected tab", () => {
    render(<ScrollableCardStack items={buildItems(3)} />);

    const tabs = screen.getAllByRole("tab");
    fireEvent.click(tabs[2]);

    expect(tabs[2]).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText(/Card 3 of 3 selected/)).toBeInTheDocument();
  });

  it("advances one card at a time with arrow keys", () => {
    render(<ScrollableCardStack items={buildItems(3)} />);

    const container = screen.getByRole("application");
    fireEvent.keyDown(container, { key: "ArrowDown" });

    expect(screen.getByText(/Card 2 of 3 selected/)).toBeInTheDocument();
  });

  it("does not scroll past the last card", () => {
    render(<ScrollableCardStack items={buildItems(2)} />);

    const container = screen.getByRole("application");
    fireEvent.keyDown(container, { key: "ArrowDown" });
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    fireEvent.keyDown(container, { key: "ArrowDown" });

    expect(screen.getByText(/Card 2 of 2 selected/)).toBeInTheDocument();
  });

  it("jumps to the first and last card with Home and End", () => {
    render(<ScrollableCardStack items={buildItems(4)} />);

    const container = screen.getByRole("application");
    fireEvent.keyDown(container, { key: "End" });
    expect(screen.getByText(/Card 4 of 4 selected/)).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    fireEvent.keyDown(container, { key: "Home" });
    expect(screen.getByText(/Card 1 of 4 selected/)).toBeInTheDocument();
  });

  it("ignores rapid repeated scrolls within the minimum interval", () => {
    render(<ScrollableCardStack items={buildItems(3)} />);

    const container = screen.getByRole("application");
    fireEvent.keyDown(container, { key: "ArrowDown" });
    fireEvent.keyDown(container, { key: "ArrowDown" });

    expect(screen.getByText(/Card 2 of 3 selected/)).toBeInTheDocument();
  });

  it("advances on a touch swipe past the threshold", () => {
    render(<ScrollableCardStack items={buildItems(3)} />);

    const container = screen.getByRole("application");
    fireEvent.touchStart(container, {
      touches: [{ clientY: 300 }],
    });
    fireEvent.touchMove(container, {
      touches: [{ clientY: 100 }],
    });
    fireEvent.touchEnd(container);

    expect(screen.getByText(/Card 2 of 3 selected/)).toBeInTheDocument();
  });

  it("ignores touch moves under the swipe threshold", () => {
    render(<ScrollableCardStack items={buildItems(3)} />);

    const container = screen.getByRole("application");
    fireEvent.touchStart(container, {
      touches: [{ clientY: 300 }],
    });
    fireEvent.touchMove(container, {
      touches: [{ clientY: 280 }],
    });
    fireEvent.touchEnd(container);

    expect(screen.getByText(/Card 1 of 3 selected/)).toBeInTheDocument();
  });

  it("simplifies transforms when reduced motion is preferred", () => {
    mockMatchMedia(true);
    const { container } = render(<ScrollableCardStack items={buildItems(2)} />);

    expect(container.querySelector('[data-active="true"]')).toBeInTheDocument();
  });
});
