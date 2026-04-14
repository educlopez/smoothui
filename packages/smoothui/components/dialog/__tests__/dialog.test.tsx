import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import Dialog from "../index";

describe("Dialog", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <Dialog title="Test Dialog" trigger={<button type="button">Open</button>}>
        <p>Content</p>
      </Dialog>
    );
    expect(container).toBeInTheDocument();
  });
});
