import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { act, fireEvent, render, screen } from "../../../test-utils/render";
import ButtonCopy from "../index";

describe("ButtonCopy", () => {
  it("allows retry after rejection without reporting success", async () => {
    const onCopy = vi
      .fn()
      .mockRejectedValueOnce(new Error("Denied"))
      .mockResolvedValue(undefined);
    render(<ButtonCopy onCopy={onCopy} loadingDuration={0} />);
    await act(async () =>
      fireEvent.click(screen.getByRole("button", { name: "Copy" }))
    );
    const retry = screen.getByRole("button", {
      name: "Copy failed. Try again",
    });
    expect(retry).toBeEnabled();
    expect(
      screen.queryByRole("button", { name: "Copied" })
    ).not.toBeInTheDocument();
    await act(async () => fireEvent.click(retry));
    expect(
      await screen.findByRole("button", { name: "Copied" })
    ).toBeInTheDocument();
    expect(onCopy).toHaveBeenCalledTimes(2);
  });

  it("does not schedule success timers after an in-flight copy unmounts", async () => {
    let resolveCopy: (() => void) | undefined;
    const pending = new Promise<void>((resolve) => {
      resolveCopy = resolve;
    });
    const { unmount } = render(<ButtonCopy onCopy={() => pending} />);
    await act(async () =>
      fireEvent.click(screen.getByRole("button", { name: "Copy" }))
    );
    unmount();
    const timerSpy = vi.spyOn(globalThis, "setTimeout");
    await act(async () => {
      resolveCopy?.();
      await pending;
    });
    expect(timerSpy).not.toHaveBeenCalled();
    timerSpy.mockRestore();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<ButtonCopy />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders without throwing", () => {
    const { container } = render(<ButtonCopy />);
    expect(container).toBeInTheDocument();
  });
});
