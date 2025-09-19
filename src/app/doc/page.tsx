import type { Metadata } from "next"
import Link from "next/link"

import { Breadcrumbs } from "@/components/doc/breadcrumbs"

export const metadata: Metadata = {
  title: "Introduction",
  description:
    "Learn what SmoothUI is and how to get started with customizable React components built using TailwindCSS and Framer Motion.",
}

export default function IntroductionPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Breadcrumbs groupName="Get Started" currentPage="Introduction" />
        <div className="space-y-3.5">
          <h1
            data-table-content="Introduction"
            data-level="1"
            className="text-foreground text-3xl font-semibold -tracking-wide"
          >
            Introduction
          </h1>
          <p className="text-foreground/70 text-sm leading-relaxed font-normal">
            SmoothUI is a collection of beautifully designed components with
            smooth animations built with React, Tailwind CSS, and Framer Motion.
          </p>
        </div>
      </div>

      {/* What is SmoothUI? */}
      <div className="space-y-4">
        <h2
          data-table-content="What is SmoothUI?"
          data-level="2"
          className="text-foreground text-lg font-semibold"
        >
          What is SmoothUI?
        </h2>
        <p className="text-foreground/70 text-sm leading-relaxed">
          SmoothUI is a modern component library that brings together the best
          of React, Tailwind CSS, and Framer Motion to create beautiful,
          accessible, and performant user interfaces. Each component is
          carefully crafted with smooth animations and thoughtful design
          principles.
        </p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-primary/50 rounded-lg border p-4">
            <h3 className="text-foreground mb-2 text-lg font-semibold">
              🎨 Beautiful Design
            </h3>
            <p className="text-foreground/70 text-sm leading-relaxed">
              Carefully crafted components with attention to detail and modern
              design principles.
            </p>
          </div>

          <div className="bg-primary/50 rounded-lg border p-4">
            <h3 className="text-foreground mb-2 text-lg font-semibold">
              ⚡ Smooth Animations
            </h3>
            <p className="text-foreground/70 text-sm leading-relaxed">
              Powered by Framer Motion for fluid, performant animations that
              enhance user experience.
            </p>
          </div>

          <div className="bg-primary/50 rounded-lg border p-4">
            <h3 className="text-foreground mb-2 text-lg font-semibold">
              🛠️ Developer Friendly
            </h3>
            <p className="text-foreground/70 text-sm leading-relaxed">
              Built with TypeScript, fully customizable with Tailwind CSS, and
              easy to integrate.
            </p>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="space-y-4">
        <h2
          data-table-content="Key Features"
          data-level="2"
          className="text-foreground text-lg font-semibold"
        >
          Key Features
        </h2>
        <ul className="text-foreground/70 [&_strong]:text-foreground list-disc space-y-2 pl-6 text-sm leading-relaxed">
          <li>
            <strong>shadcn CLI Compatible</strong>: Install components using the
            familiar shadcn CLI
          </li>
          <li>
            <strong>MCP Support</strong>: AI assistants can discover and install
            components automatically
          </li>
          <li>
            <strong>TypeScript First</strong>: Full type safety with
            comprehensive TypeScript support
          </li>
          <li>
            <strong>Accessible by Default</strong>: Built with accessibility
            best practices
          </li>
          <li>
            <strong>Dark Mode Support</strong>: All components work seamlessly
            in light and dark themes
          </li>
          <li>
            <strong>Customizable</strong>: Easy to customize with Tailwind CSS
            classes
          </li>
          <li>
            <strong>Performance Optimized</strong>: Built with performance in
            mind using modern React patterns
          </li>
        </ul>
      </div>

      {/* Navigation Cards */}
      <div className="space-y-4">
        <h2
          data-table-content="Get Started"
          data-level="2"
          className="text-foreground text-lg font-semibold"
        >
          Get Started
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Link
            href="/doc/installation"
            className="group bg-primary hover:bg-primary/80 rounded-lg border p-6 transition-colors"
          >
            <h3 className="group-hover:text-brand mb-2 font-semibold transition-colors">
              Installation Guide
            </h3>
            <p className="text-foreground/70 text-sm leading-relaxed">
              Learn how to install SmoothUI components using shadcn CLI or
              manual installation methods.
            </p>
          </Link>

          <Link
            href="/doc/components"
            className="group bg-primary hover:bg-primary/80 rounded-lg border p-6 transition-colors"
          >
            <h3 className="group-hover:text-brand mb-2 font-semibold transition-colors">
              Browse All Components
            </h3>
            <p className="text-foreground/70 text-sm leading-relaxed">
              Explore all available components with live demos and
              documentation.
            </p>
          </Link>
        </div>
      </div>

      {/* FAQ */}
      <div className="space-y-4">
        <h2
          data-table-content="Frequently Asked Questions"
          data-level="2"
          className="text-foreground text-lg font-semibold"
        >
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          <div className="bg-primary/50 rounded-lg border p-4">
            <h3 className="text-foreground mb-2 text-lg font-semibold">
              Is SmoothUI free to use?
            </h3>
            <p className="text-foreground/70 text-sm leading-relaxed">
              Yes! SmoothUI is completely free and open source. You can use it
              in personal and commercial projects.
            </p>
          </div>

          <div className="bg-primary/50 rounded-lg border p-4">
            <h3 className="text-foreground mb-2 text-lg font-semibold">
              Do I need to know Framer Motion to use SmoothUI?
            </h3>
            <p className="text-foreground/70 text-sm leading-relaxed">
              No! All animations are built-in. You can use components without
              any Framer Motion knowledge.
            </p>
          </div>

          <div className="bg-primary/50 rounded-lg border p-4">
            <h3 className="text-foreground mb-2 text-lg font-semibold">
              Can I customize the components?
            </h3>
            <p className="text-foreground/70 text-sm leading-relaxed">
              Absolutely! All components are built with Tailwind CSS and can be
              customized using standard Tailwind classes.
            </p>
          </div>

          <div className="bg-primary/50 rounded-lg border p-4">
            <h3 className="text-foreground mb-2 text-lg font-semibold">
              Does SmoothUI work with Next.js?
            </h3>
            <p className="text-foreground/70 text-sm leading-relaxed">
              Yes! SmoothUI works with any React framework including Next.js,
              Vite, Create React App, and more.
            </p>
          </div>
        </div>
      </div>

      {/* Contributing */}
      <div className="space-y-4">
        <h2
          data-table-content="Contributing"
          data-level="2"
          className="text-foreground text-lg font-semibold"
        >
          Contributing
        </h2>
        <p className="text-foreground/70 text-sm leading-relaxed">
          We welcome contributions to SmoothUI! Whether you want to add new
          components, improve existing ones, or fix bugs, your contributions
          help make SmoothUI better for everyone.
        </p>

        <div className="bg-primary/50 rounded-lg border p-4">
          <h3 className="text-foreground mb-2 text-lg font-semibold">
            How to Contribute
          </h3>
          <ul className="text-foreground/70 list-disc space-y-1 pl-6 text-sm leading-relaxed">
            <li>Fork the repository on GitHub</li>
            <li>Create a new branch for your feature or bug fix</li>
            <li>Make your changes and test them thoroughly</li>
            <li>Submit a pull request with a clear description</li>
          </ul>
        </div>

        <p className="text-foreground/70 text-sm leading-relaxed">
          Check out our{" "}
          <Link href="/doc/contributing" className="text-brand hover:underline">
            contributing guide
          </Link>{" "}
          for more detailed information.
        </p>
      </div>
    </div>
  )
}
