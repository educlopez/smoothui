import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "../../../test-utils/render";
import { ToggleGroupItem, ToggleGroupRoot } from "../index";

describe("ToggleGroup interactions", () => {
  it("fires onValueChange for single select", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <ToggleGroupRoot
        aria-label="Alignment"
        defaultValue={["left"]}
        onValueChange={onValueChange}
      >
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
        <ToggleGroupItem value="center">Center</ToggleGroupItem>
      </ToggleGroupRoot>
    );

    await user.click(screen.getByRole("button", { name: "Center" }));
    expect(onValueChange).toHaveBeenCalled();
    const last = onValueChange.mock.calls.at(-1)?.[0];
    expect(last).toEqual(["center"]);
  });
});
