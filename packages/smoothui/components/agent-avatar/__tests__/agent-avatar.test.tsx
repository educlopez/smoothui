import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "../../../test-utils/render";
import AgentAvatar from "../index";

type MockContext2D = {
  arc: ReturnType<typeof vi.fn>;
  beginPath: ReturnType<typeof vi.fn>;
  clearRect: ReturnType<typeof vi.fn>;
  clip: ReturnType<typeof vi.fn>;
  fillRect: ReturnType<typeof vi.fn>;
  restore: ReturnType<typeof vi.fn>;
  save: ReturnType<typeof vi.fn>;
  scale: ReturnType<typeof vi.fn>;
  stroke: ReturnType<typeof vi.fn>;
  translate: ReturnType<typeof vi.fn>;
  fillStyle: string;
  shadowBlur: number;
  shadowColor: string;
  strokeStyle: string;
  lineWidth: number;
  globalCompositeOperation: string;
};

const createMockContext = (): MockContext2D => ({
  arc: vi.fn(),
  beginPath: vi.fn(),
  clearRect: vi.fn(),
  clip: vi.fn(),
  fillRect: vi.fn(),
  restore: vi.fn(),
  save: vi.fn(),
  scale: vi.fn(),
  stroke: vi.fn(),
  translate: vi.fn(),
  fillStyle: "",
  shadowBlur: 0,
  shadowColor: "",
  strokeStyle: "",
  lineWidth: 0,
  globalCompositeOperation: "",
});

const mockMatchMedia = (matches: boolean) => {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
};

describe("AgentAvatar", () => {
  let mockCtx: MockContext2D;
  let rafCallbacks: FrameRequestCallback[];

  beforeEach(() => {
    mockCtx = createMockContext();
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
      mockCtx as unknown as CanvasRenderingContext2D
    );
    rafCallbacks = [];
    vi.stubGlobal(
      "requestAnimationFrame",
      vi.fn((cb: FrameRequestCallback) => {
        rafCallbacks.push(cb);
        return rafCallbacks.length;
      })
    );
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    mockMatchMedia(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("renders a canvas with the seed as an accessible label", () => {
    const { container } = render(<AgentAvatar seed="test-seed" />);
    const canvas = container.querySelector("canvas");

    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveAttribute("aria-label", "Avatar for test-seed");
    expect(canvas).toHaveAttribute("role", "img");
  });

  it("schedules a frame and draws the pixel grid once the frame runs", () => {
    render(<AgentAvatar animated seed="alpha" />);

    expect(requestAnimationFrame).toHaveBeenCalled();
    expect(rafCallbacks).toHaveLength(1);

    rafCallbacks[0](16);

    expect(mockCtx.clearRect).toHaveBeenCalled();
    expect(mockCtx.fillRect).toHaveBeenCalled();
    // shouldAnimate keeps re-scheduling the next frame
    expect(rafCallbacks).toHaveLength(2);
  });

  it("draws once without scheduling a frame when animated is false", () => {
    render(<AgentAvatar animated={false} seed="beta" />);

    expect(mockCtx.fillRect).toHaveBeenCalled();
    expect(requestAnimationFrame).not.toHaveBeenCalled();
  });

  it("skips the animation loop when reduced motion is preferred", () => {
    mockMatchMedia(true);
    render(<AgentAvatar animated seed="gamma" />);

    expect(mockCtx.fillRect).toHaveBeenCalled();
    expect(requestAnimationFrame).not.toHaveBeenCalled();
  });

  it("applies the size prop to the canvas style dimensions", () => {
    const { container } = render(<AgentAvatar seed="sized" size={128} />);
    const canvas = container.querySelector("canvas") as HTMLCanvasElement;

    expect(canvas.style.width).toBe("128px");
    expect(canvas.style.height).toBe("128px");
  });

  it("cancels the animation frame and removes listeners on unmount", () => {
    const { unmount } = render(<AgentAvatar animated seed="delta" />);

    unmount();

    expect(cancelAnimationFrame).toHaveBeenCalled();
  });

  it("does not throw when the canvas context is unavailable", () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);

    expect(() => render(<AgentAvatar seed="no-ctx" />)).not.toThrow();
  });
});
