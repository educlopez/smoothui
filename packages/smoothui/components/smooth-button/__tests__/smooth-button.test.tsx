import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import SmoothButton from "../index";

describe("SmoothButton", () => {
  it("renders without throwing", () => {
    const { container } = render(<SmoothButton>Click me</SmoothButton>);
    expect(container).toBeInTheDocument();
  });
});
