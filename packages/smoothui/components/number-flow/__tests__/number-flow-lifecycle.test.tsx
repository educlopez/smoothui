import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render } from "../../../test-utils/render";
import NumberFlow from "../index";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

it("restarts changed digit animations and cancels them on unmount", () => {
  const cancel = vi.fn();
  const animate = vi.fn(() => ({ cancel }));
  vi.stubGlobal("Animation", class {});
  Object.defineProperty(Element.prototype, "animate", {
    configurable: true,
    value: animate,
  });
  const { getByRole, unmount } = render(<NumberFlow />);
  expect(animate).not.toHaveBeenCalled();
  fireEvent.click(getByRole("button", { name: "Increase number" }));
  expect(animate).toHaveBeenCalledTimes(2);
  fireEvent.click(getByRole("button", { name: "Increase number" }));
  expect(cancel).toHaveBeenCalledTimes(2);
  expect(animate).toHaveBeenCalledTimes(4);
  unmount();
  expect(cancel).toHaveBeenCalledTimes(4);
  Reflect.deleteProperty(Element.prototype, "animate");
  vi.unstubAllGlobals();
});

it("carries across digits and respects both limits", () => {
  const { getByRole, rerender } = render(
    <NumberFlow max={100} min={99} value={99} />
  );
  expect(getByRole("button", { name: "Decrease number" })).toBeDisabled();
  rerender(<NumberFlow max={100} min={99} value={100} />);
  expect(getByRole("status", { name: "Current value" })).toHaveTextContent(
    "100"
  );
  expect(getByRole("button", { name: "Increase number" })).toBeDisabled();
  rerender(<NumberFlow value={0} />);
  expect(getByRole("button", { name: "Decrease number" })).toBeDisabled();
  rerender(<NumberFlow value={999} />);
  expect(getByRole("button", { name: "Increase number" })).toBeDisabled();
});

it("keeps the same controls and static digits with reduced motion", () => {
  vi.spyOn(window, "matchMedia").mockReturnValue({
    addEventListener: vi.fn(),
    matches: true,
    removeEventListener: vi.fn(),
  } as unknown as MediaQueryList);
  const animate = vi.fn();
  Object.defineProperty(Element.prototype, "animate", {
    configurable: true,
    value: animate,
  });
  const { getByRole } = render(<NumberFlow />);
  fireEvent.click(getByRole("button", { name: "Increase number" }));
  expect(getByRole("status", { name: "Current value" })).toHaveTextContent("1");
  expect(animate).not.toHaveBeenCalled();
  Reflect.deleteProperty(Element.prototype, "animate");
});
