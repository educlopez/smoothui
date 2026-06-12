import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import GooeyPopover from "../index";

describe("GooeyPopover", () => {
  it("renders without throwing", () => {
    const { container } = render(<GooeyPopover>Open</GooeyPopover>);
    expect(container).toBeInTheDocument();
  });
});
