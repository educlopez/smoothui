import { act } from "@testing-library/react";
import { type Mock, vi } from "vitest";

/**
 * Opt-in jsdom stubs for the Canvas2D components.
 *
 * jsdom ships no 2D rasteriser, so `canvas.getContext("2d")` returns `null` and
 * every draw loop in the library bails on its own null guard — which leaves the
 * whole render path unreachable from a test. These helpers patch
 * `HTMLCanvasElement.prototype.getContext` to hand out a recording fake context,
 * give the canvas a non-zero layout box (jsdom lays everything out at 0x0), and
 * replace `requestAnimationFrame` / `cancelAnimationFrame` / `performance.now`
 * with a manually-steppable clock so frames can be driven deterministically.
 *
 * Nothing here is global: `test-utils/setup.ts` still leaves `getContext`
 * returning `null` by default, so components are only handed a context in the
 * files that call `installCanvas2DMock` themselves.
 *
 * Every call is recorded as a `vi.fn`, and the rect-shaped subset of them also
 * writes into a readable pixel buffer, because several components read their own
 * pixels back — the dither passes, the text rasterisation in `pixel-flow-field`,
 * the luminance sampling in `ascii-render` — and a context that records without
 * writing makes those passes read zeros instead of data:
 *
 * - `clearRect` clears the rect, `fillRect` fills it with the parsed
 *   `fillStyle` at the current `globalAlpha`.
 * - `drawImage` and `fillText` stamp a deterministic, coordinate-seeded test
 *   pattern over their destination rect, standing in for pixels the fake has no
 *   way to actually rasterise.
 * - `putImageData` writes the buffer it is given, `getImageData` reads back.
 * - Paths (`fill`, `stroke`, `arc`, …) and transforms are recorded only.
 *
 * Colours that the fake cannot parse — `oklch()`, `var()`, a gradient — hash to
 * a stable colour, so distinct palette entries stay distinct.
 */

/* -------------------------------------------------------------------------- */
/* Fake 2D context                                                            */
/* -------------------------------------------------------------------------- */

const CHANNELS = 4;
const CHANNEL_MAX = 256;
const PATTERN_X_STEP = 37;
const PATTERN_Y_STEP = 53;
const PATTERN_G_OFFSET = 91;
const PATTERN_B_OFFSET = 173;
const PATTERN_A_OFFSET = 211;
const OPAQUE = 255;
const DEFAULT_FONT_SIZE = 10;
const GLYPH_WIDTH_RATIO = 0.6;
/** `drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)` */
const DRAW_IMAGE_FULL_ARGS = 8;
/** `drawImage(image, dx, dy, dw, dh)` */
const DRAW_IMAGE_SIZED_ARGS = 4;
const FONT_SIZE_PATTERN = /(\d+(?:\.\d+)?)px/;

/** Methods that put marks on the surface, as opposed to path/state bookkeeping. */
const PAINT_METHODS = [
  "clearRect",
  "drawImage",
  "fill",
  "fillRect",
  "fillText",
  "putImageData",
  "stroke",
  "strokeRect",
  "strokeText",
] as const;

export interface FakeImageData {
  colorSpace: "srgb";
  data: Uint8ClampedArray;
  height: number;
  width: number;
}

export interface FakeCanvasGradient {
  addColorStop: Mock;
}

/**
 * The recording 2D context. Every method is a `vi.fn`, so a test can assert on
 * `context.fillRect` directly; `paintCount()` is the cheap "did it draw at all"
 * check, and `reads` / `writes` hold copies of the pixel buffers that crossed
 * `getImageData` / `putImageData`.
 */
export interface FakeCanvas2DContext {
  arc: Mock;
  arcTo: Mock;
  beginPath: Mock;
  bezierCurveTo: Mock;
  readonly canvas: HTMLCanvasElement;
  clearRect: Mock;
  clip: Mock;
  closePath: Mock;
  createImageData: Mock;
  createLinearGradient: Mock;
  createPattern: Mock;
  createRadialGradient: Mock;

  direction: CanvasDirection;
  drawImage: Mock;
  ellipse: Mock;
  fill: Mock;
  fillRect: Mock;
  fillStyle: unknown;
  fillText: Mock;
  filter: string;
  font: string;
  getImageData: Mock;
  globalAlpha: number;
  globalCompositeOperation: string;
  imageSmoothingEnabled: boolean;
  imageSmoothingQuality: ImageSmoothingQuality;
  letterSpacing: string;
  lineCap: CanvasLineCap;
  lineDashOffset: number;
  lineJoin: CanvasLineJoin;
  lineTo: Mock;
  lineWidth: number;
  measureText: Mock;
  miterLimit: number;
  moveTo: Mock;
  /** Total number of painting calls (fills, strokes, blits, clears). */
  paintCount: () => number;
  putImageData: Mock;
  quadraticCurveTo: Mock;
  /** Copies of every buffer handed out by `getImageData`, in call order. */
  readonly reads: Uint8ClampedArray[];
  rect: Mock;
  /** Resets all `vi.fn` call records plus `reads` / `writes`. */
  resetRecords: () => void;
  resetTransform: Mock;
  restore: Mock;
  rotate: Mock;
  roundRect: Mock;
  save: Mock;
  scale: Mock;
  setLineDash: Mock;
  setTransform: Mock;
  shadowBlur: number;
  shadowColor: string;
  shadowOffsetX: number;
  shadowOffsetY: number;
  stroke: Mock;
  strokeRect: Mock;
  strokeStyle: unknown;
  strokeText: Mock;
  textAlign: CanvasTextAlign;
  textBaseline: CanvasTextBaseline;
  transform: Mock;
  translate: Mock;
  /** Copies of every buffer handed to `putImageData`, in call order. */
  readonly writes: Uint8ClampedArray[];
}

/** Deterministic per-pixel pattern, so pixel reads are varied but repeatable. */
const patternAt = (x: number, y: number, channel: number): number => {
  const seed = x * PATTERN_X_STEP + y * PATTERN_Y_STEP;
  if (channel === 0) {
    return seed % CHANNEL_MAX;
  }
  if (channel === 1) {
    return (seed + PATTERN_G_OFFSET) % CHANNEL_MAX;
  }
  if (channel === 2) {
    return (seed + PATTERN_B_OFFSET) % CHANNEL_MAX;
  }
  // Alpha varies too, so a pass that quantises coverage has something to
  // quantise rather than a uniformly opaque surface.
  return (seed + PATTERN_A_OFFSET) % CHANNEL_MAX;
};

const createPatternBuffer = (
  width: number,
  height: number,
  fill: PixelFill
): Uint8ClampedArray => {
  const data = new Uint8ClampedArray(
    Math.max(0, width) * Math.max(0, height) * CHANNELS
  );
  if (fill === "zero") {
    return data;
  }
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const offset = (y * width + x) * CHANNELS;
      for (let channel = 0; channel < CHANNELS; channel++) {
        data[offset + channel] = patternAt(x, y, channel);
      }
    }
  }
  return data;
};

/** The readable pixel buffer behind one canvas element. */
interface Backing {
  data: Uint8ClampedArray;
  height: number;
  width: number;
}

const measuredWidth = (text: string, font: string): number => {
  const match = FONT_SIZE_PATTERN.exec(font);
  const size = match ? Number.parseFloat(match[1]) : DEFAULT_FONT_SIZE;
  return text.length * size * GLYPH_WIDTH_RATIO;
};

const fontSizeOf = (font: string): number => {
  const match = FONT_SIZE_PATTERN.exec(font);
  return match ? Number.parseFloat(match[1]) : DEFAULT_FONT_SIZE;
};

const textLeft = (x: number, width: number, align: CanvasTextAlign): number => {
  if (align === "center") {
    return x - width / 2;
  }
  if (align === "right" || align === "end") {
    return x - width;
  }
  return x;
};

/* -------------------------------------------------------------------------- */
/* Colour parsing                                                             */
/* -------------------------------------------------------------------------- */

type Rgba = [number, number, number, number];

const HEX_PATTERN = /^#([0-9a-f]{3,8})$/i;
const RGB_PATTERN = /^rgba?\(([^)]+)\)$/i;
const HEX_SHORT = 3;
const HEX_SHORT_ALPHA = 4;
const HEX_LONG = 6;
const HEX_RADIX = 16;
const COLOR_HASH_PRIME = 131;

const NAMED_COLORS: Record<string, Rgba> = {
  black: [0, 0, 0, OPAQUE],
  blue: [0, 0, OPAQUE, OPAQUE],
  green: [0, 128, 0, OPAQUE],
  red: [OPAQUE, 0, 0, OPAQUE],
  transparent: [0, 0, 0, 0],
  white: [OPAQUE, OPAQUE, OPAQUE, OPAQUE],
};

/**
 * Any notation the fake cannot parse — `oklch()`, `var()`, a gradient object —
 * still has to resolve to *something*, and two different strings have to
 * resolve to two different colours or a palette collapses to one tone. Hashing
 * the string gives both, deterministically.
 */
const hashedColor = (input: string): Rgba => {
  let hash = 0;
  for (let index = 0; index < input.length; index++) {
    hash = (hash * COLOR_HASH_PRIME + input.charCodeAt(index)) % 16_777_216;
  }
  return [
    hash % CHANNEL_MAX,
    Math.floor(hash / CHANNEL_MAX) % CHANNEL_MAX,
    Math.floor(hash / (CHANNEL_MAX * CHANNEL_MAX)) % CHANNEL_MAX,
    OPAQUE,
  ];
};

const parseHex = (hex: string): Rgba | null => {
  const expand = (part: string) => Number.parseInt(part.repeat(2), HEX_RADIX);
  if (hex.length === HEX_SHORT || hex.length === HEX_SHORT_ALPHA) {
    return [
      expand(hex[0]),
      expand(hex[1]),
      expand(hex[2]),
      hex.length === HEX_SHORT_ALPHA ? expand(hex[3]) : OPAQUE,
    ];
  }
  if (hex.length === HEX_LONG || hex.length === HEX_LONG + 2) {
    const pair = (index: number) =>
      Number.parseInt(hex.slice(index, index + 2), HEX_RADIX);
    return [
      pair(0),
      pair(2),
      pair(4),
      hex.length === HEX_LONG ? OPAQUE : pair(HEX_LONG),
    ];
  }
  return null;
};

const parseColor = (value: unknown): Rgba => {
  if (typeof value !== "string") {
    return hashedColor(String(value));
  }
  const input = value.trim().toLowerCase();
  const named = NAMED_COLORS[input];
  if (named) {
    return [...named];
  }
  const hex = HEX_PATTERN.exec(input);
  if (hex) {
    const parsed = parseHex(hex[1]);
    if (parsed) {
      return parsed;
    }
  }
  const rgb = RGB_PATTERN.exec(input);
  if (rgb) {
    const parts = rgb[1]
      .split(/[\s,/]+/)
      .filter(Boolean)
      .map(Number.parseFloat);
    if (
      parts.length >= HEX_SHORT &&
      parts.every((part) => !Number.isNaN(part))
    ) {
      return [
        parts[0],
        parts[1],
        parts[2],
        parts.length > HEX_SHORT ? parts[3] * OPAQUE : OPAQUE,
      ];
    }
  }
  return hashedColor(input);
};

const createGradient = (): FakeCanvasGradient => ({
  addColorStop: vi.fn(),
});

const createFakeContext = (
  canvas: HTMLCanvasElement,
  pixels: PixelFill
): FakeCanvas2DContext => {
  const reads: Uint8ClampedArray[] = [];
  const writes: Uint8ClampedArray[] = [];
  let backing: Backing | null = null;

  const ensureBacking = (): Backing => {
    const { height, width } = canvas;
    if (!backing || backing.width !== width || backing.height !== height) {
      backing = {
        data: createPatternBuffer(width, height, pixels),
        height,
        width,
      };
    }
    return backing;
  };

  const readRegion = (
    x: number,
    y: number,
    width: number,
    height: number
  ): FakeImageData => {
    const source = ensureBacking();
    const data = new Uint8ClampedArray(
      Math.max(0, width) * Math.max(0, height) * CHANNELS
    );
    for (let row = 0; row < height; row++) {
      const sourceY = y + row;
      if (sourceY < 0 || sourceY >= source.height) {
        continue;
      }
      for (let column = 0; column < width; column++) {
        const sourceX = x + column;
        if (sourceX < 0 || sourceX >= source.width) {
          continue;
        }
        const from = (sourceY * source.width + sourceX) * CHANNELS;
        const to = (row * width + column) * CHANNELS;
        for (let channel = 0; channel < CHANNELS; channel++) {
          data[to + channel] = source.data[from + channel];
        }
      }
    }
    reads.push(new Uint8ClampedArray(data));
    return { colorSpace: "srgb", data, height, width };
  };

  const writeRegion = (image: FakeImageData, x: number, y: number): void => {
    writes.push(new Uint8ClampedArray(image.data));
    const target = ensureBacking();
    for (let row = 0; row < image.height; row++) {
      const targetY = y + row;
      if (targetY < 0 || targetY >= target.height) {
        continue;
      }
      for (let column = 0; column < image.width; column++) {
        const targetX = x + column;
        if (targetX < 0 || targetX >= target.width) {
          continue;
        }
        const from = (row * image.width + column) * CHANNELS;
        const to = (targetY * target.width + targetX) * CHANNELS;
        for (let channel = 0; channel < CHANNELS; channel++) {
          target.data[to + channel] = image.data[from + channel];
        }
      }
    }
  };

  /**
   * Writes into the readable buffer over an axis-aligned rect. `shade` returns
   * the RGBA for a device pixel, which is how a solid fill and a stamped
   * pattern share one code path. Transforms are recorded but not applied — a
   * component that only ever sets a device-pixel-ratio scale still lands in the
   * right place, and nothing here depends on sub-pixel accuracy.
   */
  const stampRect = (
    x: number,
    y: number,
    width: number,
    height: number,
    shade: (x: number, y: number) => Rgba
  ) => {
    const target = ensureBacking();
    const left = Math.max(0, Math.floor(Math.min(x, x + width)));
    const top = Math.max(0, Math.floor(Math.min(y, y + height)));
    const right = Math.min(target.width, Math.ceil(Math.max(x, x + width)));
    const bottom = Math.min(target.height, Math.ceil(Math.max(y, y + height)));
    for (let row = top; row < bottom; row++) {
      for (let column = left; column < right; column++) {
        const offset = (row * target.width + column) * CHANNELS;
        const [r, g, b, a] = shade(column, row);
        target.data[offset] = r;
        target.data[offset + 1] = g;
        target.data[offset + 2] = b;
        target.data[offset + 3] = a;
      }
    }
  };

  const solid = (style: unknown) => {
    const [r, g, b, a] = parseColor(style);
    const alpha = a * context.globalAlpha;
    return () => [r, g, b, alpha] as Rgba;
  };

  const stamped = () => {
    const alpha = context.globalAlpha;
    return (x: number, y: number) =>
      [
        patternAt(x, y, 0),
        patternAt(x, y, 1),
        patternAt(x, y, 2),
        patternAt(x, y, 3) * alpha,
      ] as Rgba;
  };

  /** `drawImage` accepts three overloads; only the destination rect matters. */
  const destinationRect = (
    args: number[]
  ): [number, number, number, number] => {
    if (args.length >= DRAW_IMAGE_FULL_ARGS) {
      return [args[4], args[5], args[6], args[7]];
    }
    if (args.length >= DRAW_IMAGE_SIZED_ARGS) {
      return [args[0], args[1], args[2], args[3]];
    }
    return [args[0] ?? 0, args[1] ?? 0, canvas.width, canvas.height];
  };

  const context: FakeCanvas2DContext = {
    arc: vi.fn(),
    arcTo: vi.fn(),
    beginPath: vi.fn(),
    bezierCurveTo: vi.fn(),
    canvas,
    clearRect: vi.fn((x: number, y: number, width: number, height: number) => {
      stampRect(x, y, width, height, () => [0, 0, 0, 0]);
    }),
    clip: vi.fn(),
    closePath: vi.fn(),
    createImageData: vi.fn(
      (width: number, height: number): FakeImageData => ({
        colorSpace: "srgb",
        data: new Uint8ClampedArray(
          Math.max(0, width) * Math.max(0, height) * CHANNELS
        ),
        height,
        width,
      })
    ),
    createLinearGradient: vi.fn(createGradient),
    createPattern: vi.fn(() => null),
    createRadialGradient: vi.fn(createGradient),
    direction: "ltr" as CanvasDirection,
    drawImage: vi.fn((_source: unknown, ...args: number[]) => {
      const [x, y, width, height] = destinationRect(args);
      stampRect(x, y, width, height, stamped());
    }),
    ellipse: vi.fn(),
    fill: vi.fn(),
    fillRect: vi.fn((x: number, y: number, width: number, height: number) => {
      stampRect(x, y, width, height, solid(context.fillStyle));
    }),
    fillStyle: "#000000" as unknown,
    fillText: vi.fn((text: string, x: number, y: number) => {
      const size = fontSizeOf(context.font);
      const width = measuredWidth(text, context.font);
      const left = textLeft(x, width, context.textAlign);
      const top = context.textBaseline === "middle" ? y - size / 2 : y - size;
      stampRect(left, top, width, size, stamped());
    }),
    filter: "none",
    font: `${DEFAULT_FONT_SIZE}px sans-serif`,
    getImageData: vi.fn(readRegion),
    globalAlpha: 1,
    globalCompositeOperation: "source-over",
    imageSmoothingEnabled: true,
    imageSmoothingQuality: "low" as ImageSmoothingQuality,
    letterSpacing: "0px",
    lineCap: "butt" as CanvasLineCap,
    lineDashOffset: 0,
    lineJoin: "miter" as CanvasLineJoin,
    lineTo: vi.fn(),
    lineWidth: 1,
    measureText: vi.fn((text: string) => ({
      actualBoundingBoxAscent: DEFAULT_FONT_SIZE,
      actualBoundingBoxDescent: 0,
      actualBoundingBoxLeft: 0,
      actualBoundingBoxRight: measuredWidth(text, context.font),
      width: measuredWidth(text, context.font),
    })),
    miterLimit: 10,
    moveTo: vi.fn(),
    paintCount: () => {
      let total = 0;
      for (const method of PAINT_METHODS) {
        total += context[method].mock.calls.length;
      }
      return total;
    },
    putImageData: vi.fn(writeRegion),
    quadraticCurveTo: vi.fn(),
    reads,
    rect: vi.fn(),
    resetRecords: () => {
      for (const value of Object.values(context)) {
        if (typeof value === "function" && "mock" in value) {
          (value as Mock).mockClear();
        }
      }
      reads.length = 0;
      writes.length = 0;
    },
    resetTransform: vi.fn(),
    restore: vi.fn(),
    rotate: vi.fn(),
    roundRect: vi.fn(),
    save: vi.fn(),
    scale: vi.fn(),
    setLineDash: vi.fn(),
    setTransform: vi.fn(),
    shadowBlur: 0,
    shadowColor: "rgba(0, 0, 0, 0)",
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    stroke: vi.fn(),
    strokeRect: vi.fn(),
    strokeStyle: "#000000" as unknown,
    strokeText: vi.fn(),
    textAlign: "start" as CanvasTextAlign,
    textBaseline: "alphabetic" as CanvasTextBaseline,
    transform: vi.fn(),
    translate: vi.fn(),
    writes,
  };

  return context;
};

/* -------------------------------------------------------------------------- */
/* Install / uninstall                                                        */
/* -------------------------------------------------------------------------- */

export type PixelFill = "pattern" | "zero";

export interface InstallCanvas2DMockOptions {
  /** CSS height reported by `getBoundingClientRect` / `clientHeight`. */
  height?: number;
  /**
   * Answers `window.matchMedia`. The default reports hover-capable pointers and
   * no reduced-motion preference, which is what keeps pointer-driven canvases
   * mounted and animating.
   */
  matchMedia?: (query: string) => boolean;
  /** Seed of the readable pixel buffer. `zero` gives an empty surface. */
  pixels?: PixelFill;
  /**
   * When false, `getContext("2d")` keeps returning `null`, which is how the
   * unsupported-canvas fallback branches are reached.
   */
  supported?: boolean;
  /** CSS width reported by `getBoundingClientRect` / `clientWidth`. */
  width?: number;
}

export interface Canvas2DMock {
  /** The context belonging to `canvas`, if one was requested. */
  contextFor: (canvas: HTMLCanvasElement) => FakeCanvas2DContext | undefined;
  /** Every context handed out, in creation order. */
  readonly contexts: FakeCanvas2DContext[];
  /** The most recently created context. */
  last: () => FakeCanvas2DContext | undefined;
  /** Sum of `paintCount()` across every context. */
  paintCount: () => number;
}

const DEFAULT_WIDTH = 320;
const DEFAULT_HEIGHT = 180;
const DATA_URL = "data:image/png;base64,iVBORw0KGgo=";

let contexts: FakeCanvas2DContext[] = [];
let contextsByCanvas = new WeakMap<HTMLCanvasElement, FakeCanvas2DContext>();

let originalGetContext: typeof HTMLCanvasElement.prototype.getContext | null =
  null;
let originalToDataURL: typeof HTMLCanvasElement.prototype.toDataURL | null =
  null;
let originalGetBoundingClientRect:
  | typeof HTMLElement.prototype.getBoundingClientRect
  | null = null;
let originalClientWidth: PropertyDescriptor | undefined;
let originalClientHeight: PropertyDescriptor | undefined;
let originalMatchMedia: typeof window.matchMedia | null = null;

let originalRaf: typeof requestAnimationFrame | null = null;
let originalCaf: typeof cancelAnimationFrame | null = null;
let nowSpy: ReturnType<typeof vi.spyOn> | null = null;

let rafQueue = new Map<number, FrameRequestCallback>();
let nextRafId = 0;
let currentTime = 0;

const defaultMatchMedia = (query: string) =>
  query.includes("hover") || query.includes("pointer: fine");

const mediaQueryList = (query: string, matches: boolean) => ({
  addEventListener: vi.fn(),
  addListener: vi.fn(),
  dispatchEvent: vi.fn(() => false),
  matches,
  media: query,
  onchange: null,
  removeEventListener: vi.fn(),
  removeListener: vi.fn(),
});

/**
 * Installs the Canvas2D + layout + rAF + matchMedia stubs and returns a handle
 * onto the contexts handed out. Call from `beforeEach`, and pair with
 * `uninstallCanvas2DMock` in `afterEach`.
 */
export const installCanvas2DMock = (
  options: InstallCanvas2DMockOptions = {}
): Canvas2DMock => {
  const supported = options.supported ?? true;
  const width = options.width ?? DEFAULT_WIDTH;
  const height = options.height ?? DEFAULT_HEIGHT;
  const pixels = options.pixels ?? "pattern";
  const matcher = options.matchMedia ?? defaultMatchMedia;

  contexts = [];
  contextsByCanvas = new WeakMap();

  originalGetContext = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = vi.fn(function getContextStub(
    this: HTMLCanvasElement,
    contextId: string
  ) {
    if (!supported || contextId !== "2d") {
      return null;
    }
    const existing = contextsByCanvas.get(this);
    if (existing) {
      return existing;
    }
    const context = createFakeContext(this, pixels);
    contextsByCanvas.set(this, context);
    contexts.push(context);
    return context;
  }) as unknown as typeof HTMLCanvasElement.prototype.getContext;

  originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
  HTMLCanvasElement.prototype.toDataURL = vi.fn(
    () => DATA_URL
  ) as unknown as typeof HTMLCanvasElement.prototype.toDataURL;

  // jsdom lays every element out at 0x0, which collapses grids to a single cell
  // and makes most draw loops early-return before they paint anything.
  originalGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect;
  HTMLElement.prototype.getBoundingClientRect = vi.fn(
    () =>
      ({
        bottom: height,
        height,
        left: 0,
        right: width,
        toJSON: () => ({}),
        top: 0,
        width,
        x: 0,
        y: 0,
      }) as DOMRect
  );

  originalClientWidth = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    "clientWidth"
  );
  originalClientHeight = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    "clientHeight"
  );
  Object.defineProperty(HTMLElement.prototype, "clientWidth", {
    configurable: true,
    get: () => width,
  });
  Object.defineProperty(HTMLElement.prototype, "clientHeight", {
    configurable: true,
    get: () => height,
  });

  originalMatchMedia = window.matchMedia;
  window.matchMedia = vi.fn((query: string) =>
    mediaQueryList(query, matcher(query))
  ) as unknown as typeof window.matchMedia;

  rafQueue = new Map();
  nextRafId = 0;
  currentTime = 0;

  originalRaf = globalThis.requestAnimationFrame;
  originalCaf = globalThis.cancelAnimationFrame;
  globalThis.requestAnimationFrame = ((callback: FrameRequestCallback) => {
    nextRafId += 1;
    rafQueue.set(nextRafId, callback);
    return nextRafId;
  }) as typeof requestAnimationFrame;
  globalThis.cancelAnimationFrame = ((id: number) => {
    rafQueue.delete(id);
  }) as typeof cancelAnimationFrame;

  nowSpy = vi.spyOn(performance, "now").mockImplementation(() => currentTime);

  return {
    contextFor: (canvas: HTMLCanvasElement) => contextsByCanvas.get(canvas),
    contexts,
    last: () => contexts.at(-1),
    paintCount: () =>
      contexts.reduce((total, context) => total + context.paintCount(), 0),
  };
};

/** Restores everything patched by `installCanvas2DMock`. Call from `afterEach`. */
export const uninstallCanvas2DMock = () => {
  if (originalGetContext) {
    HTMLCanvasElement.prototype.getContext = originalGetContext;
    originalGetContext = null;
  }
  if (originalToDataURL) {
    HTMLCanvasElement.prototype.toDataURL = originalToDataURL;
    originalToDataURL = null;
  }
  if (originalGetBoundingClientRect) {
    HTMLElement.prototype.getBoundingClientRect = originalGetBoundingClientRect;
    originalGetBoundingClientRect = null;
  }
  if (originalClientWidth) {
    Object.defineProperty(
      HTMLElement.prototype,
      "clientWidth",
      originalClientWidth
    );
    originalClientWidth = undefined;
  }
  if (originalClientHeight) {
    Object.defineProperty(
      HTMLElement.prototype,
      "clientHeight",
      originalClientHeight
    );
    originalClientHeight = undefined;
  }
  if (originalMatchMedia) {
    window.matchMedia = originalMatchMedia;
    originalMatchMedia = null;
  }
  if (originalRaf) {
    globalThis.requestAnimationFrame = originalRaf;
    originalRaf = null;
  }
  if (originalCaf) {
    globalThis.cancelAnimationFrame = originalCaf;
    originalCaf = null;
  }
  nowSpy?.mockRestore();
  nowSpy = null;
  rafQueue = new Map();
  contexts = [];
  contextsByCanvas = new WeakMap();
};

/* -------------------------------------------------------------------------- */
/* Frame clock                                                                */
/* -------------------------------------------------------------------------- */

const runFrame = (stepMs: number) => {
  currentTime += stepMs;
  const callbacks = Array.from(rafQueue.values());
  rafQueue.clear();
  for (const callback of callbacks) {
    callback(currentTime);
  }
};

/**
 * Advances the mocked clock by `stepMs` and synchronously runs pending rAF
 * callbacks, wrapped in `act()` so any React state updates they trigger are
 * flushed before this call returns.
 */
export const flushFrame = (stepMs = 16) => {
  act(() => {
    runFrame(stepMs);
  });
};

/** Flushes `count` animation frames, each advancing the clock by `stepMs`. */
export const flushFrames = (count: number, stepMs = 16) => {
  act(() => {
    for (let index = 0; index < count; index += 1) {
      runFrame(stepMs);
    }
  });
};

/**
 * Flushes frames until the mocked clock has advanced at least `durationMs`,
 * bounded by `maxFrames` as a safety valve against runaway rAF loops.
 */
export const runFramesFor = (
  durationMs: number,
  { stepMs = 16, maxFrames = 500 }: { maxFrames?: number; stepMs?: number } = {}
) => {
  act(() => {
    let framesRun = 0;
    const until = currentTime + durationMs;
    while (currentTime < until && framesRun < maxFrames) {
      runFrame(stepMs);
      framesRun += 1;
    }
  });
};

/** Number of rAF callbacks currently queued — 0 means the loop has stopped. */
export const pendingFrameCount = () => rafQueue.size;

/** Current value of the mocked `performance.now()`. */
export const currentTimeMs = () => currentTime;

/* -------------------------------------------------------------------------- */
/* Media element stubs                                                        */
/* -------------------------------------------------------------------------- */

export interface InstallMediaElementMockOptions {
  /** Dispatch `error` instead of `load` when a src is assigned. */
  fail?: boolean;
  /** Intrinsic height reported by images and videos. */
  naturalHeight?: number;
  /** Intrinsic width reported by images and videos. */
  naturalWidth?: number;
}

const DEFAULT_MEDIA_WIDTH = 64;
const DEFAULT_MEDIA_HEIGHT = 48;
const HAVE_CURRENT_DATA = 2;

interface StubbedProperty {
  descriptor: PropertyDescriptor | undefined;
  name: string;
  target: object;
}

let stubbedMediaProperties: StubbedProperty[] = [];

const stubProperty = (
  target: object,
  name: string,
  descriptor: PropertyDescriptor
) => {
  stubbedMediaProperties.push({
    descriptor: Object.getOwnPropertyDescriptor(target, name),
    name,
    target,
  });
  Object.defineProperty(target, name, { configurable: true, ...descriptor });
};

/**
 * Makes `<img>` / `new Image()` / `<video>` behave as already-decoded media.
 *
 * jsdom never loads resources, so an image is forever incomplete with zero
 * intrinsic size and a video never reaches `HAVE_CURRENT_DATA` — both of which
 * make the sampling components bail before they touch a context. Assigning
 * `src` also dispatches a `load` (or `error`) event on the next microtask, for
 * the components that build an `Image` in JS and wait on `onload`.
 */
export const installMediaElementMock = (
  options: InstallMediaElementMockOptions = {}
) => {
  const naturalWidth = options.naturalWidth ?? DEFAULT_MEDIA_WIDTH;
  const naturalHeight = options.naturalHeight ?? DEFAULT_MEDIA_HEIGHT;
  const eventName = options.fail ? "error" : "load";

  stubbedMediaProperties = [];

  const srcValues = new WeakMap<object, string>();
  const originalSrc = Object.getOwnPropertyDescriptor(
    HTMLImageElement.prototype,
    "src"
  );

  stubProperty(HTMLImageElement.prototype, "src", {
    get(this: HTMLImageElement) {
      return srcValues.get(this) ?? originalSrc?.get?.call(this) ?? "";
    },
    set(this: HTMLImageElement, value: string) {
      srcValues.set(this, value);
      originalSrc?.set?.call(this, value);
      if (!value) {
        return;
      }
      queueMicrotask(() => {
        if (srcValues.get(this) !== value) {
          return;
        }
        this.dispatchEvent(new Event(eventName));
      });
    },
  });
  stubProperty(HTMLImageElement.prototype, "complete", {
    get: () => !options.fail,
  });
  stubProperty(HTMLImageElement.prototype, "naturalWidth", {
    get: () => naturalWidth,
  });
  stubProperty(HTMLImageElement.prototype, "naturalHeight", {
    get: () => naturalHeight,
  });
  stubProperty(HTMLImageElement.prototype, "decoding", {
    value: "auto",
    writable: true,
  });

  stubProperty(HTMLVideoElement.prototype, "videoWidth", {
    get: () => naturalWidth,
  });
  stubProperty(HTMLVideoElement.prototype, "videoHeight", {
    get: () => naturalHeight,
  });
  stubProperty(HTMLMediaElement.prototype, "readyState", {
    get: () => HAVE_CURRENT_DATA,
  });
  stubProperty(HTMLMediaElement.prototype, "play", {
    value: vi.fn(() => Promise.resolve()),
    writable: true,
  });
  stubProperty(HTMLMediaElement.prototype, "pause", {
    value: vi.fn(),
    writable: true,
  });
};

/** Restores everything patched by `installMediaElementMock`. */
export const uninstallMediaElementMock = () => {
  for (const { descriptor, name, target } of stubbedMediaProperties.reverse()) {
    if (descriptor) {
      Object.defineProperty(target, name, descriptor);
    } else {
      Reflect.deleteProperty(target, name);
    }
  }
  stubbedMediaProperties = [];
};

/* -------------------------------------------------------------------------- */
/* IntersectionObserver stub                                                  */
/* -------------------------------------------------------------------------- */

export interface IntersectionObserverMock {
  /** Reports `isIntersecting` for every observed target of every instance. */
  trigger: (isIntersecting: boolean) => void;
}

interface ObserverRecord {
  callback: IntersectionObserverCallback;
  observer: IntersectionObserver;
  targets: Element[];
}

let observerRecords: ObserverRecord[] = [];
let originalIntersectionObserver: typeof IntersectionObserver | null = null;

/**
 * An `IntersectionObserver` that actually reports. The stub in
 * `test-utils/setup.ts` never invokes its callback, so components that only
 * start their loop once visible never start it in a test.
 */
export const installIntersectionObserverMock = ({
  intersecting = true,
}: {
  intersecting?: boolean;
} = {}): IntersectionObserverMock => {
  observerRecords = [];
  originalIntersectionObserver = globalThis.IntersectionObserver;

  const report = (
    record: ObserverRecord,
    targets: Element[],
    isIntersecting: boolean
  ) => {
    if (targets.length === 0) {
      return;
    }
    record.callback(
      targets.map(
        (target) =>
          ({
            boundingClientRect: target.getBoundingClientRect(),
            intersectionRatio: isIntersecting ? 1 : 0,
            intersectionRect: target.getBoundingClientRect(),
            isIntersecting,
            rootBounds: null,
            target,
            time: currentTime,
          }) as IntersectionObserverEntry
      ),
      record.observer
    );
  };

  class IntersectionObserverStub implements IntersectionObserver {
    readonly root = null;
    readonly rootMargin = "0px";
    readonly thresholds: readonly number[] = [0];
    readonly #record: ObserverRecord;

    constructor(callback: IntersectionObserverCallback) {
      this.#record = { callback, observer: this, targets: [] };
      observerRecords.push(this.#record);
    }

    observe(target: Element) {
      this.#record.targets.push(target);
      report(this.#record, [target], intersecting);
    }

    unobserve(target: Element) {
      this.#record.targets = this.#record.targets.filter(
        (entry) => entry !== target
      );
    }

    disconnect() {
      this.#record.targets = [];
      observerRecords = observerRecords.filter(
        (entry) => entry !== this.#record
      );
    }

    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }

  globalThis.IntersectionObserver =
    IntersectionObserverStub as unknown as typeof IntersectionObserver;

  return {
    trigger: (isIntersecting: boolean) => {
      act(() => {
        for (const record of [...observerRecords]) {
          report(record, [...record.targets], isIntersecting);
        }
      });
    },
  };
};

/** Restores the `IntersectionObserver` patched by `installIntersectionObserverMock`. */
export const uninstallIntersectionObserverMock = () => {
  if (originalIntersectionObserver) {
    globalThis.IntersectionObserver = originalIntersectionObserver;
    originalIntersectionObserver = null;
  }
  observerRecords = [];
};
