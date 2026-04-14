import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import ProductCard from "../index";

describe("ProductCard", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <ProductCard image="/test.jpg" price={29.99} title="Test Product" />
    );
    expect(container).toBeInTheDocument();
  });
});
