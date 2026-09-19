import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { landingBackgrounds } from "../apps/docs/lib/landing-backgrounds";
import { mediaCatalog } from "../apps/docs/lib/media-catalog";
import { approvedAbstracts } from "../packages/data/scenes";

describe("landing background selection", () => {
  it("uses five distinct approved canonical assets and exposes landing usage", () => {
    expect(landingBackgrounds.uicraft.id).toBe("cobalt-pink");
    expect(mediaCatalog).toHaveLength(95);
    const backgrounds = Object.values(landingBackgrounds);
    expect(backgrounds).toHaveLength(5);
    expect(new Set(backgrounds.map((asset) => asset.id)).size).toBe(5);
    for (const asset of backgrounds) {
      expect(approvedAbstracts).toContainEqual(asset);
      expect(asset.kind).toBe("abstract");
      expect(
        mediaCatalog.find((entry) => entry.id === asset.id)?.usage
      ).toContain("landing");
    }
  });

  it("removes the five retired decorative photo references", () => {
    const sources = [
      "features",
      "ai-section",
      "skills-section",
      "what-they-say",
    ]
      .map((name) =>
        readFileSync(
          new URL(
            `../apps/docs/components/landing/${name}.tsx`,
            import.meta.url
          ),
          "utf8"
        )
      )
      .join("\n");
    for (const name of [
      "why-choose.webp",
      "ai-mcp.webp",
      "skill-meadow.webp",
      "testimonial-1.jpg",
      "testimonial-2.jpg",
    ]) {
      expect(sources).not.toContain(`/scenes/${name}`);
    }
  });
});
