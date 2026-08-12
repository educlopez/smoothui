import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import MusicToggle from "../index";

describe("MusicToggle", () => {
  it("renders without throwing", () => {
    const { container } = render(<MusicToggle />);
    expect(container).toBeInTheDocument();
  });

  it("renders playing with a track source without throwing", () => {
    const { container } = render(
      <MusicToggle
        artist="Test Artist"
        playing
        progress={0.4}
        src="/audio/track.mp3"
        title="Test Track"
      />
    );
    expect(container).toBeInTheDocument();
  });
});
