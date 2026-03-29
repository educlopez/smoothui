import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import { axe } from "vitest-axe";
import Drawer from "../index";

describe("Drawer a11y", () => {
  it("has no accessibility violations when open", async () => {
    const { container } = render(
      <Drawer open title="Test Drawer" description="A test drawer">
        <p>Drawer content</p>
      </Drawer>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations with different sides", async () => {
    const { container } = render(
      <Drawer open side="right" title="Right Drawer">
        <p>Right side content</p>
      </Drawer>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
