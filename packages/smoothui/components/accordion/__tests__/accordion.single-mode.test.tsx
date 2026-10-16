import { describe, expect, it } from "vitest";
import { render, screen } from "../../../test-utils/render";
import {
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionRoot,
  type AccordionRootProps,
  AccordionTrigger,
} from "../accordion.radix";

const acceptRootProps = (_props: AccordionRootProps) => undefined;

// Type contract: default / single mode is a string. A Base-style array is
// the faq-2 class (#160) and must not typecheck. Multiple still takes string[].
acceptRootProps({ defaultValue: "one" });
acceptRootProps({ type: "single", value: "one" });
acceptRootProps({ defaultValue: ["one"], multiple: true });
acceptRootProps({ defaultValue: ["one"], type: "multiple" });
// @ts-expect-error Base-style array is illegal in Radix single mode
acceptRootProps({ defaultValue: ["one"] });
// @ts-expect-error type=single cannot take a string[]
acceptRootProps({ defaultValue: ["one"], type: "single" });

describe("Accordion (Radix) single mode", () => {
  it("opens the item when defaultValue is a Base-style array", () => {
    render(
      // Runtime translator still unwraps arrays from shipped blocks.
      // @ts-expect-error Base-style array is illegal in Radix single mode
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

  it("opens the item when defaultValue is a string", () => {
    render(
      <AccordionRoot defaultValue="one">
        <AccordionItem value="one">
          <AccordionHeader>
            <AccordionTrigger>One</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel>
            <p>Body</p>
          </AccordionPanel>
        </AccordionItem>
      </AccordionRoot>
    );

    expect(screen.getByRole("button", { name: "One" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
  });
});
