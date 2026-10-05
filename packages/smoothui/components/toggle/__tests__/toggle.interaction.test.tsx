import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "../../../test-utils/render";
import Toggle from "../index";

describe("Toggle interactions", () => {
  it("toggles pressed state on click", async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();

    render(
      <Toggle aria-label="Bold" onPressedChange={onPressedChange}>
        B
      </Toggle>
    );

    const button = screen.getByRole("button", { name: "Bold" });
    await user.click(button);
    expect(onPressedChange).toHaveBeenCalledWith(true);
  });

  it("does not fire when disabled", async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();

    render(
      <Toggle aria-label="Bold" disabled onPressedChange={onPressedChange}>
        B
      </Toggle>
    );

    await user.click(screen.getByRole("button", { name: "Bold" }));
    expect(onPressedChange).not.toHaveBeenCalled();
  });
});
