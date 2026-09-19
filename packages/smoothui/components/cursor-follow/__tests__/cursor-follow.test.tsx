import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import CursorFollow from "../index";

describe("CursorFollow", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <CursorFollow>
        <div>Content</div>
      </CursorFollow>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders without throwing", () => {
    const { container } = render(
      <CursorFollow>
        <div>Content</div>
      </CursorFollow>
    );
    expect(container).toBeInTheDocument();
  });
});
