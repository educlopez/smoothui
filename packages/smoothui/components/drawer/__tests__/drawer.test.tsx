import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import Drawer from "../index";

describe("Drawer", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <Drawer title="Test Drawer" trigger={<button type="button">Open</button>}>
        <p>Content</p>
      </Drawer>
    );
    expect(container).toBeInTheDocument();
  });
});
