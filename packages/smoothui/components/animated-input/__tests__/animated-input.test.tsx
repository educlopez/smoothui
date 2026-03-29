import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import AnimatedInput from "../index";

describe("AnimatedInput", () => {
  it("renders without throwing", () => {
    const { container } = render(<AnimatedInput label="Email" />);
    expect(container).toBeInTheDocument();
  });
});
