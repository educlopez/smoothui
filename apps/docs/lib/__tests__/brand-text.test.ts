import { describe, expect, it } from "vitest";
import { BRAND_ICONS } from "../brand-icons";
import { splitBrandText } from "../brand-text";

const names = (text: string) =>
  splitBrandText(text).map((part) =>
    typeof part === "string" ? part : `<${part.brand}:${part.name}>`
  );

describe("splitBrandText", () => {
  it("marks the projects SmoothUI is built on", () => {
    expect(names("Built on Base UI and Radix for Next.js.")).toEqual([
      "Built on ",
      "<base-ui:Base UI>",
      " and ",
      "<radix:Radix>",
      " for ",
      "<nextjs:Next.js>",
      ".",
    ]);
  });

  it("prefers the longest written form", () => {
    expect(names("Radix UI and Radix, shadcn/ui and shadcn")).toEqual([
      "<radix:Radix UI>",
      " and ",
      "<radix:Radix>",
      ", ",
      "<shadcn:shadcn/ui>",
      " and ",
      "<shadcn:shadcn>",
    ]);
    expect(names("NextJS")).toEqual(["<nextjs:NextJS>"]);
  });

  it("leaves other projects unmarked", () => {
    expect(
      names("React, Tailwind CSS, TypeScript, Motion, GSAP and pnpm")
    ).toEqual(["React, Tailwind CSS, TypeScript, Motion, GSAP and pnpm"]);
  });

  it("leaves package names, paths and identifiers alone", () => {
    expect(names("@radix-ui/react-tabs")).toEqual(["@radix-ui/react-tabs"]);
    expect(names("radix-ui and base-ui")).toEqual(["radix-ui and base-ui"]);
    expect(names("@shadcn/ui")).toEqual(["@shadcn/ui"]);
    expect(names("Radix-based and shadcn-style")).toEqual([
      "Radix-based and shadcn-style",
    ]);
  });

  it("has an icon for every brand it can return", () => {
    for (const part of splitBrandText("Base UI Radix UI Next.js shadcn/ui")) {
      if (typeof part !== "string") {
        expect(BRAND_ICONS[part.brand].paths.length).toBeGreaterThan(0);
      }
    }
  });
});
