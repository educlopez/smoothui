import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import MagneticButton from "../index";

describe("MagneticButton", () => {
  it("renders without throwing", () => {
    const { container } = render(<MagneticButton>Pull me</MagneticButton>);
    expect(container).toBeInTheDocument();
  });
});
