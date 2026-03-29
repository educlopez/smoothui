import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import AiInput from "../index";

describe("AiInput", () => {
  it("renders without throwing", () => {
    const { container } = render(<AiInput />);
    expect(container).toBeInTheDocument();
  });
});
