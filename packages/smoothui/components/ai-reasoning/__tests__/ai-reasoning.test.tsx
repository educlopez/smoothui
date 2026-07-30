import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import AIReasoning from "../index";

describe("AIReasoning", () => {
  it("starts open while streaming", () => {
    render(<AIReasoning isStreaming>trace</AIReasoning>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
  });

  it("starts closed when there is nothing happening", () => {
    render(<AIReasoning>trace</AIReasoning>);
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-expanded",
      "false"
    );
  });

  it("labels itself Thinking while streaming", () => {
    render(<AIReasoning isStreaming>trace</AIReasoning>);
    expect(screen.getByRole("button")).toHaveTextContent("Thinking");
  });

  it("reports a duration it was given", () => {
    render(<AIReasoning duration={4.2}>trace</AIReasoning>);
    expect(screen.getByRole("button")).toHaveTextContent("Thought for 4.2s");
  });

  it("toggles on click", () => {
    render(<AIReasoning defaultOpen={false}>trace</AIReasoning>);
    const trigger = screen.getByRole("button");
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });
});
