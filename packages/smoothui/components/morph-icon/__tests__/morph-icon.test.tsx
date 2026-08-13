import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
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

  it("has no accessibility violations", async () => {
    const { container } = render(
      <MorphIcon variant={MORPH_ICON_VARIANTS[0]} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
