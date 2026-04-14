import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import BasicDropdown from "../index";

describe("BasicDropdown", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <BasicDropdown
        items={[
          { id: "1", label: "Option 1" },
          { id: "2", label: "Option 2" },
        ]}
        label="Select option"
      />
    );
    expect(container).toBeInTheDocument();
  });
});
