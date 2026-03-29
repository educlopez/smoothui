import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import ButtonCopy from "../index";

describe("ButtonCopy", () => {
  it("renders without throwing", () => {
    const { container } = render(<ButtonCopy />);
    expect(container).toBeInTheDocument();
  });
});
