import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { mediaCatalog } from "../apps/docs/lib/media-catalog";
import { castAnimals, castPeople } from "../packages/data/cast";
import { productImages } from "../packages/data/products";
import {
  approvedAbstracts,
  sceneAliases,
  sceneById,
  scenes,
} from "../packages/data/scenes";

describe("curated media catalog", () => {
  it("only exposes unique canonical images, never compatibility aliases", () => {
    expect(new Set(mediaCatalog.map((asset) => asset.id)).size).toBe(
      mediaCatalog.length
    );
    expect(new Set(mediaCatalog.map((asset) => asset.src)).size).toBe(
      mediaCatalog.length
    );
    expect(mediaCatalog.some((asset) => asset.id in sceneAliases)).toBe(false);
    expect(scenes).toEqual(approvedAbstracts);
    expect(approvedAbstracts).toHaveLength(12);
    expect(mediaCatalog).toHaveLength(95);
    expect(scenes.every((asset) => asset.kind === "abstract")).toBe(true);
    for (const id of Object.keys(sceneAliases)) {
      expect(approvedAbstracts).toContainEqual(sceneById(id));
    }
  });

  it("imports the complete generated cast with source gender labels", () => {
    const provenance = JSON.parse(
      readFileSync(
        new URL(
          "../docs/contributing/media-provenance/troupe-import.json",
          import.meta.url
        ),
        "utf8"
      )
    ) as { assets: { id: string; gender: string }[] };
    expect(castPeople).toHaveLength(50);
    expect(castAnimals).toHaveLength(18);
    expect(
      castPeople.filter((asset) => asset.gender === "female")
    ).toHaveLength(26);
    expect(castPeople.filter((asset) => asset.gender === "male")).toHaveLength(
      20
    );
    expect(
      castPeople.filter((asset) => asset.gender === "nonbinary")
    ).toHaveLength(4);
    for (const asset of [...castPeople, ...castAnimals]) {
      expect(asset.gender).toBe(
        provenance.assets.find((source) => source.id === asset.id)?.gender
      );
      expect(sceneById(asset.id)).toEqual(asset);
    }
  });

  it("excludes retired portraits and uses the approved Nymara card", () => {
    const people = mediaCatalog.filter((asset) => asset.category === "People");
    expect(people).toHaveLength(50);
    expect(people.filter((asset) => !asset.gender)).toHaveLength(0);
    for (const id of [
      "sky-freckles",
      "warm-wall",
      "golden-hour",
      "windswept",
      "open-sky",
    ]) {
      expect(sceneById(id)).toBeUndefined();
      expect(mediaCatalog.some((asset) => asset.id === id)).toBe(false);
    }
    expect(
      mediaCatalog.filter((asset) => asset.category === "Animals")
    ).toHaveLength(18);
    expect(sceneById("moon-tarot")).toBeUndefined();
    expect(sceneById("nymara")?.src).toContain("/cards/nymara.webp");
    expect(
      mediaCatalog.filter((asset) => asset.category === "Card art")
    ).toHaveLength(1);
    expect(mediaCatalog.find((asset) => asset.id === "sneaker")?.src).toContain(
      "/products/ivory-sneaker.webp"
    );
  });
  it("shares two generated products with stable IDs and new sources", () => {
    expect(productImages).toHaveLength(2);
    expect(productImages.map((item) => item.id)).toEqual([
      "sneaker",
      "headphones",
    ]);
    for (const item of productImages) {
      const asset = mediaCatalog.find((entry) => entry.id === item.id);
      expect(asset?.src).toBe(item.src);
      expect(asset?.alt).toBe(item.alt);
      expect(item.src).toContain(`/products/ivory-${item.id}.webp`);
      expect(asset?.usage).toContain("product-card");
    }
  });
});
