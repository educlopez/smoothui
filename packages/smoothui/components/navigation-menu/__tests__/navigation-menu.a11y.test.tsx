import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render, screen } from "../../../test-utils/render";
import NavigationMenuBase, {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "../navigation-menu.base";
import NavigationMenuRadix, {
  NavigationMenuContent as RadixContent,
  NavigationMenuItem as RadixItem,
  NavigationMenuLink as RadixLink,
  NavigationMenuList as RadixList,
  NavigationMenuTrigger as RadixTrigger,
  NavigationMenuViewport as RadixViewport,
} from "../navigation-menu.radix";

const expectCleanTrigger = async (container: HTMLElement) => {
  const trigger = screen.getByRole("button", { name: "Products" });
  expect(trigger.textContent?.trim()).toBe("Products");
  expect(trigger.querySelector("svg title")).toBeNull();
  expect(container.querySelector("svg title")).toBeNull();
  expect(trigger.querySelector("svg")?.getAttribute("aria-hidden")).toBe(
    "true"
  );
  expect(trigger.hasAttribute("aria-expanded")).toBe(true);
  expect(await axe(container)).toHaveNoViolations();
};

describe("NavigationMenu a11y", () => {
  it("Base: trigger name equals its text", async () => {
    const { container } = render(
      <NavigationMenuBase>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink href="#">Components</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuViewport />
      </NavigationMenuBase>
    );
    await expectCleanTrigger(container);
  });

  it("Radix: trigger name equals its text", async () => {
    const { container } = render(
      <NavigationMenuRadix>
        <RadixList>
          <RadixItem>
            <RadixTrigger>Products</RadixTrigger>
            <RadixContent>
              <RadixLink href="#">Components</RadixLink>
            </RadixContent>
          </RadixItem>
        </RadixList>
        <RadixViewport />
      </NavigationMenuRadix>
    );
    await expectCleanTrigger(container);
  });
});
