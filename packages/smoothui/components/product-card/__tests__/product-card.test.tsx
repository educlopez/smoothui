import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import ProductCard from "../index";

describe("ProductCard", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <ProductCard image="/test.jpg" title="Test Product" price={29.99} />
    );
    expect(container).toBeInTheDocument();
  });
});
