import { describe, expect, it } from "vitest";
import { getLastModified } from "../last-modified";

describe("getLastModified", () => {
  it("returns undefined when the path is missing from the manifest", () => {
    expect(getLastModified("does-not-exist.mdx")).toBeUndefined();
  });

  it("does not throw for empty or odd paths", () => {
    expect(getLastModified("")).toBeUndefined();
    expect(getLastModified("components/dock")).toEqual(
      getLastModified("components/dock.mdx")
    );
  });
});
