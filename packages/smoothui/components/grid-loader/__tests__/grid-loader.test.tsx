import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import Component from "../index";

describe("GridLoader", () => {
  it("renders without throwing", () => {
    const { container } = render(<Component />);
    expect(container).toBeInTheDocument();
  });
});
