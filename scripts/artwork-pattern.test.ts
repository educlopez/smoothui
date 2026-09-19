import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { ArtworkPattern } from "../apps/docs/components/landing/artwork-pattern";

it("has no default decoration and supports explicitly opting out", () => {
  expect(renderToStaticMarkup(createElement(ArtworkPattern))).toBe("");
  expect(
    renderToStaticMarkup(createElement(ArtworkPattern, { variant: "none" }))
  ).toBe("");
});

it("renders only decorative noninteractive squares when opted in", () => {
  const markup = renderToStaticMarkup(
    createElement(ArtworkPattern, { variant: "squares" })
  );
  expect(markup).toContain('data-artwork-pattern="squares"');
  expect(markup).toContain('aria-hidden="true"');
  expect(markup).toContain('focusable="false"');
  expect(markup).toContain("pointer-events-none");
  expect(markup).toContain(
    "linear-gradient(to bottom, transparent 10%, #000 52%, #0009 100%)"
  );
  expect(markup).toContain('height="1.5"');
  expect(markup).toContain("opacity-[0.22]");
  expect(markup).not.toContain("animate");
});

it("renders scoped continuous contours without changing squares", () => {
  const markup = renderToStaticMarkup(
    createElement(
      "div",
      null,
      createElement(ArtworkPattern, { variant: "contours" }),
      createElement(ArtworkPattern, { variant: "contours" })
    )
  );
  expect(markup).toContain('data-artwork-pattern="contours"');
  expect(markup).toContain('stroke-width="0.45"');
  expect(markup).toContain('vector-effect="non-scaling-stroke"');
  const ids = Array.from(markup.matchAll(/id="([^"]+)"/g), (match) => match[1]);
  expect(ids).toHaveLength(2);
  expect(new Set(ids).size).toBe(2);
  expect(markup).not.toContain("<rect");
});
