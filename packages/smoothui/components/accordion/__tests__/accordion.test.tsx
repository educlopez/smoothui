import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render, screen } from "../../../test-utils/render";
import {
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionRoot,
  AccordionTrigger,
} from "../index";

describe("Accordion", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <AccordionRoot defaultValue={["item-1"]}>
        <AccordionItem value="item-1">
          <AccordionHeader>
            <AccordionTrigger>What is SmoothUI?</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel>
            <div className="px-4 pb-3">A component library.</div>
          </AccordionPanel>
        </AccordionItem>
      </AccordionRoot>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders without throwing", () => {
    render(
      <AccordionRoot>
        <AccordionItem value="a">
          <AccordionHeader>
            <AccordionTrigger>Title</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel>
            <div>Body</div>
          </AccordionPanel>
        </AccordionItem>
      </AccordionRoot>
    );
    expect(screen.getByRole("button", { name: /Title/i })).toBeInTheDocument();
  });
});
