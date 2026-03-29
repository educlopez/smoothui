import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import BasicDropdown from "../index";

describe("BasicDropdown", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <BasicDropdown
        label="Select option"
        items={[
          { id: "1", label: "Option 1" },
          { id: "2", label: "Option 2" },
        ]}
      />
    );
    expect(container).toBeInTheDocument();
  });
});
