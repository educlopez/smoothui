import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import MorphIcon, { MORPH_ICON_VARIANTS } from "../index";

describe("MorphIcon", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <MorphIcon variant={MORPH_ICON_VARIANTS[0]} />
    );
    expect(container).toBeInTheDocument();
  });

  it("renders the active check variant without throwing", () => {
    const { container } = render(<MorphIcon active variant="check" />);
    expect(container).toBeInTheDocument();
  });
});
