import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import Dialog from "../index";

describe("Dialog", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <Dialog title="Test Dialog" trigger={<button type="button">Open</button>}>
        <p>Content</p>
      </Dialog>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders without throwing", () => {
    const { container } = render(
      <Dialog title="Test Dialog" trigger={<button type="button">Open</button>}>
        <p>Content</p>
      </Dialog>
    );
    expect(container).toBeInTheDocument();
  });
});
