import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import { ToggleGroupItem, ToggleGroupRoot } from "../toggle-group.base";

describe("ToggleGroup (Base) item height", () => {
  it("lets the group's h-8 win over the Toggle's h-9", () => {
    render(
      <ToggleGroupRoot aria-label="Alignment" defaultValue={["left"]}>
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
      </ToggleGroupRoot>
    );
    const item = document.querySelector("button");
    expect(item).not.toBeNull();
    const classes = item?.className.split(" ") ?? [];
    expect(classes).toContain("h-8");
    expect(classes).not.toContain("h-9");
  });
});
