import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import RollingText from "../index";

describe("RollingText", () => {
  it("renders without throwing", () => {
    const { container } = render(<RollingText text="Smooth" />);
    expect(container).toBeInTheDocument();
  });

  it("renders the downward-rolling variant without throwing", () => {
    const { container } = render(
      <RollingText direction="down" text="Smooth" />
    );
    expect(container).toBeInTheDocument();
  });
});
