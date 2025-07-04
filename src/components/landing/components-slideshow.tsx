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
  "Expandable Cards",
  "User Account Avatar",
  "Number Flow",
]

export function ComponentsSlideshow() {
  return (
    <section className="relative py-24 transition">
      <Rule position="bottom-right" />
      <Rule position="bottom-left" />
      <Divider />
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="font-title text-foreground text-center text-3xl font-bold transition">
          Component Showcase
        </h2>
        <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-3">
          {components
            .filter((comp) => SHOWCASE_COMPONENTS.includes(comp.componentTitle))
            .map((component) => (
              <div key={component.id} className="relative">
                <Frame
                  component={component}
                  className="m-0 p-0 md:w-full"
                  clean={true}
                />
              </div>
            ))}
        </div>
        <div className="mx-auto mt-8 flex justify-center">
          <Button asChild variant="candy">
            <Link href="/doc">View All Components</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
