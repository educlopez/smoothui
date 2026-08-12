import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import ImageGenerationPanel, { type ImageGenerationImage } from "../index";

const images: ImageGenerationImage[] = [
  { alt: "A lighthouse at dusk", id: "image-1", src: "/images/one.jpg" },
];

describe("ImageGenerationPanel", () => {
  it("renders without throwing", () => {
    const { container } = render(<ImageGenerationPanel />);
    expect(container).toBeInTheDocument();
  });

  it("renders minimal chrome with images and progress without throwing", () => {
    const { container } = render(
      <ImageGenerationPanel
        chrome="minimal"
        images={images}
        progress={0.5}
        status="generating"
      />
    );
    expect(container).toBeInTheDocument();
  });
});
