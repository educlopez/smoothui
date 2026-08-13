import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import AICitation from "../index";

const PROPS = {
  description: "Loss scales as a power law.",
  label: 1,
  title: "Scaling Laws",
  url: "https://arxiv.org/abs/2001.08361",
};

describe("AICitation", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(<AICitation {...PROPS} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders the pill as a real link", () => {
    render(<AICitation {...PROPS} />);
    const link = screen.getByRole("link", { name: "1" });
    expect(link).toHaveAttribute("href", PROPS.url);
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("keeps the card closed until asked", () => {
    render(<AICitation {...PROPS} />);
    expect(screen.queryByText("Scaling Laws")).toBeNull();
  });

  it("opens the card on hover", () => {
    const { container } = render(<AICitation {...PROPS} />);
    fireEvent.mouseEnter(container.firstChild as HTMLElement);
    expect(screen.getByText("Scaling Laws")).toBeInTheDocument();
    expect(screen.getByText(PROPS.description)).toBeInTheDocument();
  });

  it("opens on focus too, since hover is unreachable by keyboard", () => {
    const { container } = render(<AICitation {...PROPS} />);
    fireEvent.focus(container.firstChild as HTMLElement);
    expect(screen.getByText("Scaling Laws")).toBeInTheDocument();
  });

  it("closes on Escape", async () => {
    const { container } = render(<AICitation {...PROPS} />);
    fireEvent.mouseEnter(container.firstChild as HTMLElement);
    fireEvent.keyDown(window, { key: "Escape" });

    // The card exit-animates, so it lingers for a frame or two.
    await waitFor(() => expect(screen.queryByText("Scaling Laws")).toBeNull());
  });

  it("shows the host, not the whole url", () => {
    const { container } = render(<AICitation {...PROPS} />);
    fireEvent.mouseEnter(container.firstChild as HTMLElement);
    expect(screen.getByText("arxiv.org")).toBeInTheDocument();
  });
});
