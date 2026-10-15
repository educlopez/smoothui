import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { render, screen } from "../../../test-utils/render";
import {
  CollapsiblePanel,
  CollapsibleRoot,
  CollapsibleTrigger,
} from "../index";

describe("Collapsible interactions", () => {
  it("toggles open state on click", async () => {
    const user = userEvent.setup();

    render(
      <CollapsibleRoot>
        <CollapsibleTrigger>Show more</CollapsibleTrigger>
        <CollapsiblePanel>
          <div>Extra details</div>
        </CollapsiblePanel>
      </CollapsibleRoot>
    );

    const trigger = screen.getByRole("button", { name: /Show more/i });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Extra details")).toBeVisible();
  });
});
