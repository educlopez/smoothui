import { afterAll, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import Squircle from "../index";

// jsdom lays out every element at 0x0, which would keep `size` at its zero
// default and skip the clip-path calculation entirely. A real box size lets
// the squircle path actually get computed.
const rectSpy = vi
  .spyOn(Element.prototype, "getBoundingClientRect")
  .mockReturnValue({
    bottom: 100,
    height: 100,
    left: 0,
    right: 200,
    toJSON: () => undefined,
    top: 0,
    width: 200,
    x: 0,
    y: 0,
  } as DOMRect);

afterAll(() => {
  rectSpy.mockRestore();
});

describe("Squircle", () => {
  it("renders without throwing", () => {
    const { container } = render(<Squircle>content</Squircle>);
    expect(container).toBeInTheDocument();
  });

  it("renders the bordered high-smoothing variant without throwing", () => {
    const { container } = render(
      <Squircle border radius={40} smoothing={1}>
        content
      </Squircle>
    );
    expect(container).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Squircle>content</Squircle>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
