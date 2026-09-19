import { readdirSync } from "node:fs";
import { expect, it } from "vitest";
import { blogArtwork, blogArtworkIds } from "../apps/docs/lib/blog-artwork";
import { castPeople } from "../packages/data/cast";
import {
  legacyPersonIds,
  people,
  personById,
  somePeople,
  testimonialsWithPeople,
} from "../packages/data/people";

it("uses canonical source identities for every fictional demo avatar", () => {
  expect(people).toHaveLength(50);
  for (const person of people) {
    const source = castPeople.find((entry) => entry.id === person.id);
    expect(source).toBeDefined();
    expect(person.name).toBe(source?.name);
    expect(person.role).toBe(source?.role);
    expect(person.avatar).toBe(source?.src);
    expect(person.email.endsWith("@example.com")).toBe(true);
  }
  expect(Object.keys(legacyPersonIds)).toHaveLength(144);
  for (const [legacyId, canonicalId] of Object.entries(legacyPersonIds)) {
    expect(personById(legacyId)).toBe(personById(canonicalId));
  }
  expect(somePeople(8, 60)).toHaveLength(8);
  expect(testimonialsWithPeople()).toHaveLength(10);
  expect(
    testimonialsWithPeople().every((entry) => entry.quote !== "undefined")
  ).toBe(true);
});

it("gives all blog posts approved coherent artwork with broad color variety", () => {
  const posts = readdirSync(
    new URL("../apps/docs/content/blog", import.meta.url)
  ).filter((name) => name.endsWith(".mdx"));
  expect(Object.keys(blogArtworkIds)).toHaveLength(posts.length);
  expect(new Set(Object.values(blogArtworkIds)).size).toBe(12);
  for (const file of posts) {
    const artwork = blogArtwork(`/blog/${file.replace(".mdx", "")}`);
    expect(artwork?.kind).toBe("abstract");
    expect(artwork?.src).toContain("imagekit.io");
  }
});

it("matches semantic tab and event imagery to their subjects", async () => {
  const { PHOTO_TABS, INVITES } = await import(
    "../apps/docs/examples/shared/demo-fixtures"
  );
  const { landscapes, events, sceneById } = await import(
    "../packages/data/scenes"
  );
  expect(landscapes).toHaveLength(8);
  expect(events).toHaveLength(4);
  expect(PHOTO_TABS.map((tab) => tab.name)).toEqual([
    "Mountains",
    "Sea",
    "Forest",
  ]);
  for (const tab of PHOTO_TABS) {
    expect(landscapes).toContainEqual(sceneById(tab.scene));
  }
  for (const invite of INVITES) {
    const image = sceneById(invite.scene);
    expect(events).toContainEqual(image);
    expect(image?.title).toBe(invite.title);
  }
});

it("retired stock avatar paths cannot reappear in source consumers", async () => {
  const { readFileSync } = await import("node:fs");
  const { join } = await import("node:path");
  function check(directory: string) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) {
        check(path);
      } else if (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts")) {
        expect(readFileSync(path, "utf8"), path).not.toContain(
          "smoothui/people/"
        );
      }
    }
  }
  check("apps/docs/examples");
  check("packages/smoothui/blocks");
  check("packages/smoothui/components");
  check("packages/smoothui/templates");
});

it("shares five new landscape subjects without relabeling real authors", async () => {
  const { STACK_SCENES, METADATA_SCENE, METADATA_DETAILS } = await import(
    "../apps/docs/examples/shared/demo-fixtures"
  );
  const { landscapes } = await import("../packages/data/scenes");
  expect(STACK_SCENES).toEqual([
    "volcanic-coast",
    "terracotta-dunes",
    "emerald-terraces",
    "glacial-lagoon",
  ]);
  for (const id of [...STACK_SCENES, METADATA_SCENE.id]) {
    expect(landscapes.some((asset) => asset.id === id)).toBe(true);
  }
  expect(METADATA_SCENE.id).toBe("turquoise-canyon");
  expect(METADATA_DETAILS.by).toContain("AI-generated");
  expect(METADATA_DETAILS.source).toBe(
    "https://magnific.com/app/creation/tCxv7KMmZJ"
  );
});
