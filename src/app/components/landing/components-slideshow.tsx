import Frame from "@/app/components/frame"
import Divider from "@/app/components/landing/divider"
import { components } from "@/app/data"

import Rule from "./rule"

const SHOWCASE_COMPONENTS = [
  "Animated Tags",
  "Social Selector",
  "Power Off Slide",
]

export function ComponentsSlideshow() {
  return (
    <section className="relative bg-light2 py-24 transition dark:bg-dark2">
      <Rule position="bottom-right" />
      <Rule position="bottom-left" />
      <Divider />
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-center font-title text-3xl font-bold text-light12 transition dark:text-dark12">
          Component Showcase
        </h2>
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3">
          {components
            .filter((comp) => SHOWCASE_COMPONENTS.includes(comp.componentTitle))
            .map((component) => (
              <div key={component.id} className="relative">
                <Frame
                  component={component}
                  className="md:w-full"
                  clean={true}
                />
              </div>
            ))}
        </div>
      </div>
    </section>
  )
}
