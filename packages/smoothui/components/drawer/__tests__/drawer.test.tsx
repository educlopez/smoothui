import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import Drawer from "../index";

describe("Drawer", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <Drawer title="Test Drawer" trigger={<button type="button">Open</button>}>
        <p>Content</p>
      </Drawer>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders without throwing", () => {
    const { container } = render(
      <Drawer title="Test Drawer" trigger={<button type="button">Open</button>}>
        <p>Content</p>
      </Drawer>
    );
    expect(container).toBeInTheDocument();
  });
});
