import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import ScrollProgress from "../index";

describe("ScrollProgress", () => {
  it("renders the bar variant without throwing", () => {
    const { container } = render(<ScrollProgress showLabel />);
    expect(container).toBeInTheDocument();
  });

  it("renders the ring variant without throwing", () => {
    const { container } = render(<ScrollProgress showLabel variant="ring" />);
    expect(container).toBeInTheDocument();
  });

  it("renders the segments variant without throwing", () => {
    const { container } = render(<ScrollProgress variant="segments" />);
    expect(container).toBeInTheDocument();
  });
});
