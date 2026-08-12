import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import EmbossSurface from "../index";

describe("EmbossSurface", () => {
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
