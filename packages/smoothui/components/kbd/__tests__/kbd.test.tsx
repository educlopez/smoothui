import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render, screen } from "../../../test-utils/render";
import Kbd from "../index";

describe("Kbd", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(<Kbd>⌘</Kbd>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders as a kbd element", () => {
    render(<Kbd>K</Kbd>);
    expect(screen.getByText("K").tagName).toBe("KBD");
    expect(screen.getByText("K")).toHaveAttribute("data-slot", "kbd");
  });
});
