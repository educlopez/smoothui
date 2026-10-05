import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { render, screen } from "../../../test-utils/render";
import {
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionRoot,
  AccordionTrigger,
} from "../index";

describe("Accordion interactions", () => {
  it("expands panel on trigger click", async () => {
    const user = userEvent.setup();

    render(
      <AccordionRoot>
        <AccordionItem value="faq">
          <AccordionHeader>
            <AccordionTrigger>FAQ</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel>
            <div className="px-4 pb-3">Answer text</div>
          </AccordionPanel>
        </AccordionItem>
      </AccordionRoot>
    );

    const trigger = screen.getByRole("button", { name: /FAQ/i });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Answer text")).toBeVisible();
  });
});
