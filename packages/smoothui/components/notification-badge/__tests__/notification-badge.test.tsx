import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import NotificationBadge from "../index";

describe("NotificationBadge", () => {
  it("renders without throwing", () => {
    const { container } = render(<NotificationBadge />);
    expect(container).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<NotificationBadge />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
