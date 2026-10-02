import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render, screen } from "../../../test-utils/render";
import Alert from "../index";

describe("Alert", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <Alert title="Saved" variant="success">
        Your changes are live.
      </Alert>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("uses alert role and variant attribute", () => {
    render(
      <Alert title="Heads up" variant="warning">
        Review before publishing.
      </Alert>
    );
    const alert = screen.getByRole("alert");
    expect(alert).toHaveAttribute("data-variant", "warning");
    expect(screen.getByText("Heads up")).toBeInTheDocument();
  });
});
