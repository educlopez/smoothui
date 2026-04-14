import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import DropdownMenu from "../index";

const items = [
  { key: "edit", label: "Edit" },
  { key: "delete", label: "Delete", variant: "destructive" as const },
];

describe("DropdownMenu a11y", () => {
  it("has no accessibility violations when closed", async () => {
    const { container } = render(
      <DropdownMenu items={items}>
        <button type="button">Open menu</button>
      </DropdownMenu>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations when open", async () => {
    const { container } = render(
      <DropdownMenu items={items} open>
        <button type="button">Open menu</button>
      </DropdownMenu>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
