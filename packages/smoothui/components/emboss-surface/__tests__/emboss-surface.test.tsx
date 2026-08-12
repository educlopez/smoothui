import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import EmbossSurface from "../index";

describe("EmbossSurface", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(<EmbossSurface>Relief text</EmbossSurface>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders without throwing", () => {
    const { container } = render(<EmbossSurface>Relief text</EmbossSurface>);
    expect(container).toBeInTheDocument();
  });

  it("renders the plaster variant without throwing", () => {
    const { container } = render(
      <EmbossSurface interactive variant="plaster">
        Relief text
      </EmbossSurface>
    );
    expect(container).toBeInTheDocument();
  });
});
