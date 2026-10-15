import { describe, expect, it } from "vitest";
import { fireEvent, render, waitFor } from "../../../test-utils/render";
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

/** Both twins express "on" and "disabled" through different variants. */
const ON_VARIANT = /^(data-pressed|data-\[state=on\]):/;
const DISABLED_VARIANT = /^(data-disabled|disabled):/;

const stateTokens = (el: Element, variant: RegExp) =>
  el.className
    .split(" ")
    .filter((token) => variant.test(token))
    .map((token) => token.replace(variant, ""))
    .sort((a, b) => a.localeCompare(b));

const ON_EXPECTED = [
  "bg-background",
  "border-border",
  "shadow-sm",
  "text-foreground",
];
const DISABLED_EXPECTED = [
  "bg-foreground/10",
  "border-foreground/25",
  "text-muted-foreground",
];

describe.each(twins)("ToggleGroup (%s) parity", (_name, Root, Item) => {
  const setup = () => {
    render(
      <Root aria-label="Alignment" defaultValue={["left"]}>
        <Item value="left">Left</Item>
        <Item value="center">Center</Item>
        <Item disabled value="right">
          Right
        </Item>
      </Root>
    );
    return Array.from(
      document.querySelectorAll<HTMLElement>("[data-slot]")
    ).filter((el) => el.tagName === "BUTTON");
  };

  it("exposes data-slot on the group and every item", () => {
    const items = setup();
    expect(items.length).toBe(3);
    expect(document.querySelector('[data-slot="toggle-group"]')).not.toBeNull();
    for (const item of items) {
      expect(item.getAttribute("data-slot")).toBeTruthy();
    }
  });

  it("shares the on-state and disabled-state class tokens", () => {
    const [on] = setup();
    expect(on).toBeDefined();
    const onTokens = stateTokens(on as HTMLElement, ON_VARIANT);
    for (const token of ON_EXPECTED) {
      expect(onTokens).toContain(token);
    }
    const disabledTokens = stateTokens(on as HTMLElement, DISABLED_VARIANT);
    for (const token of DISABLED_EXPECTED) {
      expect(disabledTokens).toContain(token);
    }
    const classes = (on as HTMLElement).className.split(" ");
    expect(classes).toContain("h-8");
    expect(classes).toContain("hover:bg-muted/80");
  });

  it("carries the positioned host and the coarse-pointer hit area", () => {
    const [on] = setup();
    expect(on).toBeDefined();
    const classes = (on as HTMLElement).classList;
    expect(classes.contains("relative")).toBe(true);
    for (const token of [
      "pointer-coarse:after:absolute",
      "pointer-coarse:after:size-full",
      "pointer-coarse:after:min-h-10",
      "pointer-coarse:after:min-w-10",
      "pointer-coarse:after:content-['']",
    ]) {
      expect(classes.contains(token)).toBe(true);
    }
  });

  it("scales the item while pressed", async () => {
    const [on] = setup();
    expect(on).toBeDefined();
    fireEvent.pointerDown(on as HTMLElement, {
      button: 0,
      pointerType: "mouse",
    });
    await waitFor(() =>
      expect((on as HTMLElement).style.transform).toContain("scale")
    );
  });
});
