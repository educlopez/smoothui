import { describe, expect, it } from "vitest";
import { type ItemRect, pickNearest } from "../use-fluid-hover";

const containerRect = { height: 200, left: 0, top: 0, width: 100 };
const scroll = { x: 0, y: 0 };
const border = { x: 0, y: 0 };
const layoutSize = { height: 200, width: 100 };

const rects: ItemRect[] = [
  { height: 40, left: 0, top: 0, width: 100 },
  { height: 40, left: 0, top: 48, width: 100 },
  { height: 40, left: 0, top: 96, width: 100 },
];

describe("pickNearest", () => {
  it("picks the containing item on axis y", () => {
    expect(
      pickNearest({
        axis: "y",
        border,
        containerRect,
        layoutSize,
        point: { x: 50, y: 60 },
        rects,
        scroll,
      })
    ).toBe(1);
  });

  it("picks the nearest center when the pointer is in a gap", () => {
    expect(
      pickNearest({
        axis: "y",
        border,
        containerRect,
        layoutSize,
        point: { x: 50, y: 44 },
        rects,
        scroll,
      })
    ).toBe(0);
  });

  it("picks by Euclidean distance on axis xy", () => {
    const grid: ItemRect[] = [
      { height: 40, left: 0, top: 0, width: 40 },
      { height: 40, left: 48, top: 0, width: 40 },
      { height: 40, left: 0, top: 48, width: 40 },
      { height: 40, left: 48, top: 48, width: 40 },
    ];
    expect(
      pickNearest({
        axis: "xy",
        border,
        containerRect: { height: 100, left: 0, top: 0, width: 100 },
        layoutSize: { height: 100, width: 100 },
        point: { x: 70, y: 70 },
        rects: grid,
        scroll,
      })
    ).toBe(3);
  });

  it("skips disabled items", () => {
    expect(
      pickNearest({
        axis: "y",
        border,
        containerRect,
        isDisabled: (i) => i === 1,
        layoutSize,
        point: { x: 50, y: 60 },
        rects,
        scroll,
      })
    ).toBe(0);
  });
});
