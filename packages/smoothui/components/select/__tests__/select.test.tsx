import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import Select from "../index";

describe("Select", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <Select
        options={[
          { value: "a", label: "Option A" },
          { value: "b", label: "Option B" },
        ]}
        aria-label="Test select"
      />
    );
    expect(container).toBeInTheDocument();
  });
});
