import Footer from "@/app/components/footer"
import Frame from "@/app/components/frame"
import Head from "@/app/components/head"
import { components } from "@/app/data"
import type { ComponentsProps } from "@/app/data"

export default function Home() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between">
        <Head />
        <div className="flex flex-col gap-20 py-4">
          <div className="grid">
            {components
              .slice()
              .reverse()
              .map((component: ComponentsProps) => (
                <Frame key={component.id} component={component} />
              ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
