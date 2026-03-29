import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import CursorFollow from "../index";

describe("CursorFollow", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <CursorFollow>
        <div>Content</div>
      </CursorFollow>
    );
    expect(container).toBeInTheDocument();
  });
});
