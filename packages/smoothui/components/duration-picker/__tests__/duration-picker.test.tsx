import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "../../../test-utils/render";
import DurationPicker, { formatDuration } from "../index";

describe("DurationPicker", () => {
  it("renders without throwing", () => {
    const { container } = render(<DurationPicker />);
    expect(container).toBeInTheDocument();
  });

  it("renders with a restricted unit set", () => {
    const { container } = render(
      <DurationPicker defaultValue={90} units={["minutes", "seconds"]} />
    );
    expect(container).toBeInTheDocument();
  });
});

describe("formatDuration", () => {
  it("formats a duration with the default hours/minutes/seconds units", () => {
    expect(formatDuration(3661)).toBe("01:01:01");
  });

  it("formats a duration with a restricted unit set", () => {
    expect(formatDuration(90, ["minutes", "seconds"])).toBe("01:30");
  });

  it("falls back to the default units for an empty units array", () => {
    expect(formatDuration(61, [])).toBe("00:01:01");
  });
});

describe("DurationPicker interactions", () => {
  it("steps the focused segment with Arrow Up/Down by step * divisor", () => {
    const onValueChange = vi.fn();
    render(<DurationPicker defaultValue={65} onValueChange={onValueChange} />);
    const [, minutesSegment, secondsSegment] =
      screen.getAllByRole("spinbutton");

    expect(secondsSegment).toHaveAttribute("aria-valuenow", "5");
    fireEvent.keyDown(secondsSegment, { key: "ArrowUp" });
    expect(onValueChange).toHaveBeenLastCalledWith(66);
    expect(secondsSegment).toHaveAttribute("aria-valuenow", "6");

    fireEvent.keyDown(minutesSegment, { key: "ArrowDown" });
    expect(onValueChange).toHaveBeenLastCalledWith(6);
    expect(minutesSegment).toHaveAttribute("aria-valuenow", "0");
  });

  it("multiplies the step by 10 with Shift and by 5 with Page Up/Down", () => {
    const onValueChange = vi.fn();
    render(
      <DurationPicker
        defaultValue={0}
        onValueChange={onValueChange}
        units={["minutes", "seconds"]}
      />
    );
    const [, secondsSegment] = screen.getAllByRole("spinbutton");

    fireEvent.keyDown(secondsSegment, { key: "ArrowUp", shiftKey: true });
    expect(onValueChange).toHaveBeenLastCalledWith(10);

    fireEvent.keyDown(secondsSegment, { key: "PageUp" });
    expect(onValueChange).toHaveBeenLastCalledWith(15);

    fireEvent.keyDown(secondsSegment, { key: "PageDown" });
    expect(onValueChange).toHaveBeenLastCalledWith(10);
  });

  it("carries the value into the next-larger unit when a segment wraps", () => {
    const onValueChange = vi.fn();
    render(
      <DurationPicker
        defaultValue={59}
        onValueChange={onValueChange}
        units={["minutes", "seconds"]}
      />
    );
    const [minutesSegment, secondsSegment] = screen.getAllByRole("spinbutton");
    expect(minutesSegment).toHaveAttribute("aria-valuenow", "0");
    expect(secondsSegment).toHaveAttribute("aria-valuenow", "59");

    fireEvent.keyDown(secondsSegment, { key: "ArrowUp" });

    expect(onValueChange).toHaveBeenLastCalledWith(60);
    expect(minutesSegment).toHaveAttribute("aria-valuenow", "1");
    expect(secondsSegment).toHaveAttribute("aria-valuenow", "0");
  });

  it("jumps a segment to its min/max with Home and End", () => {
    const onValueChange = vi.fn();
    render(
      <DurationPicker
        defaultValue={90}
        onValueChange={onValueChange}
        units={["minutes", "seconds"]}
      />
    );
    const [, secondsSegment] = screen.getAllByRole("spinbutton");

    fireEvent.keyDown(secondsSegment, { key: "End" });
    expect(secondsSegment).toHaveAttribute("aria-valuenow", "59");

    fireEvent.keyDown(secondsSegment, { key: "Home" });
    expect(secondsSegment).toHaveAttribute("aria-valuenow", "0");
  });

  it("moves focus between segments with Arrow Left/Right", () => {
    render(<DurationPicker units={["minutes", "seconds"]} />);
    const [minutesSegment, secondsSegment] = screen.getAllByRole("spinbutton");

    minutesSegment.focus();
    fireEvent.keyDown(minutesSegment, { key: "ArrowRight" });
    expect(document.activeElement).toBe(secondsSegment);

    fireEvent.keyDown(secondsSegment, { key: "ArrowLeft" });
    expect(document.activeElement).toBe(minutesSegment);
  });

  it("commits typed digits directly and auto-advances focus after the second digit", () => {
    render(<DurationPicker defaultValue={0} units={["minutes", "seconds"]} />);
    const [minutesSegment, secondsSegment] = screen.getAllByRole("spinbutton");

    minutesSegment.focus();
    fireEvent.keyDown(minutesSegment, { key: "3" });
    expect(minutesSegment).toHaveAttribute("aria-valuenow", "3");

    fireEvent.keyDown(minutesSegment, { key: "5" });
    expect(minutesSegment).toHaveAttribute("aria-valuenow", "35");
    expect(document.activeElement).toBe(secondsSegment);
  });

  it("does not advance focus after typing the second digit of the last segment", () => {
    render(<DurationPicker defaultValue={0} units={["seconds"]} />);
    const [secondsSegment] = screen.getAllByRole("spinbutton");

    secondsSegment.focus();
    fireEvent.keyDown(secondsSegment, { key: "4" });
    fireEvent.keyDown(secondsSegment, { key: "2" });

    expect(secondsSegment).toHaveAttribute("aria-valuenow", "42");
    expect(document.activeElement).toBe(secondsSegment);
  });

  it("ignores keyboard interaction when disabled", () => {
    const onValueChange = vi.fn();
    render(
      <DurationPicker
        defaultValue={30}
        disabled
        onValueChange={onValueChange}
        units={["seconds"]}
      />
    );
    const [secondsSegment] = screen.getAllByRole("spinbutton");

    fireEvent.keyDown(secondsSegment, { key: "ArrowUp" });
    expect(onValueChange).not.toHaveBeenCalled();
    expect(secondsSegment).toHaveAttribute("aria-disabled", "true");
  });
});
