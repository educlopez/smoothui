import { describe, expect, it, vi } from "vitest";
import { render } from "../../../test-utils/render";
import SwapPanel, { type SwapToken } from "../index";

const from: SwapToken = { name: "Ether", symbol: "ETH" };
const to: SwapToken = { name: "USD Coin", symbol: "USDC" };

describe("SwapPanel", () => {
  it("renders without throwing in the idle status", () => {
    const { container } = render(
      <SwapPanel
        amount="1"
        from={from}
        onAmountChange={vi.fn()}
        onFlip={vi.fn()}
        onSubmit={vi.fn()}
        status="idle"
        to={to}
      />
    );
    expect(container).toBeInTheDocument();
  });

  it("renders in the error status", () => {
    const { container } = render(
      <SwapPanel
        amount="1"
        error="Swap failed"
        from={from}
        onAmountChange={vi.fn()}
        onFlip={vi.fn()}
        onSubmit={vi.fn()}
        status="error"
        to={to}
      />
    );
    expect(container).toBeInTheDocument();
  });

  it("renders in the submitting status", () => {
    const { container } = render(
      <SwapPanel
        amount="1"
        from={from}
        onAmountChange={vi.fn()}
        onFlip={vi.fn()}
        onSubmit={vi.fn()}
        status="submitting"
        to={to}
      />
    );
    expect(container).toBeInTheDocument();
  });
});
