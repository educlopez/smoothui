import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render, screen } from "../../../test-utils/render";
import Toolbar, {
  ToolbarButton,
  ToolbarGroup,
  ToolbarSeparator,
} from "../index";
import RadixToolbar, {
  ToolbarButton as RadixToolbarButton,
  ToolbarGroup as RadixToolbarGroup,
} from "../toolbar.radix";

describe("Toolbar", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <Toolbar>
        <ToolbarGroup aria-label="Formatting">
          <ToolbarButton aria-label="Bold">B</ToolbarButton>
          <ToolbarButton aria-label="Italic">I</ToolbarButton>
        </ToolbarGroup>
        <ToolbarSeparator />
        <ToolbarButton aria-label="Link">Link</ToolbarButton>
      </Toolbar>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("exposes toolbar semantics", () => {
    render(
      <Toolbar>
        <ToolbarButton>Save</ToolbarButton>
      </Toolbar>
    );
    expect(screen.getByRole("toolbar")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });
});

describe("Toolbar (Radix twin)", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <RadixToolbar>
        <RadixToolbarGroup aria-label="Formatting">
          <RadixToolbarButton aria-label="Bold">B</RadixToolbarButton>
        </RadixToolbarGroup>
      </RadixToolbar>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
