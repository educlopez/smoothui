"use client";

import NavigationMenu, {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@repo/smoothui/components/navigation-menu";

const FeaturesDemo = () => (
  <div className="flex items-center justify-center p-8">
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Product</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-64 gap-1 p-1">
              <li>
                <NavigationMenuLink href="#">
                  <div className="font-medium">Components</div>
                  <p className="text-muted-foreground text-xs">
                    Motion-first primitives
                  </p>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="#">
                  <div className="font-medium">Blocks</div>
                  <p className="text-muted-foreground text-xs">
                    Ready-made page sections
                  </p>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-56 gap-1 p-1">
              <li>
                <NavigationMenuLink href="#">Docs</NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="#">Changelog</NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            className="inline-flex h-9 items-center px-3 font-medium"
            href="#"
          >
            Pricing
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuViewport />
    </NavigationMenu>
  </div>
);

export const demoScenes = {
  Features: FeaturesDemo,
};

export default function NavigationMenuDemo() {
  return <FeaturesDemo />;
}
