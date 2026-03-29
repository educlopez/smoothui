import { describe, expect, it, vi } from "vitest";
import { render, screen } from "../../../test-utils/render";
import userEvent from "@testing-library/user-event";
import Checkbox from "../index";

describe("Checkbox interactions", () => {
  it("toggles checked state on click", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();

    render(
      <div>
        <label htmlFor="cb">Accept</label>
        <Checkbox id="cb" onCheckedChange={onCheckedChange} />
      </div>,
    );

    const checkbox = screen.getByRole("checkbox");
    await user.click(checkbox);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("toggles via keyboard Space", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();

    render(
      <div>
        <label htmlFor="cb-key">Toggle</label>
        <Checkbox id="cb-key" onCheckedChange={onCheckedChange} />
      </div>,
    );

    const checkbox = screen.getByRole("checkbox");
    checkbox.focus();
    await user.keyboard(" ");

    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("renders with aria-checked mixed for indeterminate", () => {
    render(
      <div>
        <label htmlFor="cb-ind">Select all</label>
        <Checkbox id="cb-ind" indeterminate />
      </div>,
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("aria-checked", "mixed");
  });

  it("does not fire onCheckedChange when disabled", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();

    render(
      <div>
        <label htmlFor="cb-dis">Disabled</label>
        <Checkbox id="cb-dis" disabled onCheckedChange={onCheckedChange} />
      </div>,
    );

    const checkbox = screen.getByRole("checkbox");
    await user.click(checkbox);

    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("reflects checked state correctly", () => {
    render(
      <div>
        <label htmlFor="cb-checked">Checked</label>
        <Checkbox id="cb-checked" checked />
      </div>,
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("aria-checked", "true");
  });
});
