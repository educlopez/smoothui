import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import VideoAmbient from "../index";

describe("VideoAmbient", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <VideoAmbient alt="Ambient background video" src="/videos/sample.mp4" />
    );
    expect(container).toBeInTheDocument();
  });

  it("renders without the glow effect without throwing", () => {
    const { container } = render(
      <VideoAmbient
        alt="Plain video"
        glow={false}
        poster="/images/poster.jpg"
        src="/videos/sample.mp4"
      />
    );
    expect(container).toBeInTheDocument();
  });
});
