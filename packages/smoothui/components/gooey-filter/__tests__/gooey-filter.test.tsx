import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import GooeyFilter from "../index";

describe("GooeyFilter", () => {
  it("renders without throwing", () => {
    const { container } = render(<GooeyFilter>Blob content</GooeyFilter>);
    expect(container).toBeInTheDocument();
  });

  it("renders the disabled variant without throwing", () => {
    const { container } = render(
      <GooeyFilter disabled>Blob content</GooeyFilter>
    );
    expect(container).toBeInTheDocument();
  });
});
