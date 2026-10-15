import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "../../../test-utils/render";
import Switch from "../index";

describe("Switch interactions", () => {
  it("toggles checked state on click", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();

    render(
      <div>
        <label htmlFor="sw">Airplane mode</label>
        <Switch id="sw" onCheckedChange={onCheckedChange} />
      </div>
    );

    const toggle = screen.getByRole("switch");
    await user.click(toggle);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("does not fire onCheckedChange when disabled", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();

    render(
      <div>
        <label htmlFor="sw-dis">Disabled</label>
        <Switch disabled id="sw-dis" onCheckedChange={onCheckedChange} />
      </div>
    );

    const toggle = screen.getByRole("switch");
    await user.click(toggle);

    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("reflects checked state correctly", () => {
    render(
      <div>
        <label htmlFor="sw-checked">Checked</label>
        <Switch checked id="sw-checked" />
      </div>
    );

    const toggle = screen.getByRole("switch");
    expect(toggle).toHaveAttribute("aria-checked", "true");
  });
});
