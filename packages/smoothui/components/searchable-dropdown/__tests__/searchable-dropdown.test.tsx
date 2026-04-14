import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import SearchableDropdown from "../index";

describe("SearchableDropdown", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <SearchableDropdown
        items={[{ id: "1", label: "Item 1" }]}
        label="Pick one"
      />
    );
    expect(container).toBeInTheDocument();
  });
});
