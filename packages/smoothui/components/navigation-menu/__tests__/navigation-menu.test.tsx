import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render, screen } from "../../../test-utils/render";
import NavigationMenu, {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "../index";
import RadixNavigationMenu, {
  NavigationMenuItem as RadixItem,
  NavigationMenuLink as RadixLink,
  NavigationMenuList as RadixList,
} from "../navigation-menu.radix";

describe("NavigationMenu", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink href="#">Components</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuViewport />
      </NavigationMenu>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders triggers", () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Docs</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink href="#">Guide</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuViewport />
      </NavigationMenu>
    );
    expect(screen.getByRole("button", { name: /Docs/i })).toBeInTheDocument();
  });
});

describe("NavigationMenu (Radix twin)", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <RadixNavigationMenu>
        <RadixList>
          <RadixItem>
            <RadixLink href="#">Home</RadixLink>
          </RadixItem>
        </RadixList>
      </RadixNavigationMenu>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
