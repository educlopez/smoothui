import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "../../../test-utils/render";
import Slider from "../index";

describe("Slider interactions", () => {
  it("supports keyboard adjustment", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Slider
        aria-label="Volume"
        defaultValue={50}
        onValueChange={onValueChange}
      />
    );

    const thumb = screen.getByRole("slider");
    thumb.focus();
    await user.keyboard("{ArrowRight}");
    expect(onValueChange).toHaveBeenCalled();
  });

  it("does not respond when disabled", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Slider
        aria-label="Volume"
        defaultValue={50}
        disabled
        onValueChange={onValueChange}
      />
    );

    const thumb = screen.getByRole("slider");
    thumb.focus();
    await user.keyboard("{ArrowRight}");
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
