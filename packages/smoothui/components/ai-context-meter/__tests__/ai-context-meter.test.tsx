import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import AIContextMeter from "../index";

describe("AIContextMeter", () => {
  it("formats tokens compactly", () => {
    render(<AIContextMeter limit={200_000} used={48_000} />);
    expect(screen.getByRole("button")).toHaveTextContent("48k/200k");
  });

  it("puts the whole state in the label, since colour cannot report a quota", () => {
    render(<AIContextMeter limit={200_000} used={100_000} />);
    expect(
      screen.getByRole("button", {
        name: "Context window 50% used, 100k of 200k tokens",
      })
    ).toBeInTheDocument();
  });

  it("is disabled without a breakdown rather than being a dead control", () => {
    render(<AIContextMeter limit={100} used={10} />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("opens the breakdown on hover", () => {
    render(
      <AIContextMeter
        breakdown={[{ label: "System prompt", tokens: 1800 }]}
        limit={200_000}
        used={48_000}
      />
    );
    fireEvent.mouseEnter(screen.getByRole("button"));
    expect(screen.getByText("System prompt")).toBeInTheDocument();
    expect(screen.getByText("1.8k")).toBeInTheDocument();
  });

  it("clamps beyond the limit instead of overflowing the ring", () => {
    render(<AIContextMeter limit={100} used={250} />);
    expect(screen.getByRole("button").getAttribute("aria-label")).toContain(
      "100%"
    );
  });

  it("survives a zero limit", () => {
    render(<AIContextMeter limit={0} used={0} />);
    expect(screen.getByRole("button").getAttribute("aria-label")).toContain(
      "0%"
    );
  });
});
