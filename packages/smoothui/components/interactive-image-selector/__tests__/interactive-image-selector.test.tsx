import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import InteractiveImageSelector, { type ImageData } from "../index";

const images: ImageData[] = [
  { id: 1, src: "https://example.com/1.jpg" },
  { id: 2, src: "https://example.com/2.jpg" },
];

describe("InteractiveImageSelector", () => {
  it("renders without throwing", () => {
    const { container } = render(<InteractiveImageSelector images={images} />);
    expect(container).toBeInTheDocument();
  });
});
