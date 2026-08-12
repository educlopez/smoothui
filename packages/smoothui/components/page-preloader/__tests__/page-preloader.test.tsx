import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import PagePreloader, { PAGE_PRELOADER_VARIANTS } from "../index";

describe("PagePreloader", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <PagePreloader active variant={PAGE_PRELOADER_VARIANTS[0]} />
    );
    expect(container).toBeInTheDocument();
  });

  it("renders the pixel variant without throwing", () => {
    const { container } = render(<PagePreloader active variant="pixel" />);
    expect(container).toBeInTheDocument();
  });
});
