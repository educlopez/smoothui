import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import {
  type Canvas2DMock,
  installCanvas2DMock,
  installIntersectionObserverMock,
  installMediaElementMock,
  uninstallCanvas2DMock,
  uninstallIntersectionObserverMock,
  uninstallMediaElementMock,
} from "../../../test-utils/canvas-2d";
import { act, render } from "../../../test-utils/render";
import DitherImage, { type DitherAlgorithm } from "../index";

const SRC = "https://example.com/photo.jpg";
const WIDTH = 64;
const HEIGHT = 48;
const PIXEL_SIZE = 4;
const GRID_WIDTH = WIDTH / PIXEL_SIZE;
const GRID_HEIGHT = HEIGHT / PIXEL_SIZE;

describe("DitherImage", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(<DitherImage alt="A photo" src={SRC} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders without throwing", () => {
    const { container } = render(<DitherImage alt="A photo" src={SRC} />);
    expect(container).toBeInTheDocument();
  });

  it("renders the progressive floyd-steinberg variant without throwing", () => {
    const { container } = render(
      <DitherImage
        algorithm="floyd-steinberg"
        alt="A photo"
        progressive
        src={SRC}
      />
    );
    expect(container).toBeInTheDocument();
  });
});

describe("DitherImage dither pass", () => {
  let canvas2d: Canvas2DMock;

  beforeEach(() => {
    canvas2d = installCanvas2DMock();
    installMediaElementMock({ naturalHeight: 96, naturalWidth: 128 });
  });

  afterEach(() => {
    uninstallMediaElementMock();
    uninstallCanvas2DMock();
  });

  /** Renders and lets the stubbed image decode. */
  const setup = async (
    props: Partial<Parameters<typeof DitherImage>[0]> = {}
  ) => {
    const result = render(
      <DitherImage
        alt="A photo"
        height={HEIGHT}
        pixelSize={PIXEL_SIZE}
        src={SRC}
        width={WIDTH}
        {...props}
      />
    );
    await act(async () => {
      await Promise.resolve();
    });
    return result;
  };

  /**
   * The three contexts, in creation order: the destination canvas, the 1x1
   * scratch used to resolve CSS colours, and the low-resolution grid.
   */
  const contextsOf = () => ({
    grid: canvas2d.contexts[2],
    scratch: canvas2d.contexts[1],
    screen: canvas2d.contexts[0],
  });

  const distinctTones = (data: Uint8ClampedArray) => {
    const tones = new Set<string>();
    for (let offset = 0; offset < data.length; offset += 4) {
      tones.add(`${data[offset]},${data[offset + 1]},${data[offset + 2]}`);
    }
    return tones;
  };

  it("samples the image into a low-resolution grid and blits it back", async () => {
    await setup();
    const { grid, screen } = contextsOf();

    expect(grid.canvas.width).toBe(GRID_WIDTH);
    expect(grid.canvas.height).toBe(GRID_HEIGHT);
    expect(grid.drawImage).toHaveBeenCalledWith(
      expect.anything(),
      0,
      0,
      GRID_WIDTH,
      GRID_HEIGHT
    );
    expect(grid.getImageData).toHaveBeenCalledWith(
      0,
      0,
      GRID_WIDTH,
      GRID_HEIGHT
    );
    expect(grid.putImageData).toHaveBeenCalledTimes(1);

    expect(screen.canvas.width).toBe(WIDTH);
    expect(screen.imageSmoothingEnabled).toBe(false);
    expect(screen.drawImage).toHaveBeenCalledWith(
      grid.canvas,
      0,
      0,
      WIDTH,
      HEIGHT
    );
  });

  it("quantises the sampled pixels down to the requested tone count", async () => {
    await setup({ levels: 2 });
    const { grid } = contextsOf();

    expect(distinctTones(grid.reads[0]).size).toBeGreaterThan(2);
    expect(distinctTones(grid.writes[0]).size).toBe(2);
  });

  it("clamps the tone count to the supported range", async () => {
    await setup({ levels: 99 });
    expect(distinctTones(contextsOf().grid.writes[0]).size).toBeLessThanOrEqual(
      8
    );
  });

  it("paints from an explicit palette", async () => {
    await setup({ levels: 3, palette: ["#ff0000", "#00ff00"] });
    const tones = distinctTones(contextsOf().grid.writes[0]);

    expect(tones.size).toBeLessThanOrEqual(3);
    expect(tones.has("255,0,0")).toBe(true);
  });

  it.each<DitherAlgorithm>([
    "bayer",
    "threshold",
    "atkinson",
    "floyd-steinberg",
  ])("runs the %s kernel", async (algorithm) => {
    await setup({ algorithm });
    expect(contextsOf().grid.putImageData).toHaveBeenCalledTimes(1);
  });

  it("produces a different pattern per kernel", async () => {
    await setup({ algorithm: "bayer" });
    const bayer = Array.from(contextsOf().grid.writes[0]);

    uninstallCanvas2DMock();
    canvas2d = installCanvas2DMock();
    await setup({ algorithm: "threshold" });
    const threshold = Array.from(contextsOf().grid.writes[0]);

    expect(bayer).not.toEqual(threshold);
  });

  it("releases the buffers on unmount", async () => {
    const { unmount } = await setup();
    const { grid, screen } = contextsOf();

    unmount();

    expect(screen.canvas.width).toBe(0);
    expect(grid.canvas.width).toBe(0);
  });

  it("keeps the source visible when the image fails to load", async () => {
    uninstallMediaElementMock();
    installMediaElementMock({ fail: true });

    await setup();

    expect(canvas2d.contexts[2]?.putImageData).not.toHaveBeenCalled();
  });
});

describe("DitherImage reveal", () => {
  afterEach(() => {
    uninstallIntersectionObserverMock();
    uninstallMediaElementMock();
    uninstallCanvas2DMock();
  });

  it("wipes the dithered pass in when it scrolls into view", async () => {
    installCanvas2DMock();
    installMediaElementMock();
    const intersection = installIntersectionObserverMock({
      intersecting: false,
    });

    const { container } = render(
      <DitherImage alt="A photo" progressive src={SRC} />
    );
    await act(async () => {
      await Promise.resolve();
    });

    const canvas = container.querySelector("canvas");
    expect(canvas).toBeInTheDocument();

    intersection.trigger(true);
    expect(canvas).toBeInTheDocument();
  });
});

describe("DitherImage without a 2D context", () => {
  afterEach(() => {
    uninstallMediaElementMock();
    uninstallCanvas2DMock();
  });

  it("falls back to the plain image", async () => {
    installCanvas2DMock({ supported: false });
    installMediaElementMock();

    const { container } = render(<DitherImage alt="A photo" src={SRC} />);
    await act(async () => {
      await Promise.resolve();
    });

    expect(container.querySelector("img")).toBeInTheDocument();
  });
});
