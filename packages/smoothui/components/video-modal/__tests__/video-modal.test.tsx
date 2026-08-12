import userEvent from "@testing-library/user-event";
import { useReducedMotion } from "motion/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "../../../test-utils/render";
import VideoModal from "../index";

/**
 * The open/close morph shares a Motion `layoutId` between the thumbnail and
 * the modal panel. jsdom never resolves the FLIP measurement that drives that
 * shared-layout exit animation, so a real (non-reduced-motion) close hangs
 * forever under `waitFor`. Reduced motion drops the shared layoutId and all
 * transitions to `duration: 0` (see the component's "Reduced Motion" docs),
 * which sidesteps the jsdom limitation without changing any of the
 * open/close/focus/control-bar logic under test. Individual tests that need
 * the non-reduced branch (autoplay-on-open) override this per test.
 */
vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return { ...actual, useReducedMotion: vi.fn(() => true) };
});

/** jsdom's HTMLMediaElement.play()/pause() are "not implemented" stubs — play()
 * returns undefined instead of a Promise, so the component's own
 * `video.play().catch(...)` would throw. Stub both so opening/toggling works.
 *
 * `paused` has to move with them. The component decides what to do from the
 * element's live `paused` property rather than from React state, which is the
 * right call — it stays truthful when playback is driven from outside the
 * component. A stub that leaves `paused` permanently true would make every
 * toggle look like a play, so the fake element tracks it the way a real one
 * does. */
let isPausedStub = true;

beforeEach(() => {
  isPausedStub = true;
  Object.defineProperty(window.HTMLMediaElement.prototype, "paused", {
    configurable: true,
    get: () => isPausedStub,
  });
  vi.spyOn(window.HTMLMediaElement.prototype, "play").mockImplementation(() => {
    isPausedStub = false;
    return Promise.resolve();
  });
  vi.spyOn(window.HTMLMediaElement.prototype, "pause").mockImplementation(
    () => {
      isPausedStub = true;
    }
  );
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.mocked(useReducedMotion).mockReturnValue(true);
});

describe("VideoModal", () => {
  it("renders without throwing when closed", () => {
    const { container } = render(
      <VideoModal src="https://example.com/video.mp4" title="Demo video" />
    );
    expect(container).toBeInTheDocument();
  });

  it("renders without throwing when open", () => {
    const { container } = render(
      <VideoModal open src="https://example.com/video.mp4" title="Demo video" />
    );
    expect(container).toBeInTheDocument();
  });

  it("opens via the trigger and closes via the close button, returning focus", async () => {
    const user = userEvent.setup();
    render(
      <VideoModal src="https://example.com/video.mp4" title="Demo video" />
    );

    const trigger = screen.getByRole("button", { name: "Play Demo video" });
    await user.click(trigger);

    const dialog = await screen.findByRole("dialog", { name: "Demo video" });
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveFocus();
    expect(trigger).toHaveAttribute("aria-hidden", "true");

    await user.click(
      within(dialog).getByRole("button", { name: "Close video" })
    );

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    );
    expect(trigger).toHaveFocus();
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    render(
      <VideoModal src="https://example.com/video.mp4" title="Demo video" />
    );

    const trigger = screen.getByRole("button", { name: "Play Demo video" });
    await user.click(trigger);
    await screen.findByRole("dialog", { name: "Demo video" });

    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    );
    expect(trigger).toHaveFocus();
  });

  it("supports the controlled open/onOpenChange contract", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <VideoModal
        onOpenChange={onOpenChange}
        open={false}
        src="https://example.com/video.mp4"
        title="Demo video"
      />
    );

    await user.click(screen.getByRole("button", { name: "Play Demo video" }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    // Controlled: the modal does not open on its own.
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    rerender(
      <VideoModal
        onOpenChange={onOpenChange}
        open
        src="https://example.com/video.mp4"
        title="Demo video"
      />
    );
    const dialog = await screen.findByRole("dialog", { name: "Demo video" });
    expect(dialog).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onOpenChange).toHaveBeenCalledWith(false);
    // Controlled: still open because the prop has not changed yet.
    expect(
      screen.getByRole("dialog", { name: "Demo video" })
    ).toBeInTheDocument();

    rerender(
      <VideoModal
        onOpenChange={onOpenChange}
        open={false}
        src="https://example.com/video.mp4"
        title="Demo video"
      />
    );
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    );
  });

  it("locks body scroll while open and restores it on close", async () => {
    const user = userEvent.setup();
    render(
      <VideoModal src="https://example.com/video.mp4" title="Demo video" />
    );

    expect(document.body.style.overflow).not.toBe("hidden");

    await user.click(screen.getByRole("button", { name: "Play Demo video" }));
    const dialog = await screen.findByRole("dialog", { name: "Demo video" });
    expect(document.body.style.overflow).toBe("hidden");

    await user.click(
      within(dialog).getByRole("button", { name: "Close video" })
    );
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    );
    expect(document.body.style.overflow).toBe("");
  });

  it("traps Tab focus inside the panel and wraps from last to first", async () => {
    const user = userEvent.setup();
    render(
      <VideoModal src="https://example.com/video.mp4" title="Demo video" />
    );

    await user.click(screen.getByRole("button", { name: "Play Demo video" }));
    const dialog = await screen.findByRole("dialog", { name: "Demo video" });
    expect(dialog).toHaveFocus();

    const playPauseButton = within(dialog).getByRole("button", {
      name: "Play",
    });
    const scrubber = within(dialog).getByRole("slider", { name: "Seek" });
    const muteButton = within(dialog).getByRole("button", { name: "Mute" });
    const fullscreenButton = within(dialog).getByRole("button", {
      name: "Enter fullscreen",
    });
    const closeButton = within(dialog).getByRole("button", {
      name: "Close video",
    });

    await user.tab();
    expect(playPauseButton).toHaveFocus();
    await user.tab();
    expect(scrubber).toHaveFocus();
    await user.tab();
    expect(muteButton).toHaveFocus();
    await user.tab();
    expect(fullscreenButton).toHaveFocus();
    await user.tab();
    expect(closeButton).toHaveFocus();

    // Tabbing forward from the last control wraps back to the first.
    await user.tab();
    expect(playPauseButton).toHaveFocus();

    // Shift+Tab from the first control wraps back to the last.
    await user.tab({ shift: true });
    expect(closeButton).toHaveFocus();
  });

  it("toggles the play/pause label in response to native video events", async () => {
    // BUG: the listener-attaching effect
    // (packages/smoothui/components/video-modal/index.tsx, the
    // `video.addEventListener("play"/"pause"/"timeupdate"/"loadedmetadata"/
    // "volumechange", ...)` effect) has an empty dependency array and reads
    // `videoRef.current` synchronously. The portal that renders the actual
    // `<video>` is gated behind a `mounted` flag that only flips true in a
    // *separate* effect one render later, so on every mount — regardless of
    // whether `open`/`autoPlayOnOpen` is true from the start — this effect
    // runs once, finds `videoRef.current === null`, and returns early. It
    // never reruns, so these listeners never attach in real usage: the
    // control bar's Play/Pause label, mute label, and scrub position never
    // update in response to real video playback. This test documents the
    // correct, documented behaviour and is expected to fail until the effect
    // depends on something that changes once the video actually mounts
    // (e.g. `isOpen`, or a callback ref).
    const user = userEvent.setup();
    render(
      <VideoModal
        autoPlayOnOpen={false}
        src="https://example.com/video.mp4"
        title="Demo video"
      />
    );

    await user.click(screen.getByRole("button", { name: "Play Demo video" }));
    const dialog = await screen.findByRole("dialog", { name: "Demo video" });
    const video = dialog.querySelector("video") as HTMLVideoElement;

    const toggleButton = within(dialog).getByRole("button", { name: "Play" });
    await user.click(toggleButton);
    expect(video.play).toHaveBeenCalledTimes(1);

    fireEvent(video, new Event("play"));
    expect(
      within(dialog).getByRole("button", { name: "Pause" })
    ).toBeInTheDocument();

    await user.click(within(dialog).getByRole("button", { name: "Pause" }));
    expect(video.pause).toHaveBeenCalledTimes(1);

    fireEvent(video, new Event("pause"));
    expect(
      within(dialog).getByRole("button", { name: "Play" })
    ).toBeInTheDocument();
  });

  it("toggles mute in response to native volumechange events", async () => {
    // Same root cause as the play/pause test above: the volumechange
    // listener never attaches, so the Mute/Unmute label never reflects
    // `video.muted`. Left failing to document the correct behaviour.
    const user = userEvent.setup();
    render(
      <VideoModal
        autoPlayOnOpen={false}
        src="https://example.com/video.mp4"
        title="Demo video"
      />
    );

    await user.click(screen.getByRole("button", { name: "Play Demo video" }));
    const dialog = await screen.findByRole("dialog", { name: "Demo video" });
    const video = dialog.querySelector("video") as HTMLVideoElement;

    await user.click(within(dialog).getByRole("button", { name: "Mute" }));
    expect(video.muted).toBe(true);

    fireEvent(video, new Event("volumechange"));
    expect(
      within(dialog).getByRole("button", { name: "Unmute" })
    ).toBeInTheDocument();

    await user.click(within(dialog).getByRole("button", { name: "Unmute" }));
    expect(video.muted).toBe(false);

    fireEvent(video, new Event("volumechange"));
    expect(
      within(dialog).getByRole("button", { name: "Mute" })
    ).toBeInTheDocument();
  });

  it("autoplays on open unless autoPlayOnOpen is false", async () => {
    vi.mocked(useReducedMotion).mockReturnValue(false);
    const user = userEvent.setup();
    const { unmount } = render(
      <VideoModal src="https://example.com/video.mp4" title="Demo video" />
    );

    await user.click(screen.getByRole("button", { name: "Play Demo video" }));
    await screen.findByRole("dialog", { name: "Demo video" });
    expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalled();
    unmount();

    vi.mocked(window.HTMLMediaElement.prototype.play).mockClear();

    render(
      <VideoModal
        autoPlayOnOpen={false}
        src="https://example.com/video.mp4"
        title="Demo video 2"
      />
    );
    await user.click(screen.getByRole("button", { name: "Play Demo video 2" }));
    await screen.findByRole("dialog", { name: "Demo video 2" });
    expect(window.HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
  });

  it("renders a fallback caption track when no captions are supplied", async () => {
    const user = userEvent.setup();
    render(
      <VideoModal src="https://example.com/video.mp4" title="Demo video" />
    );

    await user.click(screen.getByRole("button", { name: "Play Demo video" }));
    const dialog = await screen.findByRole("dialog", { name: "Demo video" });

    const tracks = dialog.querySelectorAll("track");
    expect(tracks).toHaveLength(1);
    expect(tracks[0]).not.toHaveAttribute("src");
  });

  it("renders exactly one <track> per caption entry", async () => {
    const user = userEvent.setup();
    const captions = [
      { label: "English", src: "/captions/en.vtt", srcLang: "en" },
      { label: "Spanish", src: "/captions/es.vtt", srcLang: "es" },
    ];
    render(
      <VideoModal
        captions={captions}
        src="https://example.com/video.mp4"
        title="Demo video"
      />
    );

    await user.click(screen.getByRole("button", { name: "Play Demo video" }));
    const dialog = await screen.findByRole("dialog", { name: "Demo video" });

    // BUG: the component always appends one extra bare `<track kind="captions" />`
    // after the mapped captions (packages/smoothui/components/video-modal/index.tsx
    // around the <video> children), so this currently renders captions.length + 1
    // tracks instead of one per entry as the docs promise. This assertion documents
    // the correct, documented behaviour and is expected to fail until that's fixed.
    const tracks = dialog.querySelectorAll("track");
    expect(tracks).toHaveLength(captions.length);
    for (const [index, caption] of captions.entries()) {
      expect(tracks[index]).toHaveAttribute("src", caption.src);
      expect(tracks[index]).toHaveAttribute("srclang", caption.srcLang);
      expect(tracks[index]).toHaveAttribute("label", caption.label);
    }
  });
});
