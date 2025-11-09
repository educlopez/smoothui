import Link from "next/link";
import Divider from "@docs/components/landing/divider";
import Frame from "@docs/components/landing/frame";
import { Button } from "@docs/components/smoothbutton";
// Use example wrappers so each component has sensible demo props
import AnimatedTags from "@docs/examples/animated-tags";
import DynamicIsland from "@docs/examples/dynamic-island";
import ImageMetadataPreview from "@docs/examples/image-metadata-preview";
import NumberFlow from "@docs/examples/number-flow";
import Phototab from "@docs/examples/phototab";
import PowerOffSlide from "@docs/examples/power-off-slide";
import ScrollableCardStack from "@docs/examples/scrollable-card-stack";
import SocialSelector from "@docs/examples/social-selector";
import UserAccountAvatar from "@docs/examples/user-account-avatar";

const SHOWCASE_COMPONENTS = [
  { id: "animatedTags", component: AnimatedTags },
  { id: "socialSelector", component: SocialSelector },
  { id: "powerOffSlide", component: PowerOffSlide },
  { id: "scrollableCardStack", component: ScrollableCardStack },
  { id: "userAccountAvatar", component: UserAccountAvatar },
  { id: "numberFlow", component: NumberFlow },
  { id: "phototab", component: Phototab },
  { id: "dynamicIsland", component: DynamicIsland },
  { id: "imageMetadataPreview", component: ImageMetadataPreview },
];

export function ComponentsSlideshow() {
  return (
    <section className="relative bg-background px-8 py-24 transition">
      <Divider />
      <h2 className="text-balance text-center font-semibold font-title text-3xl text-foreground transition">
        Components Showcase
      </h2>
      <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-3">
        {SHOWCASE_COMPONENTS.map(({ id, component }) => (
          <div className="relative" key={id}>
            <Frame
              className="m-0 p-0 md:w-full"
              clean={false}
              component={component}
              group="components"
            />
          </div>
        ))}
      </div>
      <div className="mx-auto mt-8 flex justify-center">
        <Button asChild variant="candy">
          <Link href="/docs/components">View All Components</Link>
        </Button>
      </div>
    </section>
  );
}
