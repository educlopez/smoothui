import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import {
  type Canvas2DMock,
  flushFrames,
  installCanvas2DMock,
  installIntersectionObserverMock,
  installMediaElementMock,
  pendingFrameCount,
  uninstallCanvas2DMock,
  uninstallIntersectionObserverMock,
  uninstallMediaElementMock,
} from "../../../test-utils/canvas-2d";
import { fireEvent, render } from "../../../test-utils/render";
import AsciiRender from "../index";

const IMAGE_SOURCE = {
  src: "https://example.com/image.png",
  type: "image",
} as const;
const VIDEO_SOURCE = {
  src: "https://example.com/video.mp4",
  type: "video",
} as const;

const COLUMNS = 20;
const MEDIA_WIDTH = 64;
const MEDIA_HEIGHT = 48;
/** round(columns * height * CHAR_ASPECT / width) */
const ROWS = 8;

describe("AsciiRender", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <AsciiRender alt="A sample image" source={IMAGE_SOURCE} />
    );
    expect(container).toBeInTheDocument();
  });

  it("renders with a video source and source color mode", () => {
    const { container } = render(
      <AsciiRender alt="A sample video" color="source" source={VIDEO_SOURCE} />
    );
    expect(container).toBeInTheDocument();
  });
});

describe("AsciiRender sampling", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <AsciiRender alt="A photo" columns={COLUMNS} source={IMAGE_SOURCE} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  let canvas2d: Canvas2DMock;

  beforeEach(() => {
    canvas2d = installCanvas2DMock();
    installMediaElementMock({
      naturalHeight: MEDIA_HEIGHT,
      naturalWidth: MEDIA_WIDTH,
    });
  });

  afterEach(() => {
    uninstallMediaElementMock();
    uninstallCanvas2DMock();
  });

  const preOf = (container: HTMLElement) => {
    const pre = container.querySelector("pre");
    if (!pre) {
      throw new Error("expected a pre");
    }
    return pre;
  };

  it("rasterises an image into a character grid", () => {
    const { container } = render(
      <AsciiRender alt="A photo" columns={COLUMNS} source={IMAGE_SOURCE} />
    );

    const context = canvas2d.last();
    expect(context?.drawImage).toHaveBeenCalled();
    expect(context?.getImageData).toHaveBeenCalledWith(0, 0, COLUMNS, ROWS);
    expect(context?.canvas.width).toBe(COLUMNS);
    expect(context?.canvas.height).toBe(ROWS);

    const text = preOf(container).textContent ?? "";
    expect(text).toHaveLength(ROWS * (COLUMNS + 1));
    expect(text.split("\n")).toHaveLength(ROWS + 1);
    // A real luminance read produces a mix of glyphs, not one repeated char.
    expect(new Set(text.replace(/\n/g, "")).size).toBeGreaterThan(1);
  });

  it("inverts the luminance-to-glyph mapping", () => {
    const { container: plain } = render(
      <AsciiRender alt="A photo" columns={COLUMNS} source={IMAGE_SOURCE} />
    );
    const { container: inverted } = render(
      <AsciiRender
        alt="A photo"
        columns={COLUMNS}
        invert
        source={IMAGE_SOURCE}
      />
    );

    expect(preOf(inverted).textContent).not.toBe(preOf(plain).textContent);
  });

  it("falls back to the default ramp for a single-character charset", () => {
    const { container: single } = render(
      <AsciiRender
        alt="A photo"
        charset="#"
        columns={COLUMNS}
        source={IMAGE_SOURCE}
      />
    );
    const { container: standard } = render(
      <AsciiRender alt="A photo" columns={COLUMNS} source={IMAGE_SOURCE} />
    );

    expect(preOf(single).textContent).toBe(preOf(standard).textContent);
  });

  it("uses a custom ramp", () => {
    const { container } = render(
      <AsciiRender
        alt="A photo"
        charset="ab"
        columns={COLUMNS}
        source={IMAGE_SOURCE}
      />
    );
    expect(preOf(container).textContent?.replace(/\n/g, "")).toMatch(/^[ab]+$/);
  });

  it("tints the glyphs with the frame in source colour mode", () => {
    const { container } = render(
      <AsciiRender
        alt="A photo"
        color="source"
        columns={COLUMNS}
        source={IMAGE_SOURCE}
      />
    );
    expect(preOf(container).style.backgroundImage).toContain(
      "data:image/png;base64"
    );
  });

  it("clamps the column count to the supported range", () => {
    render(<AsciiRender alt="A photo" columns={9000} source={IMAGE_SOURCE} />);
    expect(canvas2d.last()?.canvas.width).toBe(240);
  });

  it("holds a single frame for an image source", () => {
    render(
      <AsciiRender alt="A photo" columns={COLUMNS} source={IMAGE_SOURCE} />
    );
    expect(pendingFrameCount()).toBe(0);
  });

  it("drives a video source frame by frame at the requested fps", () => {
    render(
      <AsciiRender
        alt="A clip"
        columns={COLUMNS}
        fps={24}
        source={VIDEO_SOURCE}
      />
    );

    const context = canvas2d.last();
    const initialDraws = context?.drawImage.mock.calls.length ?? 0;
    expect(initialDraws).toBe(1);
    expect(pendingFrameCount()).toBeGreaterThan(0);

    // 24fps is a 41.7ms budget, so a 16ms frame is skipped and a later one draws.
    flushFrames(1);
    expect(context?.drawImage.mock.calls.length).toBe(initialDraws);
    flushFrames(3);
    expect(context?.drawImage.mock.calls.length).toBeGreaterThan(initialDraws);
  });

  it("holds the frame when paused", () => {
    render(
      <AsciiRender
        alt="A clip"
        columns={COLUMNS}
        paused
        source={VIDEO_SOURCE}
      />
    );
    expect(canvas2d.last()?.drawImage).toHaveBeenCalledTimes(1);
    expect(pendingFrameCount()).toBe(0);
  });

  it("cancels the loop on unmount", () => {
    const { unmount } = render(
      <AsciiRender alt="A clip" columns={COLUMNS} source={VIDEO_SOURCE} />
    );
    expect(pendingFrameCount()).toBeGreaterThan(0);

    unmount();
    expect(pendingFrameCount()).toBe(0);
  });

  it("falls back when the media fails to load", () => {
    const { container } = render(
      <AsciiRender alt="A photo" columns={COLUMNS} source={IMAGE_SOURCE} />
    );
    const image = container.querySelector("img");
    if (!image) {
      throw new Error("expected an img");
    }

    fireEvent.error(image);

    expect(preOf(container).className).toContain("hidden");
    expect(image.className).toContain("relative");
  });
});

describe("AsciiRender visibility", () => {
  afterEach(() => {
    uninstallIntersectionObserverMock();
    uninstallMediaElementMock();
    uninstallCanvas2DMock();
  });

  it("holds the frame while off screen", () => {
    installCanvas2DMock();
    installMediaElementMock({
      naturalHeight: MEDIA_HEIGHT,
      naturalWidth: MEDIA_WIDTH,
    });
    const intersection = installIntersectionObserverMock();

    render(
      <AsciiRender alt="A clip" columns={COLUMNS} source={VIDEO_SOURCE} />
    );
    expect(pendingFrameCount()).toBeGreaterThan(0);

    intersection.trigger(false);
    expect(pendingFrameCount()).toBe(0);
  });
});

describe("AsciiRender without a 2D context", () => {
  afterEach(() => {
    uninstallMediaElementMock();
    uninstallCanvas2DMock();
  });

  it("falls back when the canvas cannot be sampled", () => {
    installCanvas2DMock({ supported: false });
    installMediaElementMock();

    const { container } = render(
      <AsciiRender alt="A photo" source={IMAGE_SOURCE} />
    );
    expect(container.querySelector("pre")?.className).toContain("hidden");
  });

  it("holds at zero size when the media has no intrinsic dimensions", () => {
    installCanvas2DMock();
    installMediaElementMock({ naturalHeight: 0, naturalWidth: 0 });

    const { container } = render(
      <AsciiRender alt="A photo" source={IMAGE_SOURCE} />
    );
    expect(container.querySelector("pre")?.textContent).toBe("");
  });
});
