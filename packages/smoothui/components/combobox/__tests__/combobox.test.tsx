import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import Combobox from "../index";

describe("Combobox", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <Combobox
        options={[
          { value: "a", label: "Option A" },
          { value: "b", label: "Option B" },
        ]}
        aria-label="Test combobox"
      />
    );
    expect(container).toBeInTheDocument();
  });
});
