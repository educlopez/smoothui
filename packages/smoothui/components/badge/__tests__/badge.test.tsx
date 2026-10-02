import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render, screen } from "../../../test-utils/render";
import Badge, { StatusDot } from "../index";

describe("Badge", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(<Badge>New</Badge>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders variant and size data attributes", () => {
    render(
      <Badge size="sm" variant="success">
        Active
      </Badge>
    );
    const badge = screen.getByText("Active");
    expect(badge).toHaveAttribute("data-slot", "badge");
    expect(badge).toHaveAttribute("data-variant", "success");
  });
});

describe("StatusDot", () => {
  it("exposes status to assistive tech", () => {
    render(<StatusDot status="busy" />);
    expect(screen.getByRole("status", { name: "busy" })).toHaveAttribute(
      "data-slot",
      "status-dot"
    );
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<StatusDot pulse status="online" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
