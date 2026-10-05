import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render, screen } from "../../../test-utils/render";
import { ToggleGroupItem, ToggleGroupRoot } from "../index";

describe("ToggleGroup", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <ToggleGroupRoot aria-label="Alignment" defaultValue={["left"]}>
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
        <ToggleGroupItem value="center">Center</ToggleGroupItem>
        <ToggleGroupItem value="right">Right</ToggleGroupItem>
      </ToggleGroupRoot>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders without throwing", () => {
    render(
      <ToggleGroupRoot aria-label="Size">
        <ToggleGroupItem value="sm">S</ToggleGroupItem>
        <ToggleGroupItem value="md">M</ToggleGroupItem>
      </ToggleGroupRoot>
    );
    expect(screen.getByRole("group")).toBeInTheDocument();
  });
});
