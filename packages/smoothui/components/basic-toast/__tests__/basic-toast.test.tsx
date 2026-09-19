import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import BasicToast from "../index";

describe("BasicToast", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(<BasicToast message="Test message" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders without throwing", () => {
    const { container } = render(<BasicToast message="Test message" />);
    expect(container).toBeInTheDocument();
  });
});
