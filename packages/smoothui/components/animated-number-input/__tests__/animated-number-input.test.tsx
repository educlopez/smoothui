import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "../../../test-utils/render";
import AnimatedNumberInput from "../index";

describe("AnimatedNumberInput", () => {
  it("renders without throwing", () => {
    const { container } = render(<AnimatedNumberInput />);
    expect(container).toBeInTheDocument();
  });

  it("renders with stepper and scrub enabled", () => {
    const { container } = render(
      <AnimatedNumberInput defaultValue={10} label="Quantity" scrub stepper />
    );
    expect(container).toBeInTheDocument();
  });
});

describe("AnimatedNumberInput interactions", () => {
  it("steps the value with Arrow Up and Arrow Down", () => {
    const onValueChange = vi.fn();
    render(
      <AnimatedNumberInput defaultValue={5} onValueChange={onValueChange} />
    );
    const input = screen.getByRole("spinbutton");

    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(onValueChange).toHaveBeenLastCalledWith(6);
    expect(input).toHaveAttribute("aria-valuenow", "6");

    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(onValueChange).toHaveBeenLastCalledWith(5);
    expect(input).toHaveAttribute("aria-valuenow", "5");
  });

  it("multiplies the step by 10 when Shift is held", () => {
    const onValueChange = vi.fn();
    render(
      <AnimatedNumberInput defaultValue={5} onValueChange={onValueChange} />
    );
    const input = screen.getByRole("spinbutton");

    fireEvent.keyDown(input, { key: "ArrowUp", shiftKey: true });
    expect(onValueChange).toHaveBeenLastCalledWith(15);

    fireEvent.keyDown(input, { key: "ArrowDown", shiftKey: true });
    expect(onValueChange).toHaveBeenLastCalledWith(5);
  });

  it("divides the step by 10 when Alt is held", () => {
    const onValueChange = vi.fn();
    render(
      <AnimatedNumberInput
        defaultValue={5}
        onValueChange={onValueChange}
        precision={1}
      />
    );
    const input = screen.getByRole("spinbutton");

    fireEvent.keyDown(input, { altKey: true, key: "ArrowUp" });
    expect(onValueChange).toHaveBeenLastCalledWith(5.1);
  });

  it("steps by 10 on Page Up and Page Down regardless of the step prop", () => {
    const onValueChange = vi.fn();
    render(
      <AnimatedNumberInput defaultValue={5} onValueChange={onValueChange} />
    );
    const input = screen.getByRole("spinbutton");

    fireEvent.keyDown(input, { key: "PageUp" });
    expect(onValueChange).toHaveBeenLastCalledWith(15);

    fireEvent.keyDown(input, { key: "PageDown" });
    expect(onValueChange).toHaveBeenLastCalledWith(5);
  });

  it("jumps to min/max on Home and End when bounds are finite", () => {
    const onValueChange = vi.fn();
    render(
      <AnimatedNumberInput
        defaultValue={5}
        max={10}
        min={0}
        onValueChange={onValueChange}
      />
    );
    const input = screen.getByRole("spinbutton");

    fireEvent.keyDown(input, { key: "End" });
    expect(onValueChange).toHaveBeenLastCalledWith(10);

    fireEvent.keyDown(input, { key: "Home" });
    expect(onValueChange).toHaveBeenLastCalledWith(0);
  });

  it("ignores Home/End when the corresponding bound is infinite", () => {
    const onValueChange = vi.fn();
    render(
      <AnimatedNumberInput defaultValue={5} onValueChange={onValueChange} />
    );
    const input = screen.getByRole("spinbutton");

    fireEvent.keyDown(input, { key: "Home" });
    fireEvent.keyDown(input, { key: "End" });
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("commits typed text on blur, clamped to the range when clampOnBlur is true (default)", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <AnimatedNumberInput
        defaultValue={5}
        max={10}
        min={0}
        onValueChange={onValueChange}
      />
    );
    const input = screen.getByRole("spinbutton");

    await user.click(input);
    await user.clear(input);
    await user.type(input, "999");
    await user.tab();

    expect(onValueChange).toHaveBeenLastCalledWith(10);
  });

  it("leaves an out-of-range typed value unclamped when clampOnBlur is false", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <AnimatedNumberInput
        clampOnBlur={false}
        defaultValue={5}
        max={10}
        min={0}
        onValueChange={onValueChange}
      />
    );
    const input = screen.getByRole("spinbutton");

    await user.click(input);
    await user.clear(input);
    await user.type(input, "999");
    await user.tab();

    expect(onValueChange).toHaveBeenLastCalledWith(999);
  });

  it("marks unparsable typed text as invalid and reverts the displayed value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <AnimatedNumberInput defaultValue={5} onValueChange={onValueChange} />
    );
    const input = screen.getByRole("spinbutton");

    await user.click(input);
    await user.clear(input);
    await user.type(input, "-");
    await user.tab();

    expect(onValueChange).not.toHaveBeenCalled();
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveValue("5");
  });

  it("does not respond to keyboard stepping or the stepper buttons when disabled", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <AnimatedNumberInput
        defaultValue={5}
        disabled
        onValueChange={onValueChange}
        stepper
      />
    );
    const input = screen.getByRole("spinbutton");
    expect(input).toBeDisabled();

    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(onValueChange).not.toHaveBeenCalled();

    const increaseButton = screen.getByRole("button", {
      name: "Increase value",
    });
    expect(increaseButton).toBeDisabled();
    await user.click(increaseButton);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("increments and decrements via the stepper buttons", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <AnimatedNumberInput
        defaultValue={5}
        onValueChange={onValueChange}
        stepper
      />
    );

    await user.click(screen.getByRole("button", { name: "Increase value" }));
    expect(onValueChange).toHaveBeenLastCalledWith(6);

    await user.click(screen.getByRole("button", { name: "Decrease value" }));
    expect(onValueChange).toHaveBeenLastCalledWith(5);
  });

  it("in controlled mode, forwards the next value via onValueChange without re-rendering itself", () => {
    const onValueChange = vi.fn();
    render(<AnimatedNumberInput onValueChange={onValueChange} value={5} />);
    const input = screen.getByRole("spinbutton");

    fireEvent.keyDown(input, { key: "ArrowUp" });

    expect(onValueChange).toHaveBeenCalledWith(6);
    // The parent owns the value in controlled mode; since it didn't re-render
    // with the new value, the input keeps displaying the old one.
    expect(input).toHaveAttribute("aria-valuenow", "5");
  });
});
