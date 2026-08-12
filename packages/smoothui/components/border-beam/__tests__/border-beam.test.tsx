import { afterAll, describe, expect, it, vi } from "vitest";
import { render } from "../../../test-utils/render";
import BorderBeam from "../index";

// jsdom lays out every element at 0x0 and does not implement SVG geometry
// measurement, so the comet's travelling path is stubbed here rather than in
// the component: a real box size drives `hasBox`, and a real perimeter drives
// `isTravelling`, exercising the animated beam branch instead of only the
// static, zero-size fallback.
const rectSpy = vi
  .spyOn(Element.prototype, "getBoundingClientRect")
  .mockReturnValue({
    bottom: 40,
    height: 40,
    left: 0,
    right: 200,
    toJSON: () => undefined,
    top: 0,
    width: 200,
    x: 0,
    y: 0,
  } as DOMRect);

// jsdom does not implement `SVGPathElement.prototype.getTotalLength` at
// all (not even as a stub), so there is nothing for `vi.spyOn` to wrap.
// The prototype is fetched off a throwaway element and patched directly.
const svgPathPrototype = Object.getPrototypeOf(
  document.createElementNS("http://www.w3.org/2000/svg", "path")
);
const originalGetTotalLength = svgPathPrototype.getTotalLength;
svgPathPrototype.getTotalLength = () => 480;

afterAll(() => {
  rectSpy.mockRestore();
  if (originalGetTotalLength) {
    svgPathPrototype.getTotalLength = originalGetTotalLength;
  } else {
    // jsdom does not implement this method at all, so the restore has to remove
    // the property rather than set it to undefined — an own property holding
    // undefined is not the same absence the component feature-detects against.
    // `Reflect.deleteProperty` does the same job without the `delete` operator
    // that `lint/performance/noDelete` rejects.
    Reflect.deleteProperty(svgPathPrototype, "getTotalLength");
  }
});

describe("BorderBeam", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <BorderBeam>
        <div>content</div>
      </BorderBeam>
    );
    expect(container).toBeInTheDocument();
  });

  it("renders the squircle radius variant without throwing", () => {
    const { container } = render(
      <BorderBeam radius="squircle">
        <div>content</div>
      </BorderBeam>
    );
    expect(container).toBeInTheDocument();
  });
});
