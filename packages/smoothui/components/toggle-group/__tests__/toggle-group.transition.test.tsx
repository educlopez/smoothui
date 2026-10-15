import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import {
  ToggleGroupItem as BaseItem,
  ToggleGroupRoot as BaseRoot,
} from "../toggle-group.base";
import {
  ToggleGroupItem as RadixItem,
  ToggleGroupRoot as RadixRoot,
} from "../toggle-group.radix";

const twins = [
  ["Base", BaseRoot, BaseItem],
  ["Radix", RadixRoot, RadixItem],
] as const;

describe.each(twins)(
  "ToggleGroup (%s) state transition",
  (_name, Root, Item) => {
    it("gives every item the shared state transition and focus ring", () => {
      const { container } = render(
        <Root aria-label="Align">
          <Item aria-label="Left" value="left">
            L
          </Item>
          <Item aria-label="Right" value="right">
            R
          </Item>
        </Root>
      );
      const items = container.querySelectorAll("button");
      expect(items.length).toBe(2);
      for (const item of items) {
        expect(item.classList.contains("state-transition")).toBe(true);
        expect(item.classList.contains("focus-ring")).toBe(true);
      }
    });
  }
);
