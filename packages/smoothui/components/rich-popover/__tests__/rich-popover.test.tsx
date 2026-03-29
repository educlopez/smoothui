import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import RichPopover from "../index";

describe("RichPopover", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <RichPopover trigger={<button type="button">Open</button>} title="Test" />
    );
    expect(container).toBeInTheDocument();
  });
});
