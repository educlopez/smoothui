import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render, screen } from "../../../test-utils/render";
import Separator from "../index";
import RadixSeparator from "../separator.radix";

describe("Separator", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <div>
        <p>Above</p>
        <Separator />
        <p>Below</p>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders a semantic horizontal separator by default", () => {
    render(<Separator />);
    const sep = screen.getByRole("separator");
    expect(sep).toHaveAttribute("data-slot", "separator");
    expect(sep.className).toContain("bg-border");
    expect(sep.className).toContain("shrink-0");
  });

  it("supports vertical orientation", () => {
    render(<Separator orientation="vertical" />);
    expect(screen.getByRole("separator")).toHaveAttribute(
      "aria-orientation",
      "vertical"
    );
  });

  it("hides decorative separators from assistive tech", () => {
    const { container } = render(<Separator decorative />);
    expect(screen.queryByRole("separator")).toBeNull();
    expect(container.querySelector("[data-slot='separator']")).not.toBeNull();
  });
});

describe("Separator (Radix twin)", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <div>
        <p>Above</p>
        <RadixSeparator />
        <p>Below</p>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("supports vertical and decorative", () => {
    const { container } = render(
      <RadixSeparator decorative orientation="vertical" />
    );
    expect(screen.queryByRole("separator")).toBeNull();
    expect(container.querySelector("[data-slot='separator']")).not.toBeNull();
  });
});
