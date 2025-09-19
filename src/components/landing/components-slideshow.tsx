import Link from "next/link"

import { Button } from "@/components/button"
import Frame from "@/components/frame"
import Divider from "@/components/landing/divider"
import Rule from "@/components/landing/rule"
import { components } from "@/app/doc/data/components"

const SHOWCASE_COMPONENTS = [
  "Animated Tags",
  "Social Selector",
  "Power Off Slide",
  "Scrollable Card Stack",
  "User Account Avatar",
  "Number Flow",
  "Phototab",
  "Dynamic Island",
  "Image Metadata Preview",
]

export function ComponentsSlideshow() {
  return (
    <section className="bg-background relative px-8 py-24 transition">
      <Divider />
      <h2 className="font-title text-foreground text-center text-3xl font-semibold text-balance transition">
        Components Showcase
      </h2>
      <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-3">
        {components
          .filter((comp) => SHOWCASE_COMPONENTS.includes(comp.componentTitle))
          .map((component) => (
            <div key={component.id} className="relative">
              <Frame
                component={component}
                className="m-0 p-0 md:w-full"
                clean={false}
                group="components"
              />
            </div>
          ))}
      </div>
      <div className="mx-auto mt-8 flex justify-center">
        <Button asChild variant="candy">
          <Link href="/doc">View All Components</Link>
        </Button>
      </div>
    </section>
  )
}
