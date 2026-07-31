import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import Combobox from "../index";

describe("Combobox", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <Combobox
        aria-label="Test combobox"
        options={[
          { label: "Option A", value: "a" },
          { label: "Option B", value: "b" },
        ]}
      />
    );
    expect(container).toBeInTheDocument();
  });
});
