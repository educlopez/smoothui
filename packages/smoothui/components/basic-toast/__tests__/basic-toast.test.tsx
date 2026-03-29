import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import BasicToast from "../index";

describe("BasicToast", () => {
  it("renders without throwing", () => {
    const { container } = render(<BasicToast message="Test message" />);
    expect(container).toBeInTheDocument();
  });
});
