import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render, screen } from "../../../test-utils/render";
import Textarea from "../index";

describe("Textarea", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <Textarea aria-label="Message" placeholder="Write a message…" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders a multiline textbox", () => {
    render(<Textarea aria-label="Notes" rows={3} />);
    const field = screen.getByRole("textbox", { name: "Notes" });
    expect(field.tagName).toBe("TEXTAREA");
    expect(field).toHaveAttribute("data-slot", "textarea");
  });
});
