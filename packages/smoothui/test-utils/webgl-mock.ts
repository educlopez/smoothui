import { act } from "@testing-library/react";
import { type Mock, vi } from "vitest";

/**
 * Shared jsdom stubs for the WebGL shader-transition components.
 *
 * jsdom has no WebGL implementation, so `canvas.getContext("webgl")` always
 * returns `null` there. These helpers patch `HTMLCanvasElement.prototype.getContext`
 * to return a fully-stubbed `WebGLRenderingContext` (every method is a `vi.fn`),
 * and replace `requestAnimationFrame` / `cancelAnimationFrame` / `performance.now`
 * with a manually-steppable clock so render loops can be driven deterministically
 * in tests via `flushFrame` / `flushFrames` / `runFramesFor`.
 */

const GL_CONSTANTS = {
  ARRAY_BUFFER: 34_962,
  BLEND: 3042,
  COLOR_BUFFER_BIT: 16_384,
  COMPILE_STATUS: 35_713,
  FLOAT: 5126,
  FRAGMENT_SHADER: 35_632,
  LINK_STATUS: 35_714,
  ONE: 1,
  ONE_MINUS_SRC_ALPHA: 771,
  STATIC_DRAW: 35_044,
  TRIANGLES: 4,
  TRIANGLE_STRIP: 5,
  VERTEX_SHADER: 35_633,
} as const;

const createStubGl = (): Record<string, Mock | number> =>
  ({
    ...GL_CONSTANTS,
    attachShader: vi.fn(),
    bindBuffer: vi.fn(),
    blendFunc: vi.fn(),
    bufferData: vi.fn(),
    clear: vi.fn(),
    clearColor: vi.fn(),
    compileShader: vi.fn(),
    createBuffer: vi.fn(() => ({})),
    createProgram: vi.fn(() => ({})),
    createShader: vi.fn(() => ({})),
    deleteBuffer: vi.fn(),
    deleteProgram: vi.fn(),
    deleteShader: vi.fn(),
    drawArrays: vi.fn(),
    enable: vi.fn(),
    enableVertexAttribArray: vi.fn(),
    getAttribLocation: vi.fn(() => 0),
    getProgramParameter: vi.fn(() => true),
    getShaderParameter: vi.fn(() => true),
    getUniformLocation: vi.fn(() => ({})),
    linkProgram: vi.fn(),
    shaderSource: vi.fn(),
    uniform1f: vi.fn(),
    uniform2f: vi.fn(),
    uniform3f: vi.fn(),
    useProgram: vi.fn(),
    vertexAttribPointer: vi.fn(),
    viewport: vi.fn(),
  }) satisfies Record<string, unknown>;

export type WebglStub = ReturnType<typeof createStubGl>;

export interface InstallWebglMockOptions {
  /** When false, `getContext("webgl")` resolves to null, simulating no WebGL support. */
  supported?: boolean;
}

let originalGetContext: typeof HTMLCanvasElement.prototype.getContext | null =
  null;
let originalRaf: typeof requestAnimationFrame | null = null;
let originalCaf: typeof cancelAnimationFrame | null = null;
let nowSpy: ReturnType<typeof vi.spyOn> | null = null;

let rafQueue = new Map<number, FrameRequestCallback>();
let nextRafId = 0;
let currentTime = 0;

const defaultMatchMedia = (query: string) => ({
  addEventListener: vi.fn(),
  addListener: vi.fn(),
  dispatchEvent: vi.fn(() => false),
  matches: false,
  media: query,
  onchange: null,
  removeEventListener: vi.fn(),
  removeListener: vi.fn(),
});

/** Installs the WebGL + rAF + matchMedia stubs. Call from `beforeEach`. */
export const installWebglMock = (options: InstallWebglMockOptions = {}) => {
  const supported = options.supported ?? true;

  originalGetContext = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = vi.fn((contextId: string) => {
    if (!supported) {
      return null;
    }
    if (contextId === "webgl" || contextId === "experimental-webgl") {
      return createStubGl();
    }
    return null;
  }) as unknown as typeof HTMLCanvasElement.prototype.getContext;

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

  window.matchMedia = vi.fn(
    defaultMatchMedia
  ) as unknown as typeof window.matchMedia;
};

/** Restores everything patched by `installWebglMock`. Call from `afterEach`. */
export const uninstallWebglMock = () => {
  if (originalGetContext) {
    HTMLCanvasElement.prototype.getContext = originalGetContext;
    originalGetContext = null;
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
};

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
 * flushed to the DOM before this call returns.
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
  {
    stepMs = 16,
    maxFrames = 2000,
  }: { stepMs?: number; maxFrames?: number } = {}
) => {
  act(() => {
    let framesRun = 0;
    while (currentTime < durationMs && framesRun < maxFrames) {
      runFrame(stepMs);
      framesRun += 1;
    }
  });
};
