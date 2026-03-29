import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import Skeleton from "../index";

describe("Skeleton", () => {
  it("renders without throwing", () => {
    const { container } = render(<Skeleton />);
    expect(container).toBeInTheDocument();
  });
});
