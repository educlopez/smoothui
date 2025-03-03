import Frame from "@/app/components/frame"
import Divider from "@/app/components/landing/divider"
import { components } from "@/app/doc/data/components"

import Rule from "./rule"

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
        <h2 className="font-title text-light-950 dark:text-dark-950 text-center text-3xl font-bold transition">
          Component Showcase
        </h2>
        <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
          <a
            href="/doc"
            className="candy-btn group relative isolate inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium"
          >
            View All Components
          </a>
        </div>
      </div>
    </section>
  )
}
