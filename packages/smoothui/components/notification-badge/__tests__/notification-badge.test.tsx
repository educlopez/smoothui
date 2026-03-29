import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import NotificationBadge from "../index";

describe("NotificationBadge", () => {
  it("renders without throwing", () => {
    const { container } = render(<NotificationBadge />);
    expect(container).toBeInTheDocument();
  });
});
