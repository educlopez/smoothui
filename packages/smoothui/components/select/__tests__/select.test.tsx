import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import Select from "../index";

describe("Select", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <Select
        aria-label="Test select"
        options={[
          { label: "Option A", value: "a" },
          { label: "Option B", value: "b" },
        ]}
      />
    );
    expect(container).toBeInTheDocument();
  });
});
