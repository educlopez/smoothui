import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "../../../test-utils/render";
import Scrubber from "../index";

const mockTrackRect = (track: Element) => {
  vi.spyOn(track, "getBoundingClientRect").mockReturnValue({
    left: 0,
    right: 200,
    top: 0,
    bottom: 36,
    width: 200,
    height: 36,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  });
};

describe("Scrubber", () => {
  beforeEach(() => {
    if (!Element.prototype.setPointerCapture) {
      Element.prototype.setPointerCapture = vi.fn();
    }
    if (!Element.prototype.releasePointerCapture) {
      Element.prototype.releasePointerCapture = vi.fn();
    }
  });

  it("renders without throwing", () => {
    const { container } = render(<Scrubber />);
    expect(container).toBeInTheDocument();
  });

  it("renders the label and formatted value", () => {
    render(<Scrubber decimals={1} defaultValue={0.5} label="Opacity" />);

    expect(screen.getByText("Opacity")).toBeInTheDocument();
    expect(screen.getByText("0.5")).toBeInTheDocument();
  });

  it("drives the value via pointer drag and calls onValueChange", () => {
    const onValueChange = vi.fn();
    render(
      <Scrubber
        decimals={2}
        max={1}
        min={0}
        onValueChange={onValueChange}
        step={0.01}
      />
    );

    const track = screen.getByRole("slider");
    mockTrackRect(track);

    fireEvent.pointerDown(track, { clientX: 100, pointerId: 1 });
    expect(onValueChange).toHaveBeenCalledWith(0.5);

    fireEvent.pointerMove(track, { clientX: 200, pointerId: 1 });
    expect(onValueChange).toHaveBeenLastCalledWith(1);

    fireEvent.pointerUp(track, { pointerId: 1 });
    expect(track).toHaveAttribute("aria-valuenow", "1");
  });

  it("clamps the dragged value to min/max", () => {
    const onValueChange = vi.fn();
    render(
      <Scrubber max={1} min={0} onValueChange={onValueChange} step={0.01} />
    );

    const track = screen.getByRole("slider");
    mockTrackRect(track);

    fireEvent.pointerDown(track, { clientX: -50, pointerId: 1 });
    expect(onValueChange).toHaveBeenCalledWith(0);

    fireEvent.pointerMove(track, { clientX: 999, pointerId: 1 });
    expect(onValueChange).toHaveBeenLastCalledWith(1);
  });

  it("ignores pointer move while not dragging", () => {
    const onValueChange = vi.fn();
    render(<Scrubber onValueChange={onValueChange} />);

    const track = screen.getByRole("slider");
    mockTrackRect(track);

    fireEvent.pointerMove(track, { clientX: 100, pointerId: 1 });
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("does not update internal value when controlled", () => {
    const onValueChange = vi.fn();
    render(
      <Scrubber
        decimals={2}
        max={1}
        min={0}
        onValueChange={onValueChange}
        value={0.2}
      />
    );

    const track = screen.getByRole("slider");
    mockTrackRect(track);

    fireEvent.pointerDown(track, { clientX: 200, pointerId: 1 });
    expect(onValueChange).toHaveBeenCalledWith(1);
    // Controlled: displayed value stays at the prop value.
    expect(track).toHaveAttribute("aria-valuenow", "0.2");
  });

  it("adjusts the value with arrow keys", () => {
    const onValueChange = vi.fn();
    render(
      <Scrubber
        defaultValue={5}
        max={10}
        min={0}
        onValueChange={onValueChange}
        step={1}
      />
    );

    const track = screen.getByRole("slider");
    fireEvent.keyDown(track, { key: "ArrowRight" });
    expect(onValueChange).toHaveBeenLastCalledWith(6);

    fireEvent.keyDown(track, { key: "ArrowLeft" });
    expect(onValueChange).toHaveBeenLastCalledWith(5);

    fireEvent.keyDown(track, { key: "ArrowUp" });
    expect(onValueChange).toHaveBeenLastCalledWith(6);

    fireEvent.keyDown(track, { key: "ArrowDown" });
    expect(onValueChange).toHaveBeenLastCalledWith(5);
  });

  it("jumps to min/max with Home/End keys", () => {
    const onValueChange = vi.fn();
    render(
      <Scrubber
        defaultValue={0.5}
        max={1}
        min={0}
        onValueChange={onValueChange}
      />
    );

    const track = screen.getByRole("slider");
    fireEvent.keyDown(track, { key: "End" });
    expect(onValueChange).toHaveBeenLastCalledWith(1);

    fireEvent.keyDown(track, { key: "Home" });
    expect(onValueChange).toHaveBeenLastCalledWith(0);
  });

  it("ignores unrelated keys", () => {
    const onValueChange = vi.fn();
    render(<Scrubber defaultValue={0.5} onValueChange={onValueChange} />);

    const track = screen.getByRole("slider");
    fireEvent.keyDown(track, { key: "a" });
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("toggles hover state on mouse enter/leave", () => {
    render(<Scrubber />);

    const track = screen.getByRole("slider");
    fireEvent.mouseEnter(track);
    fireEvent.mouseLeave(track);

    expect(track).toBeInTheDocument();
  });

  it("renders tick marks based on the ticks prop", () => {
    const { container } = render(<Scrubber ticks={4} />);

    expect(container.querySelectorAll(".bg-foreground\\/25").length).toBe(4);
  });

  it("hides tick marks when ticks is 0", () => {
    const { container } = render(<Scrubber ticks={0} />);

    expect(container.querySelectorAll(".bg-foreground\\/25").length).toBe(0);
  });
});
