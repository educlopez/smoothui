import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
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

  it("has no accessibility violations", async () => {
    const { container } = render(
      <VideoAmbient alt="Ambient background video" src="/videos/sample.mp4" />
    );
    /**
     * `no-autoplay-audio` is the one rule that cannot run here. To decide
     * whether an autoplaying element actually emits sound, axe preloads the
     * media and waits for `loadedmetadata` — an event jsdom never fires,
     * because it has no media stack at all, so the audit hangs until the test
     * times out. Everything else in the tree is still audited; the component
     * is `muted` by default, so the rule has nothing to report anyway.
     */
    const results = await axe(container, {
      rules: { "no-autoplay-audio": { enabled: false } },
    });
    expect(results).toHaveNoViolations();
  });
});
