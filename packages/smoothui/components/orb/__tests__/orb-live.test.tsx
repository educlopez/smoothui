import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render } from "../../../test-utils/render";
import Orb from "../index";

function mockRenderer() {
  const uniform1f = vi.fn();
  const drawArrays = vi.fn();
  const createProgram = vi.fn(() => ({}));
  const gl = new Proxy(
    { createProgram, drawArrays, uniform1f },
    {
      get(target, property) {
        if (property in target) {
          return target[property as keyof typeof target];
        }
        if (property === "getUniformLocation") {
          return (_program: unknown, name: string) => name;
        }
        if (
          property === "getShaderParameter" ||
          property === "getProgramParameter"
        ) {
          return () => true;
        }
        if (property === "createShader") {
          return () => ({});
        }
        return () => undefined;
      },
    }
  );
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(((
    kind: string
  ) => (kind === "webgl2" ? gl : null)) as HTMLCanvasElement["getContext"]);
  const request = vi.spyOn(window, "requestAnimationFrame").mockReturnValue(42);
  const cancel = vi
    .spyOn(window, "cancelAnimationFrame")
    .mockImplementation(() => undefined);
  return { cancel, createProgram, drawArrays, request, uniform1f };
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("Orb live configuration", () => {
  it("updates uniforms and redraws while paused without rebuilding the program", () => {
    const gl = mockRenderer();
    const { rerender } = render(<Orb flow={1} paused />);
    const draws = gl.drawArrays.mock.calls.length;
    rerender(<Orb flow={2} paused turbulence={0.8} />);
    expect(gl.uniform1f).toHaveBeenCalledWith("uFlow", 2);
    expect(gl.uniform1f).toHaveBeenCalledWith("uTurb", 0.8);
    expect(gl.drawArrays.mock.calls.length).toBeGreaterThan(draws);
    expect(gl.createProgram).toHaveBeenCalledTimes(1);
    expect(gl.request).not.toHaveBeenCalled();
  });

  it("redraws changed props without starting frames under reduced motion", () => {
    const gl = mockRenderer();
    vi.spyOn(window, "matchMedia").mockReturnValue({
      addEventListener: vi.fn(),
      matches: true,
      removeEventListener: vi.fn(),
    } as unknown as MediaQueryList);
    const { rerender } = render(<Orb flow={1} />);
    const draws = gl.drawArrays.mock.calls.length;
    rerender(<Orb flow={3} />);
    expect(gl.uniform1f).toHaveBeenCalledWith("uFlow", 3);
    expect(gl.drawArrays.mock.calls.length).toBeGreaterThan(draws);
    expect(gl.request).not.toHaveBeenCalled();
    expect(gl.createProgram).toHaveBeenCalledTimes(1);
  });

  it("stops and resumes on paused prop changes and cancels on unmount", () => {
    const gl = mockRenderer();
    const { rerender, unmount } = render(<Orb />);
    expect(gl.request).toHaveBeenCalledTimes(1);
    rerender(<Orb paused />);
    expect(gl.cancel).toHaveBeenCalledWith(42);
    rerender(<Orb paused={false} />);
    expect(gl.request).toHaveBeenCalledTimes(2);
    unmount();
    expect(gl.cancel).toHaveBeenCalledTimes(2);
    expect(gl.createProgram).toHaveBeenCalledTimes(1);
  });
});
