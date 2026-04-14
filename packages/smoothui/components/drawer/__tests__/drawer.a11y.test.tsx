import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import Drawer from "../index";

describe("Drawer a11y", () => {
  it("has no accessibility violations when open", async () => {
    const { container } = render(
      <Drawer description="A test drawer" open title="Test Drawer">
        <p>Drawer content</p>
      </Drawer>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations with different sides", async () => {
    const { container } = render(
      <Drawer open side="right" title="Right Drawer">
        <p>Right side content</p>
      </Drawer>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
