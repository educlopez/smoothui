import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import ImageMetadataPreview, { type ImageMetadata } from "../index";

const metadata: ImageMetadata = {
  by: "Eduardo",
  created: "2026-01-01",
  source: "Camera",
  updated: "2026-01-02",
};

describe("ImageMetadataPreview", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <ImageMetadataPreview
        imageSrc="https://example.com/photo.jpg"
        metadata={metadata}
      />
    );
    expect(container).toBeInTheDocument();
  });
});
