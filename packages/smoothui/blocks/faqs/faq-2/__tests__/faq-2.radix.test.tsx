import { describe, expect, it, vi } from "vitest";
import { render, screen } from "../../../../test-utils/render";

vi.mock(
  "@repo/smoothui/components/accordion",
  async () => import("../../../../components/accordion/accordion.radix")
);

import Block from "../index";

describe("Faq2 (Radix accordion twin)", () => {
  it("renders the first question open", () => {
    render(<Block />);

    const firstQuestion = screen.getByRole("button", {
      name: "What is Smoothui?",
    });
    expect(firstQuestion).toHaveAttribute("aria-expanded", "true");
  });
});
