import { describe, expect, it } from "vitest";
import { render, screen } from "../../../test-utils/render";
import {
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionRoot,
  AccordionTrigger,
} from "../accordion.radix";

describe("Accordion (Radix) single mode", () => {
  it("opens the item when defaultValue is a Base-style array", () => {
    render(
      <AccordionRoot defaultValue={["one"]}>
        <AccordionItem value="one">
          <AccordionHeader>
            <AccordionTrigger>One</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel>
            <p>Body</p>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem value="two">
          <AccordionHeader>
            <AccordionTrigger>Two</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel>
            <p>Other</p>
          </AccordionPanel>
        </AccordionItem>
      </AccordionRoot>
    );

    expect(screen.getByRole("button", { name: "One" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
    expect(screen.getByRole("button", { name: "Two" })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
  });
});
