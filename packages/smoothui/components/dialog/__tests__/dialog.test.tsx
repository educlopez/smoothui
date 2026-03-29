import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import Dialog from "../index";

describe("Dialog", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <Dialog trigger={<button type="button">Open</button>} title="Test Dialog">
        <p>Content</p>
      </Dialog>
    );
    expect(container).toBeInTheDocument();
  });
});
