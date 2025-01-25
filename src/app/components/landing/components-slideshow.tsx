import Frame from "@/app/components/frame"
import Divider from "@/app/components/landing/divider"
import { components } from "@/app/doc/data"

import Rule from "./rule"

const SHOWCASE_COMPONENTS = [
  "Animated Tags",
  "Social Selector",
  "Power Off Slide",
]

export function ComponentsSlideshow() {
  return (
    <section className="bg-light2 dark:bg-dark2 relative py-24 transition">
      <Rule position="bottom-right" />
      <Rule position="bottom-left" />
      <Divider />
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="font-title text-light12 dark:text-dark12 text-center text-3xl font-bold transition">
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
